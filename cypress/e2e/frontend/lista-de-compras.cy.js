import loginPage from '../../support/pages/LoginPage'
import homePage from '../../support/pages/HomePage'
import listaPage from '../../support/pages/ListaComprasPage'
import { criarUsuario } from '../../support/factories/usuarioFactory'
import { criarProduto } from '../../support/factories/produtoFactory'
import usuarioService from '../../support/services/UsuarioService'
import produtoService from '../../support/services/ProdutoService'
import authService from '../../support/services/AuthService'
import { testIds } from '../../support/constants/testIds'
import { messages } from '../../support/constants/messages'

describe('Frontend - Lista de compras', () => {
  const estado = {}

  beforeEach(() => {
    estado.admin = criarUsuario({ administrador: 'true' })
    estado.comprador = criarUsuario()
    estado.produto = criarProduto({ preco: 25, quantidade: 8 })
    estado.tokenAdmin = null

    cy.log('Prepara administrador, comprador e produto usados no cenário')

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
      return produtoService.criar(estado.produto, estado.tokenAdmin)
    }).then((response) => {
      expect(response.status, 'cadastro do produto').to.eq(201)
      estado.produto._id = response.body._id
    })
  })

  afterEach(() => {
    cy.log('Remove produto, comprador e administrador criados no cenário')

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

  it('valida nome, preço e quantidade na lista, o novo total ao aumentar a quantidade e a mensagem de carrinho vazio', () => {
    const { produto, comprador } = estado

    cy.log(`Entra na loja com o comprador ${comprador.email}`)
    loginPage.visit()
    loginPage.preencherEmail(comprador.email)
    loginPage.preencherSenha(comprador.password)
    loginPage.submeter()

    cy.log('Valida se o comprador entrou na home (/home)')
    cy.url({ timeout: 20000 }).should('include', '/home')

    cy.log('Valida se o botão de logout está disponível')
    homePage.botaoLogout().should('be.visible')

    cy.log(`Pesquisa "${produto.nome}" e valida se o produto aparece na home`)
    homePage.pesquisar(produto.nome)

    cy.log(`Adiciona "${produto.nome}" à lista de compras`)
    homePage.adicionarProdutoALista(produto.nome)

    cy.log('Valida se abriu a lista de compras (/minhaListaDeProdutos)')
    cy.url().should('include', '/minhaListaDeProdutos')

    cy.log(`Valida nome "${produto.nome}", preço R$${produto.preco} e quantidade 1`)
    listaPage.cardDoProduto(produto.nome).within(() => {
      cy.get(`[data-testid="${testIds.lista.nomeProduto}"]`)
        .should('normalizedText', `Produto:${produto.nome}`)
      cy.contains('p', 'Preço R$')
        .should('normalizedText', `Preço R$${produto.preco}`)
      cy.get(`[data-testid="${testIds.lista.quantidade}"]`)
        .should('normalizedText', 'Total: 1')
    })

    cy.log('Aumenta a quantidade do produto')
    listaPage.aumentarQuantidade(produto.nome)

    cy.log(`Valida o preço atualizado R$${produto.preco * 2} e a quantidade 2`)
    listaPage.cardDoProduto(produto.nome).within(() => {
      cy.contains('p', 'Preço R$')
        .should('normalizedText', `Preço R$${produto.preco * 2}`)
      cy.get(`[data-testid="${testIds.lista.quantidade}"]`)
        .should('normalizedText', 'Total: 2')
    })

    cy.log('Limpa a lista de compras')
    listaPage.limpar()

    cy.log(`Valida se a lista exibe "${messages.carrinhoVazio}"`)
    listaPage.mensagemVazia()
      .should('be.visible')
      .and('have.text', messages.carrinhoVazio)
  })
})
