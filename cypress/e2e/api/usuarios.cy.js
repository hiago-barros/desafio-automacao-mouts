import { criarUsuario } from '../../support/factories/usuarioFactory'
import usuarioService from '../../support/services/UsuarioService'
import authService from '../../support/services/AuthService'
import { messages } from '../../support/constants/messages'
import { login, mensagem, recursoCriado, usuario } from '../../support/schemas'

describe('API - Usuários', () => {
  const estado = {}

  afterEach(() => {
    if (estado.id) {
      cy.log(`Remove o usuário ${estado.id} criado no cenário`)
      usuarioService.excluir(estado.id)
    }
  })

  it('valida o cadastro, a consulta dos dados, o token de login, a recusa de e-mail duplicado e a exclusão do usuário', () => {
    const novoUsuario = criarUsuario()

    cy.log(`Cadastra o usuário ${novoUsuario.email}`)
    usuarioService.criar(novoUsuario).then((response) => {
      cy.log(`Valida o cadastro: status ${response.status} (esperado 201) e mensagem "${response.body.message}"`)
      expect(response.status, 'status do cadastro do usuário').to.eq(201)
      expect(response.body.message, 'mensagem do cadastro do usuário').to.eq(messages.cadastroSucesso)
      cy.log('Valida o contrato do cadastro: message e _id')
      cy.validateSchema(recursoCriado, response.body, 'cadastro do usuário')

      estado.id = response.body._id
      cy.log(`Consulta o usuário pelo id ${estado.id}`)
      return usuarioService.buscarPorId(estado.id)
    }).then((response) => {
      cy.log('Valida se a consulta retornou nome, e-mail, senha, administrador false e o mesmo id')
      expect(response.status, 'status da consulta do usuário').to.eq(200)
      expect(response.body, 'dados do usuário consultado').to.deep.equal({
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        password: novoUsuario.password,
        administrador: 'false',
        _id: estado.id,
      })
      cy.log('Valida o contrato da consulta do usuário')
      cy.validateSchema(usuario, response.body, 'consulta do usuário')

      cy.log(`Autentica o usuário ${novoUsuario.email}`)
      return authService.login(novoUsuario)
    }).then((response) => {
      cy.log(`Valida o login: status ${response.status} (esperado 200), mensagem "${response.body.message}" e token Bearer`)
      expect(response.status, 'status do login').to.eq(200)
      expect(response.body.message, 'mensagem do login').to.eq(messages.loginSucesso)
      expect(response.body.authorization, 'token Bearer do login').to.match(/^Bearer .+/)
      cy.log('Valida o contrato do login: message e authorization')
      cy.validateSchema(login, response.body, 'login')

      cy.log(`Tenta cadastrar de novo o e-mail ${novoUsuario.email}`)
      return usuarioService.criar(novoUsuario)
    }).then((response) => {
      cy.log(`Valida a recusa do e-mail duplicado: status ${response.status} (esperado 400) e mensagem "${response.body.message}"`)
      expect(response.status, 'status do e-mail duplicado').to.eq(400)
      expect(response.body.message, 'mensagem de e-mail duplicado').to.eq(messages.emailEmUso)
      cy.log('Valida o contrato do erro de e-mail duplicado')
      cy.validateSchema(mensagem, response.body, 'e-mail duplicado')

      const idCriado = estado.id
      cy.log(`Exclui o usuário ${idCriado}`)
      return usuarioService.excluir(idCriado).then((exclusao) => {
        cy.log(`Valida a exclusão: status ${exclusao.status} (esperado 200) e mensagem "${exclusao.body.message}"`)
        expect(exclusao.status, 'status da exclusão do usuário').to.eq(200)
        expect(exclusao.body.message, 'mensagem da exclusão do usuário').to.eq(messages.registroExcluido)
        estado.id = null

        cy.log(`Consulta o usuário ${idCriado} depois da exclusão`)
        return usuarioService.buscarPorId(idCriado)
      })
    }).then((response) => {
      cy.log(`Valida se o usuário excluído não é encontrado: status ${response.status} (esperado 400) e mensagem "${response.body.message}"`)
      expect(response.status, 'status da consulta após exclusão').to.eq(400)
      expect(response.body.message, 'mensagem de usuário não encontrado').to.eq(messages.usuarioNaoEncontrado)
    })
  })
})
