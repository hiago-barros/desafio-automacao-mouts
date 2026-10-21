import BasePage, { testIds } from './BasePage'

class HomePage extends BasePage {
  constructor() {
    super('/home')
  }

  campoPesquisa() {
    return this.getByTestId(testIds.home.pesquisar)
  }

  botaoPesquisar() {
    return this.getByTestId(testIds.home.botaoPesquisar)
  }

  botaoLogout() {
    return this.getByTestId(testIds.home.logout)
  }

  pesquisar(termo) {
    cy.intercept('GET', /\/produtos\?nome=/).as('pesquisaDeProdutos')

    this.campoPesquisa()
      .should('be.visible')
      .clear()
      .type(termo)
      .should('have.value', termo)

    this.botaoPesquisar().click()
    cy.wait('@pesquisaDeProdutos')

    return cy.contains('.card-title', termo).should('be.visible')
  }

  adicionarProdutoALista(nome) {
    cy.contains('.card-title', nome)
      .should('be.visible')
      .parents('.card')
      .find(`[data-testid="${testIds.home.adicionarNaLista}"]`)
      .click()
  }

  sair() {
    this.botaoLogout().should('be.visible').click()
  }
}

export default new HomePage()
