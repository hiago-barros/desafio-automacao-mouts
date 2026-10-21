import { criarProduto } from '../../support/factories/produtoFactory'
import { criarUsuario } from '../../support/factories/usuarioFactory'
import authService from '../../support/services/AuthService'
import produtoService from '../../support/services/ProdutoService'
import usuarioService from '../../support/services/UsuarioService'
import { messages } from '../../support/constants/messages'
import { mensagem, produto, recursoCriado } from '../../support/schemas'

describe('API - Produtos', () => {
  const estado = {}

  beforeEach(() => {
    estado.admin = criarUsuario({ administrador: 'true' })
    estado.comum = criarUsuario()
    estado.produto = criarProduto({ preco: 79, quantidade: 4 })
    estado.tokenAdmin = null

    cy.log('Prepara administrador e usuário comum autenticados')

    usuarioService.criar(estado.admin).then((response) => {
      expect(response.status, 'cadastro do administrador').to.eq(201)
      estado.admin._id = response.body._id
      return usuarioService.criar(estado.comum)
    }).then((response) => {
      expect(response.status, 'cadastro do usuário comum').to.eq(201)
      estado.comum._id = response.body._id
      return authService.login(estado.admin)
    }).then((response) => {
      expect(response.status, 'login do administrador').to.eq(200)
      estado.tokenAdmin = response.body.authorization
      return authService.login(estado.comum)
    }).then((response) => {
      expect(response.status, 'login do usuário comum').to.eq(200)
      estado.tokenComum = response.body.authorization
    })
  })

  afterEach(() => {
    cy.log('Remove produto, administrador e usuário comum criados no cenário')

    if (estado.produto._id && estado.tokenAdmin) {
      produtoService.excluir(estado.produto._id, estado.tokenAdmin)
    }
    if (estado.admin._id) {
      usuarioService.excluir(estado.admin._id)
    }
    if (estado.comum._id) {
      usuarioService.excluir(estado.comum._id)
    }
  })

  it('valida o cadastro pelo administrador, a recusa de nome duplicado, o bloqueio de usuário comum e a exclusão do produto', () => {
    cy.log(`Cadastra o produto "${estado.produto.nome}" como administrador`)
    produtoService.criar(estado.produto, estado.tokenAdmin).then((response) => {
      cy.log(`Valida o cadastro do produto: status ${response.status} (esperado 201) e mensagem "${response.body.message}"`)
      expect(response.status, 'status do cadastro do produto').to.eq(201)
      expect(response.body.message, 'mensagem do cadastro do produto').to.eq(messages.cadastroSucesso)
      cy.log('Valida o contrato do cadastro: message e _id')
      cy.validateSchema(recursoCriado, response.body, 'cadastro do produto')

      estado.produto._id = response.body._id
      cy.log(`Consulta o produto pelo id ${estado.produto._id}`)
      return produtoService.buscarPorId(estado.produto._id)
    }).then((response) => {
      cy.log('Valida se a consulta retornou nome, preço, descrição, quantidade e o mesmo id')
      expect(response.status, 'status da consulta do produto').to.eq(200)
      expect(response.body, 'dados do produto consultado').to.deep.equal({
        nome: estado.produto.nome,
        preco: estado.produto.preco,
        descricao: estado.produto.descricao,
        quantidade: estado.produto.quantidade,
        _id: estado.produto._id,
      })
      cy.log('Valida o contrato da consulta do produto')
      cy.validateSchema(produto, response.body, 'consulta do produto')

      cy.log(`Tenta cadastrar de novo o produto "${estado.produto.nome}"`)
      return produtoService.criar({
        nome: estado.produto.nome,
        preco: estado.produto.preco,
        descricao: estado.produto.descricao,
        quantidade: estado.produto.quantidade,
      }, estado.tokenAdmin)
    }).then((response) => {
      cy.log(`Valida a recusa do nome duplicado: status ${response.status} (esperado 400) e mensagem "${response.body.message}"`)
      expect(response.status, 'status do nome duplicado').to.eq(400)
      expect(response.body.message, 'mensagem de nome duplicado').to.eq(messages.produtoNomeDuplicado)
      cy.log('Valida o contrato do erro de nome duplicado')
      cy.validateSchema(mensagem, response.body, 'nome de produto duplicado')

      cy.log('Tenta cadastrar um produto com usuário comum')
      return produtoService.criar(criarProduto(), estado.tokenComum)
    }).then((response) => {
      cy.log(`Valida o bloqueio do usuário comum: status ${response.status} (esperado 403) e mensagem "${response.body.message}"`)
      expect(response.status, 'status do usuário sem permissão').to.eq(403)
      expect(response.body.message, 'mensagem de rota exclusiva para administradores').to.eq(messages.rotaAdministradores)
      cy.log('Valida o contrato do erro de permissão')
      cy.validateSchema(mensagem, response.body, 'rota exclusiva para administradores')

      const idProduto = estado.produto._id
      cy.log(`Exclui o produto ${idProduto}`)
      return produtoService.excluir(idProduto, estado.tokenAdmin).then((exclusao) => {
        cy.log(`Valida a exclusão: status ${exclusao.status} (esperado 200) e mensagem "${exclusao.body.message}"`)
        expect(exclusao.status, 'status da exclusão do produto').to.eq(200)
        expect(exclusao.body.message, 'mensagem da exclusão do produto').to.eq(messages.registroExcluido)
        estado.produto._id = null

        cy.log(`Consulta o produto ${idProduto} depois da exclusão`)
        return produtoService.buscarPorId(idProduto)
      })
    }).then((response) => {
      cy.log(`Valida se o produto excluído não é encontrado: status ${response.status} (esperado 400) e mensagem "${response.body.message}"`)
      expect(response.status, 'status da consulta após exclusão').to.eq(400)
      expect(response.body.message, 'mensagem de produto não encontrado').to.eq(messages.produtoNaoEncontrado)
    })
  })
})
