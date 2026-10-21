import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true, strict: false })

Cypress.Commands.add('validateSchema', (schema, data, descricao = 'resposta') => {
  const validate = ajv.compile(schema)
  const valid = validate(data)
  const erros = valid ? '' : `\n${JSON.stringify(validate.errors, null, 2)}`

  expect(valid, `contrato da ${descricao}${erros}`).to.eq(true)
})
