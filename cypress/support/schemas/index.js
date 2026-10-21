export const recursoCriado = {
  type: 'object',
  additionalProperties: false,
  required: ['message', '_id'],
  properties: {
    message: { type: 'string' },
    _id: { type: 'string', minLength: 1 },
  },
}

export const usuario = {
  type: 'object',
  additionalProperties: false,
  required: ['nome', 'email', 'password', 'administrador', '_id'],
  properties: {
    nome: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 1 },
    administrador: { type: 'string', enum: ['true', 'false'] },
    _id: { type: 'string', minLength: 1 },
  },
}

export const login = {
  type: 'object',
  additionalProperties: false,
  required: ['message', 'authorization'],
  properties: {
    message: { type: 'string' },
    authorization: { type: 'string', pattern: '^Bearer .+' },
  },
}

export const produto = {
  type: 'object',
  additionalProperties: false,
  required: ['nome', 'preco', 'descricao', 'quantidade', '_id'],
  properties: {
    nome: { type: 'string' },
    preco: { type: 'number' },
    descricao: { type: 'string' },
    quantidade: { type: 'number' },
    _id: { type: 'string', minLength: 1 },
    imagem: { type: 'string' },
  },
}

export const carrinho = {
  type: 'object',
  additionalProperties: false,
  required: ['produtos', 'precoTotal', 'quantidadeTotal', 'idUsuario', '_id'],
  properties: {
    produtos: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['idProduto', 'quantidade', 'precoUnitario'],
        properties: {
          idProduto: { type: 'string' },
          quantidade: { type: 'number', minimum: 1 },
          precoUnitario: { type: 'number' },
        },
      },
    },
    precoTotal: { type: 'number' },
    quantidadeTotal: { type: 'number' },
    idUsuario: { type: 'string' },
    _id: { type: 'string' },
  },
}

export const mensagem = {
  type: 'object',
  additionalProperties: false,
  required: ['message'],
  properties: {
    message: { type: 'string', minLength: 1 },
  },
}
