import BasePage, { testIds } from './BasePage'

class CadastroPage extends BasePage {
  constructor() {
    super('/cadastrarusuarios')
  }

  titulo() {
    return cy.contains('h2', 'Cadastro')
  }

  campoNome() {
    return this.getByTestId(testIds.cadastro.nome)
  }

  campoEmail() {
    return this.getByTestId(testIds.cadastro.email)
  }

  campoSenha() {
    return this.getByTestId(testIds.cadastro.senha)
  }

  checkboxAdministrador() {
    return this.getByTestId(testIds.cadastro.administrador)
  }

  botaoCadastrar() {
    return this.getByTestId(testIds.cadastro.cadastrar)
  }

  preencherNome(nome) {
    this.campoNome().clear().type(nome)
    return this
  }

  preencherEmail(email) {
    this.campoEmail().clear().type(email)
    return this
  }

  preencherSenha(senha) {
    this.campoSenha().clear().type(senha, { log: false })
    return this
  }

  submeter() {
    this.botaoCadastrar().click()
    return this
  }
}

export default new CadastroPage()
