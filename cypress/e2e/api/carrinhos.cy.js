import { criarProduto } from '../../support/factories/produtoFactory'
import { criarUsuario } from '../../support/factories/usuarioFactory'
import authService from '../../support/services/AuthService'
import carrinhoService from '../../support/services/CarrinhoService'
import produtoService from '../../support/services/ProdutoService'
import usuarioService from '../../support/services/UsuarioService'
import { messages } from '../../support/constants/messages'
import { carrinho, recursoCriado } from '../../support/schemas'

describe('API - Carrinhos', () => {
  const quantidadeComprada = 2
  const estado = {}

  beforeEach(() => {
    estado.admin = criarUsuario({ administrador: 'true' })
    estado.comprador = criarUsuario()
    estado.produto = criarProduto({ preco: 40, quantidade: 10 })
    estado.tokenAdmin = null
    estado.tokenComprador = null

    cy.log('Prepara administrador, comprador e produto com estoque para o carrinho')

    usuarioService.criar(estado.admin).then((response) => {
      expect(response.status, 'cadastro do administrador').to.eq(201)
      estado.admin._id = response.body._id
      return usuarioService.criar(estado.comprador)
    }).then((response) => {
      expect(response.status, 'cadastro do comprador').to.eq(201)
      estado.comprador._id = response.body._id
      return authService.login(estado.admin)
    }).then((response) => {
      expect(response.status, 'login do administrador').to.eq(200)
      estado.tokenAdmin = response.body.authorization
      return authService.login(estado.comprador)
    }).then((response) => {
      expect(response.status, 'login do comprador').to.eq(200)
      estado.tokenComprador = response.body.authorization
      return produtoService.criar(estado.produto, estado.tokenAdmin)
    }).then((response) => {
      expect(response.status, 'cadastro do produto').to.eq(201)
      estado.produto._id = response.body._id
    })
  })

  afterEach(() => {
    cy.log('Cancela o carrinho, se ainda existir, e remove produto e usuários do cenário')

    if (estado.tokenComprador) {
      carrinhoService.cancelarCompra(estado.tokenComprador)
    }
    if (estado.produto._id && estado.tokenAdmin) {
      produtoService.excluir(estado.produto._id, estado.tokenAdmin)
    }
    if (estado.comprador._id) {
      usuarioService.excluir(estado.comprador._id)
    }
    if (estado.admin._id) {
      usuarioService.excluir(estado.admin._id)
    }
  })

  it('valida a reserva do estoque na criação do carrinho e a devolução da quantidade ao cancelar a compra', () => {
    const estoqueInicial = estado.produto.quantidade
    const precoTotal = estado.produto.preco * quantidadeComprada

    cy.log(`Cria o carrinho com ${quantidadeComprada} unidades de "${estado.produto.nome}"`)
    carrinhoService.criar({
      produtos: [{
        idProduto: estado.produto._id,
        quantidade: quantidadeComprada,
      }],
    }, estado.tokenComprador).then((response) => {
      cy.log(`Valida o cadastro do carrinho: status ${response.status} (esperado 201) e mensagem "${response.body.message}"`)
      expect(response.status, 'status do cadastro do carrinho').to.eq(201)
      expect(response.body.message, 'mensagem do cadastro do carrinho').to.eq(messages.cadastroSucesso)
      cy.log('Valida o contrato do cadastro: message e _id')
      cy.validateSchema(recursoCriado, response.body, 'cadastro do carrinho')

      cy.log(`Consulta o carrinho ${response.body._id}`)
      return carrinhoService.buscarPorId(response.body._id)
    }).then((response) => {
      cy.log(`Valida preço total R$${precoTotal}, quantidade ${quantidadeComprada}, comprador e produto do carrinho`)
      expect(response.status, 'status da consulta do carrinho').to.eq(200)
      expect(response.body.precoTotal, 'preço total do carrinho').to.eq(precoTotal)
      expect(response.body.quantidadeTotal, 'quantidade total do carrinho').to.eq(quantidadeComprada)
      expect(response.body.idUsuario, 'usuário dono do carrinho').to.eq(estado.comprador._id)
      expect(response.body.produtos, 'produtos do carrinho').to.deep.equal([{
        idProduto: estado.produto._id,
        quantidade: quantidadeComprada,
        precoUnitario: estado.produto.preco,
      }])
      cy.log('Valida o contrato da consulta do carrinho')
      cy.validateSchema(carrinho, response.body, 'consulta do carrinho')

      cy.log('Consulta o estoque do produto depois de criar o carrinho')
      return produtoService.buscarPorId(estado.produto._id)
    }).then((response) => {
      cy.log(`Valida a reserva do estoque: de ${estoqueInicial} para ${estoqueInicial - quantidadeComprada}`)
      expect(response.status, 'status da consulta do estoque reservado').to.eq(200)
      expect(response.body.quantidade, 'estoque após reservar o carrinho').to.eq(estoqueInicial - quantidadeComprada)

      cy.log('Cancela a compra')
      return carrinhoService.cancelarCompra(estado.tokenComprador)
    }).then((response) => {
      cy.log(`Valida o cancelamento: status ${response.status} (esperado 200) e mensagem "${response.body.message}"`)
      expect(response.status, 'status do cancelamento da compra').to.eq(200)
      expect(response.body.message, 'mensagem do cancelamento da compra').to.eq(messages.compraCancelada)

      cy.log('Consulta o estoque do produto depois do cancelamento')
      return produtoService.buscarPorId(estado.produto._id)
    }).then((response) => {
      cy.log(`Valida a devolução do estoque para ${estoqueInicial}`)
      expect(response.status, 'status da consulta do estoque devolvido').to.eq(200)
      expect(response.body.quantidade, 'estoque após cancelar a compra').to.eq(estoqueInicial)
    })
  })
})
