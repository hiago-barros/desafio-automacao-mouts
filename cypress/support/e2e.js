import './commands'
import 'cypress-plugin-api'
import 'cypress-mochawesome-reporter/register'

chai.Assertion.addMethod('normalizedText', function assertNormalizedText(expected) {
  const actual = this._obj.text().replace(/\s+/g, ' ').trim()

  this.assert(
    actual === expected,
    'expected #{this} to have normalized text #{exp}, but got #{act}',
    'expected #{this} not to have normalized text #{exp}',
    expected,
    actual,
  )
})
