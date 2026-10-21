import BasePage, { testIds } from './BasePage'

class ListaComprasPage extends BasePage {
  constructor() {
    super('/minhaListaDeProdutos')
  }

  cardDoProduto(nome) {
    return cy
      .contains(`[data-testid="${testIds.lista.nomeProduto}"]`, nome)
      .parents('.card')
  }

  aumentarQuantidade(nome) {
    this.cardDoProduto(nome)
      .find(`[data-testid="${testIds.lista.aumentar}"]`)
      .click()
  }

  limpar() {
    this.getByTestId(testIds.lista.limpar).click()
  }

  mensagemVazia() {
    return this.getByTestId(testIds.lista.vazia)
  }
}

export default new ListaComprasPage()
