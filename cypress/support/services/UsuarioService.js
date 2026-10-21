import { apiRequest } from './apiClient'

class UsuarioService {
  criar(usuario) {
    return apiRequest({
      method: 'POST',
      path: '/usuarios',
      body: usuario,
    })
  }

  buscarPorId(id) {
    return apiRequest({
      method: 'GET',
      path: `/usuarios/${id}`,
    })
  }

  excluir(id) {
    return apiRequest({
      method: 'DELETE',
      path: `/usuarios/${id}`,
    })
  }
}

export default new UsuarioService()
