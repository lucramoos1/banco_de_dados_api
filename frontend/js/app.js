let currentSection = 'dashboard';
let marcas = [];
let produtos = [];
let clientes = [];
let pedidos = [];
let cidades = [];

document.addEventListener('DOMContentLoaded', async function() {
    const today = new Date().toISOString().split('T')[0];
    const pedidoDataInput = document.getElementById('pedido-data');
    if (pedidoDataInput) {
        pedidoDataInput.value = today;
    }

    await loadInitialData();
    showSection('dashboard');
});

async function loadInitialData() {
    await loadMarcas();
    await loadProdutos();
    await loadClientes();
    await loadPedidos();
    updateDashboard();
    populateCidadeFilter();
}

function showSection(section) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    event?.target?.classList.add('active');
    
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.add('d-none');
    });
    
    const sectionElement = document.getElementById(`${section}-section`);
    if (sectionElement) {
        sectionElement.classList.remove('d-none');
        currentSection = section;
        
        switch(section) {
            case 'marcas': loadMarcas(); break;
            case 'produtos': loadProdutos(); break;
            case 'clientes': loadClientes(); break;
            case 'pedidos': loadPedidos(); break;
        }
    }
}

function updateDashboard() {
    document.getElementById('total-marcas').textContent = marcas.length;
    document.getElementById('total-produtos').textContent = produtos.length;
    document.getElementById('total-clientes').textContent = clientes.length;
    document.getElementById('total-pedidos').textContent = pedidos.length;
}

async function loadMarcas() {
    const response = await API.getMarcas();
    marcas = response.data;
    renderMarcas();
    populateMarcasSelect();
}

