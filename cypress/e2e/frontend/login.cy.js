import loginPage from '../../support/pages/LoginPage'
import { messages } from '../../support/constants/messages'

describe('Frontend - Login', () => {
  it('valida a mensagem de e-mail ou senha inválidos e a permanência na tela de login', () => {
    const email = `inexistente.${Date.now()}@mouts.dev`

    cy.intercept('POST', `${Cypress.expose('apiUrl')}/login`).as('login')

    cy.log('Abre a tela de login')
    loginPage.visit()

    cy.log('Valida se o título Login está visível')
    loginPage.titulo().should('be.visible')

    cy.log(`Informa o e-mail ${email} com uma senha que não existe`)
    loginPage.preencherEmail(email)
    loginPage.preencherSenha('senha-incorreta')
    loginPage.submeter()

    cy.wait('@login').its('response').then((response) => {
      cy.log(`Valida se a API recusou o login: status ${response.statusCode} (esperado 401)`)
      expect(response.statusCode, 'status do login inválido').to.eq(401)
      expect(response.body.message, 'mensagem do login inválido').to.eq(messages.loginInvalido)
    })

    cy.log(`Valida se a tela exibe o alerta "${messages.loginInvalido}"`)
    loginPage.alerta()
      .should('be.visible')
      .and('contain', messages.loginInvalido)

    cy.log('Valida se o usuário permaneceu na tela de login (/login)')
    cy.url().should('include', '/login')

    cy.log('Valida se o botão Entrar continua disponível')
    loginPage.botaoEntrar().should('be.enabled')
  })
})
