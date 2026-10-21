import cadastroPage from '../../support/pages/CadastroPage'
import homePage from '../../support/pages/HomePage'
import loginPage from '../../support/pages/LoginPage'
import { criarUsuario } from '../../support/factories/usuarioFactory'
import { messages } from '../../support/constants/messages'

describe('Frontend - Cadastro de usuário', () => {
  it('valida a mensagem de cadastro realizado, o redirecionamento para a home e o retorno ao login no logout', () => {
    const usuario = criarUsuario()

    cy.intercept('POST', `${Cypress.expose('apiUrl')}/usuarios`).as('cadastro')

    cy.log('Abre a tela de cadastro')
    cadastroPage.visit()

    cy.log('Valida se o título Cadastro está visível')
    cadastroPage.titulo().should('be.visible')

    cy.log('Valida se o usuário não está marcado como administrador')
    cadastroPage.checkboxAdministrador().should('not.be.checked')

    cy.log(`Preenche o cadastro de ${usuario.nome} (${usuario.email})`)
    cadastroPage.preencherNome(usuario.nome)
    cadastroPage.preencherEmail(usuario.email)
    cadastroPage.preencherSenha(usuario.password)
    cadastroPage.submeter()

    cy.wait('@cadastro').its('response').then((response) => {
      cy.log(`Valida a resposta do cadastro: status ${response.statusCode} (esperado 201) e mensagem "${response.body.message}"`)
      expect(response.statusCode, 'status do cadastro').to.eq(201)
      expect(response.body.message, 'mensagem do cadastro').to.eq(messages.cadastroSucesso)
    })

    cy.log(`Valida se a tela exibe o alerta "${messages.cadastroSucesso}"`)
    cadastroPage.alerta()
      .should('be.visible')
      .and('contain', messages.cadastroSucesso)

    cy.log('Valida se o usuário entrou na home (/home)')
    cy.url({ timeout: 30000 }).should('include', '/home')

    cy.log('Valida se o botão de logout está disponível na home')
    homePage.botaoLogout().should('be.visible')

    cy.log('Faz logout')
    homePage.sair()

    cy.log('Valida se o logout voltou para a tela de login (/login)')
    cy.url().should('include', '/login')
    loginPage.titulo().should('be.visible')
  })
})