function renderMarcas() {
    const tbody = document.getElementById('marcas-tbody');
    tbody.innerHTML = '';
    
    marcas.forEach(marca => {
        const row = `
            <tr>
                <td>${marca.id}</td>
                <td>${marca.nome}</td>
                <td>${marca.site || '-'}</td>
                <td>${marca.telefone || '-'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteMarca(${marca.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function populateMarcasSelect() {
    const select = document.getElementById('produto-marca');
    select.innerHTML = '<option value="">Selecione uma marca</option>';
    marcas.forEach(marca => {
        select.insertAdjacentHTML('beforeend', `<option value="${marca.id}">${marca.nome}</option>`);
    });
}

async function deleteMarca(id) {
    if (!confirm('Tem certeza que deseja excluir esta marca?')) return;
    
    await API.deleteMarca(id);
    showToast('Sucesso', 'Marca excluída com sucesso!', 'success');
    await loadMarcas();
}

async function loadProdutos() {
    const response = await API.getProdutos();
    produtos = response.data;
    renderProdutos();
    populateProdutosSelect();
}

function renderProdutos() {
    const tbody = document.getElementById('produtos-tbody');
    tbody.innerHTML = '';
    
    produtos.forEach(produto => {
        const row = `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${formatCurrency(produto.preco)}</td>
                <td>${produto.estoque}</td>
                <td>${produto.marca_nome}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewProduto(${produto.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function populateProdutosSelect() {
    const selects = document.querySelectorAll('.produto-select');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Selecione um produto</option>';
        produtos.forEach(produto => {
            select.insertAdjacentHTML('beforeend', 
                `<option value="${produto.id}" data-preco="${produto.preco}">
                    ${produto.nome} - ${formatCurrency(produto.preco)}
                </option>`
            );
        });
    });
}

function showAddProductModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

async function addProduct() {
    const nome = document.getElementById('produto-nome').value;
    const preco = document.getElementById('produto-preco').value;
    const estoque = document.getElementById('produto-estoque').value;
    const id_marca = document.getElementById('produto-marca').value;
    
    await API.createProduto({
        nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        id_marca: parseInt(id_marca)
    });
    
    showToast('Sucesso', 'Produto cadastrado com sucesso!', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
    document.getElementById('addProductForm').reset();
    
    await loadProdutos();
}

async function viewProduto(id) {
    const response = await API.getProduto(id);
    const produto = response.data;
    
    showToast('Produto', `
        <strong>${produto.nome}</strong><br>
        Preço: ${formatCurrency(produto.preco)}<br>
        Estoque: ${produto.estoque}<br>
        Marca: ${produto.marca_nome}
    `, 'info');
}

async function loadClientes() {
    const response = await API.getClientes();
    clientes = response.data;
    renderClientes();
    populateClientesSelect();
    extractCidades();
}

function renderClientes() {
    const tbody = document.getElementById('clientes-tbody');
    tbody.innerHTML = '';
    
    clientes.forEach(cliente => {
        const row = `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.cidade}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewCliente(${cliente.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function populateClientesSelect() {
    const select = document.getElementById('pedido-cliente');
    select.innerHTML = '<option value="">Selecione um cliente</option>';
    clientes.forEach(cliente => {
        select.insertAdjacentHTML('beforeend', 
            `<option value="${cliente.id}">${cliente.nome} - ${cliente.cidade}</option>`
        );
    });
}

function extractCidades() {
    cidades = [...new Set(clientes.map(cliente => cliente.cidade))].sort();
}

function populateCidadeFilter() {
    const select = document.getElementById('cidade-filter');
    select.innerHTML = '<option value="">Todas as cidades</option>';
    cidades.forEach(cidade => {
        select.insertAdjacentHTML('beforeend', `<option value="${cidade}">${cidade}</option>`);
    });
}

function showAddClientModal() {
    const modal = new bootstrap.Modal(document.getElementById('addClientModal'));
    modal.show();
}

async function addClient() {
    const nome = document.getElementById('cliente-nome').value;
    const email = document.getElementById('cliente-email').value;
    const cidade = document.getElementById('cliente-cidade').value;
    
    await API.createCliente({
        nome,
        email,
        cidade
    });
    
    showToast('Sucesso', 'Cliente cadastrado com sucesso!', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addClientModal'));
    modal.hide();
    document.getElementById('addClientForm').reset();
    
    await loadClientes();
}

async function viewCliente(id) {
    const response = await API.getCliente(id);
    const cliente = response.data;
    
    showToast('Cliente', `
        <strong>${cliente.nome}</strong><br>
        Email: ${cliente.email}<br>
        Cidade: ${cliente.cidade}
    `, 'info');
}

async function loadPedidos() {
    const response = await API.getPedidos();
    pedidos = response.data;
    renderPedidos();
}

function renderPedidos(pedidosToRender = pedidos) {
    const accordion = document.getElementById('pedidos-accordion');
    accordion.innerHTML = '';
    
    pedidosToRender.forEach((pedido, index) => {
        const valorTotal = pedido.valor_total || pedido.itens.reduce((total, item) => total + (item.quantidade * item.preco_unitario), 0);
        
        const itensHtml = pedido.itens.map(item => `
            <tr>
                <td>${item.produto_nome}</td>
                <td>${item.quantidade}</td>
                <td>${formatCurrency(item.preco_unitario)}</td>
                <td>${formatCurrency(item.quantidade * item.preco_unitario)}</td>
            </tr>
        `).join('');
        
        const accordionItem = `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#collapse${index}">
                        <div class="d-flex w-100 justify-content-between align-items-center me-3">
                            <div>
                                <strong>Pedido #${pedido.id}</strong> - ${pedido.cliente_nome}
                            </div>
                            <div class="text-end">
                                <small class="text-muted">${formatDate(pedido.data_pedido)}</small><br>
                                <strong>${formatCurrency(valorTotal)}</strong>
                            </div>
                        </div>
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#pedidos-accordion">
                    <div class="accordion-body">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Cliente:</strong> ${pedido.cliente_nome}<br>
                                <strong>Email:</strong> ${pedido.cliente_email}<br>
                                <strong>Cidade:</strong> ${pedido.cliente_cidade}
                            </div>
                            <div class="col-md-6 text-md-end">
                                <strong>Data:</strong> ${formatDate(pedido.data_pedido)}<br>
                                <strong>Total:</strong> ${formatCurrency(valorTotal)}
                            </div>
                        </div>
                        <h6>Itens do Pedido:</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Quantidade</th>
                                        <th>Preço Unit.</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itensHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        accordion.insertAdjacentHTML('beforeend', accordionItem);
    });
}

async function filterByCity() {
    const cidade = document.getElementById('cidade-filter').value;
    
    if (!cidade) {
        renderPedidos(pedidos);
        return;
    }
    
    const response = await API.getPedidosPorCidade(cidade);
    renderPedidos(response.data);
}

function showAddOrderModal() {
    const modal = new bootstrap.Modal(document.getElementById('addOrderModal'));
    modal.show();
}

function addItemPedido() {
    const container = document.getElementById('pedido-itens');
    const newItem = `
        <div class="row mb-2 item-pedido">
            <div class="col-md-5">
                <select class="form-select produto-select" required onchange="updatePrecoItem(this)">
                    <option value="">Selecione um produto</option>
                </select>
            </div>
            <div class="col-md-2">
                <input type="number" class="form-control quantidade-input" placeholder="Qtd" min="1" required>
            </div>
            <div class="col-md-3">
                <input type="number" step="0.01" class="form-control preco-input" placeholder="Preço" required>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger" onclick="removeItemPedido(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', newItem);
    
    const newSelect = container.lastElementChild.querySelector('.produto-select');
    produtos.forEach(produto => {
        newSelect.insertAdjacentHTML('beforeend', 
            `<option value="${produto.id}" data-preco="${produto.preco}">
                ${produto.nome} - ${formatCurrency(produto.preco)}
            </option>`
        );
    });
}

function removeItemPedido(button) {
    const items = document.querySelectorAll('.item-pedido');
    if (items.length > 1) {
        button.closest('.item-pedido').remove();
    }
}

function updatePrecoItem(select) {
    const selectedOption = select.selectedOptions[0];
    if (selectedOption && selectedOption.dataset.preco) {
        const precoInput = select.closest('.item-pedido').querySelector('.preco-input');
        precoInput.value = selectedOption.dataset.preco;
    }
}

async function addOrder() {
    const data_pedido = document.getElementById('pedido-data').value;
    const id_cliente = document.getElementById('pedido-cliente').value;
    const itemElements = document.querySelectorAll('.item-pedido');
    
    const itens = [];
    
    itemElements.forEach(itemElement => {
        const produtoSelect = itemElement.querySelector('.produto-select');
        const quantidadeInput = itemElement.querySelector('.quantidade-input');
        const precoInput = itemElement.querySelector('.preco-input');
        
        const id_produto = produtoSelect.value;
        const quantidade = quantidadeInput.value;
        const preco_unitario = precoInput.value;
        
        itens.push({
            id_produto: parseInt(id_produto),
            quantidade: parseInt(quantidade),
            preco_unitario: parseFloat(preco_unitario)
        });
    });
    
    await API.createPedido({
        data_pedido,
        id_cliente: parseInt(id_cliente),
        itens
    });
    
    showToast('Sucesso', 'Pedido criado com sucesso!', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addOrderModal'));
    modal.hide();
    document.getElementById('addOrderForm').reset();
    
    const pedidoItens = document.getElementById('pedido-itens');
    const items = pedidoItens.querySelectorAll('.item-pedido');
    for (let i = 1; i < items.length; i++) {
        items[i].remove();
    }
    
    await loadPedidos();
    await loadProdutos();
}

// Event listeners
document.addEventListener('change', function(event) {
    if (event.target.classList.contains('produto-select')) {
        updatePrecoItem(event.target);
    }
});