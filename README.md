# Desafio de automação — ServeRest

Testes de frontend e de API do [ServeRest](https://serverest.dev/) com Cypress e Page Objects.

| Camada | Endereço |
| --- | --- |
| Frontend | https://front.serverest.dev/ |
| API | https://serverest.dev/ |

É preciso ter o Node.js 18 ou superior instalado.

## Como rodar

Na pasta do projeto:

```bash
npm install
```

Modo interativo, para escolher o teste e ver o passo a passo:

```bash
npx cypress open
```

No aplicativo, escolha **E2E Testing**, o navegador e o spec.

Pelo terminal:

```bash
npm test          # frontend e API
npm run test:ui   # só frontend
npm run test:api  # só API
```

O relatório HTML fica em `cypress/reports`.

## O que cada teste valida

### Frontend

| Spec | Validação |
| --- | --- |
| `cypress/e2e/frontend/cadastro-usuario.cy.js` | Cadastro de um usuário comum. Confere o alerta "Cadastro realizado com sucesso", a entrada em `/home` e o retorno a `/login` depois do logout. |
| `cypress/e2e/frontend/login.cy.js` | Login com e-mail inexistente. A API responde 401, a tela exibe "Email e/ou senha inválidos" e o usuário permanece em `/login`. |
| `cypress/e2e/frontend/lista-de-compras.cy.js` | Pesquisa de um produto, inclusão na lista e aumento da quantidade. Confere nome, preço e total (1 e depois 2) e a mensagem "Seu carrinho está vazio" ao limpar a lista. |

### API

| Spec | Validação |
| --- | --- |
| `cypress/e2e/api/carrinhos.cy.js` | Criação de um carrinho com 2 unidades. Confere preço total, quantidade, baixa do estoque e devolução dessa quantidade ao cancelar a compra. |
| `cypress/e2e/api/produtos.cy.js` | Administrador cadastra e consulta o produto. Nome repetido retorna 400, usuário comum recebe 403 e, depois da exclusão, a consulta retorna "Produto não encontrado". |
| `cypress/e2e/api/usuarios.cy.js` | Cadastro, consulta dos dados e login com token Bearer. E-mail repetido retorna 400 e, depois da exclusão, a consulta retorna "Usuário não encontrado". |

## Organização

```text
cypress/e2e/frontend     cenários da interface
cypress/e2e/api          cenários da API
cypress/support/pages    Page Objects
cypress/support/services chamadas de API
cypress/support/factories dados gerados a cada execução
```

Os seletores ficam nos Page Objects. Cada execução cria e-mail e produto novos e apaga o que cadastrou ao final.
