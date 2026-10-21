import BasePage, { testIds } from './BasePage'

class LoginPage extends BasePage {
  constructor() {
    super('/login')
  }

  titulo() {
    return cy.contains('h1', 'Login')
  }

  campoEmail() {
    return this.getByTestId(testIds.login.email)
  }

  campoSenha() {
    return this.getByTestId(testIds.login.senha)
  }

  botaoEntrar() {
    return this.getByTestId(testIds.login.entrar)
  }

  linkCadastro() {
    return this.getByTestId(testIds.login.cadastrar)
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
    this.botaoEntrar().click()
    return this
  }
}

export default new LoginPage()
