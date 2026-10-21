import { fakerPT_BR as faker } from '@faker-js/faker'

const SENHA_PADRAO = 'Teste@123'

function sufixoUnico() {
  return `${Date.now()}${faker.string.alphanumeric(6)}`.toLowerCase()
}

export function criarUsuario(overrides = {}) {
  return {
    nome: faker.person.fullName(),
    email: `qa.${sufixoUnico()}@mouts.dev`,
    password: SENHA_PADRAO,
    administrador: 'false',
    ...overrides,
  }
}
