# ServeRest - Cypress

Testes de frontend e API do ServeRest.

- Frontend: https://front.serverest.dev/
- API: https://serverest.dev/

## Como executar

```bash
npm install
npx cypress open
```

Para rodar tudo no terminal: `npm test`.

O relatório fica em `cypress/reports`.

## Cenários

### Frontend

- Cadastro de usuário: mensagem de sucesso, entrada na home e logout de volta ao login.
- Login: mensagem de e-mail ou senha inválidos, sem sair da tela de login.
- Lista de compras: nome, preço e quantidade do produto, total atualizado e carrinho vazio.

### API

- Usuários: cadastro, consulta, login, e-mail duplicado e exclusão.
- Produtos: cadastro por administrador, nome duplicado, usuário comum sem permissão e exclusão.
- Carrinhos: estoque reservado na criação e quantidade devolvida no cancelamento.

## Estrutura

```text
cypress/e2e/frontend
cypress/e2e/api
cypress/support/pages
cypress/support/services
cypress/support/factories
```
