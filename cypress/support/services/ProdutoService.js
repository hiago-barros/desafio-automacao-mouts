import { apiRequest } from './apiClient'

class ProdutoService {
  criar(produto, token) {
    return apiRequest({
      method: 'POST',
      path: '/produtos',
      body: produto,
      token,
    })
  }

  buscarPorId(id) {
    return apiRequest({
      method: 'GET',
      path: `/produtos/${id}`,
    })
  }

  excluir(id, token) {
    return apiRequest({
      method: 'DELETE',
      path: `/produtos/${id}`,
      token,
    })
  }
}

export default new ProdutoService()
