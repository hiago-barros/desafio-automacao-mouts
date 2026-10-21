export function apiRequest({ method = 'GET', path, body, token }) {
  const options = {
    method,
    url: `${Cypress.expose('apiUrl')}${path}`,
    failOnStatusCode: false,
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
  }

  if (body !== undefined) {
    options.body = body
  }

  return cy.api(options)
}
