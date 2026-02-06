const API_BASE_URL = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const detail = payload?.detail ?? payload ?? 'Error inesperado';
      throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }

    return payload;
  }

  getCatalog() {
    return this.request('/catalogo');
  }

  createProduct(product) {
    return this.request('/catalogo/crear', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  deleteProduct(productId) {
    return this.request(`/catalogo/eliminar/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    });
  }

  receiveStock(productId, quantity) {
    return this.request(
      `/inventario/recepcion/${encodeURIComponent(productId)}?cantidad=${encodeURIComponent(quantity)}`,
      { method: 'POST' }
    );
  }

  getInventoryValue() {
    return this.request('/inventario/reporte-valor');
  }

  getStockAlerts(limit = 5) {
    return this.request(`/inventario/alertas?limite=${encodeURIComponent(limit)}`);
  }

  getClients() {
    return this.request('/clientes/lista');
  }

  createClient(client) {
    return this.request('/clientes/registrar', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  createSale(clienteId, items) {
    return this.request(`/ventas/facturar?cliente_id=${encodeURIComponent(clienteId)}`, {
      method: 'POST',
      body: JSON.stringify(items),
    });
  }

  getSalesHistory() {
    return this.request('/ventas/historial');
  }
}

export default new ApiService();
