const API_BASE_URL = 'http://localhost:3000';

class API {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: { 'Content-Type': 'application/json' },
            ...options
        };

        showLoading(true);
        const response = await fetch(url, config);
        showLoading(false);
        
        const data = await response.json();
        return data;
    }

    static async getMarcas() {
        return this.request('/marcas');
    }

    static async getMarca(id) {
        return this.request(`/marcas/${id}`);
    }

    static async deleteMarca(id) {
        return this.request(`/marcas/${id}`, { method: 'DELETE' });
    }

    static async getProdutos() {
        return this.request('/produtos');
    }

    static async getProduto(id) {
        return this.request(`/produtos/${id}`);
    }

    static async createProduto(produto) {
        return this.request('/produtos', { method: 'POST', body: JSON.stringify(produto) });
    }

    static async getClientes() {
        return this.request('/clientes');
    }

    static async getCliente(id) {
        return this.request(`/clientes/${id}`);
    }

    static async createCliente(cliente) {
        return this.request('/clientes', { method: 'POST', body: JSON.stringify(cliente) });
    }

    static async getPedidos() {
        return this.request('/pedidos');
    }

    static async getPedido(id) {
        return this.request(`/pedidos/${id}`);
    }

    static async getPedidosPorCidade(cidade) {
        return this.request(`/pedidos/cidade/${cidade}`);
    }

    static async createPedido(pedido) {
        return this.request('/pedidos', { method: 'POST', body: JSON.stringify(pedido) });
    }
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.remove('d-none');
    } else {
        overlay.classList.add('d-none');
    }
}

function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRequired(value) {
    return value && value.toString().trim().length > 0;
}

function validateNumber(value, min = 0) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min;
}