import { apiRequest } from './apiClient'

class AuthService {
  login({ email, password }) {
    return apiRequest({
      method: 'POST',
      path: '/login',
      body: { email, password },
    })
  }
}

export default new AuthService()
