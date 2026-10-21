# Desafio de automação — ServeRest

Testes de frontend e de API do [ServeRest](https://serverest.dev/) com Cypress e Page Objects.

| Camada | Endereço |
| --- | --- |
| Frontend | https://front.serverest.dev/ |
| API | https://serverest.dev/ |

## Pré-requisito

Node.js 18 ou superior.

## Como rodar

**1. Instalar**

```bash
npm install
```

**2. Abrir o Cypress e escolher o teste**

```bash
npx cypress open
```

No aplicativo: **E2E Testing**, depois o navegador e o spec.

**3. Ou rodar pelo terminal**

| Comando | O que executa |
| --- | --- |
| `npm test` | Frontend e API |
| `npm run test:ui` | Só frontend |
| `npm run test:api` | Só API |

O relatório HTML fica em `cypress/reports`.

## O que cada teste valida

### Frontend

**Cadastro de usuário**  
`cypress/e2e/frontend/cadastro-usuario.cy.js`

- Exibe o alerta "Cadastro realizado com sucesso"
- Entra em `/home`
- No logout, volta para `/login`

**Login inválido**  
`cypress/e2e/frontend/login.cy.js`

- A API responde 401
- A tela exibe "Email e/ou senha inválidos"
- O usuário permanece em `/login`

**Lista de compras**  
`cypress/e2e/frontend/lista-de-compras.cy.js`

- Pesquisa o produto e adiciona à lista
- Confere nome, preço e quantidade 1
- Ao aumentar a quantidade, confere o total 2
- Ao limpar a lista, exibe "Seu carrinho está vazio"

### API

**Carrinhos**  
`cypress/e2e/api/carrinhos.cy.js`

- Cria um carrinho com 2 unidades
- Confere preço total e quantidade
- Confere a baixa do estoque
- Ao cancelar a compra, devolve a quantidade ao estoque

**Produtos**  
`cypress/e2e/api/produtos.cy.js`

- Administrador cadastra e consulta o produto
- Nome repetido retorna 400
- Usuário comum recebe 403
- Depois da exclusão, a consulta retorna "Produto não encontrado"

**Usuários**  
`cypress/e2e/api/usuarios.cy.js`

- Cadastra o usuário e consulta os dados
- Login devolve token Bearer
- E-mail repetido retorna 400
- Depois da exclusão, a consulta retorna "Usuário não encontrado"

## Organização

| Pasta | Conteúdo |
| --- | --- |
| `cypress/e2e/frontend` | Cenários da interface |
| `cypress/e2e/api` | Cenários da API |
| `cypress/support/pages` | Page Objects |
| `cypress/support/services` | Chamadas de API |
| `cypress/support/factories` | Dados gerados a cada execução |

Os seletores ficam nos Page Objects. Cada execução cria e-mail e produto novos e apaga o que cadastrou ao final.
