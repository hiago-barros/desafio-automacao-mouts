import { fakerPT_BR as faker } from '@faker-js/faker'

export function criarProduto(overrides = {}) {
  return {
    nome: `Produto ${Date.now()} ${faker.string.alphanumeric(5)}`,
    preco: faker.number.int({ min: 10, max: 250 }),
    descricao: faker.commerce.productDescription().slice(0, 100),
    quantidade: faker.number.int({ min: 5, max: 30 }),
    ...overrides,
  }
}
