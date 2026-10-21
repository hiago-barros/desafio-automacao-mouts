import { testIds } from '../constants/testIds'

export default class BasePage {
  constructor(path) {
    this.path = path
  }

  visit() {
    cy.visit(this.path, {
      onBeforeLoad(win) {
        win.localStorage.clear()
      },
    })
    return this
  }

  getByTestId(testId) {
    return cy.get(`[data-testid="${testId}"]`)
  }

  alerta() {
    return cy.get('.alert')
  }
}

export { testIds }
