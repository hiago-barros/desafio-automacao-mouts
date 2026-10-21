import { apiRequest } from './apiClient'

class CarrinhoService {
  criar(carrinho, token) {
    return apiRequest({
      method: 'POST',
      path: '/carrinhos',
      body: carrinho,
      token,
    })
  }

  buscarPorId(id) {
    return apiRequest({
      method: 'GET',
      path: `/carrinhos/${id}`,
    })
  }

  cancelarCompra(token) {
    return apiRequest({
      method: 'DELETE',
      path: '/carrinhos/cancelar-compra',
      token,
    })
  }
}

export default new CarrinhoService()
