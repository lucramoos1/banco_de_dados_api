const db = require('../database');

async function pedidosRoutes(fastify, options) {
  fastify.get('/pedidos', async (request, reply) => {
    const pedidos = await db('pedidos')
      .join('clientes', 'pedidos.id_cliente', 'clientes.id')
      .select('pedidos.*', 'clientes.nome as cliente_nome', 'clientes.cidade as cliente_cidade');

    for (let pedido of pedidos) {
      const itens = await db('itens_pedido')
        .join('produtos', 'itens_pedido.id_produto', 'produtos.id')
        .select('itens_pedido.*', 'produtos.nome as produto_nome')
        .where('itens_pedido.id_pedido', pedido.id);
      
      pedido.itens = itens;
    }

    return { message: "Pedidos listados", data: pedidos, error: false };
  });

  fastify.get('/pedidos/:id', async (request, reply) => {
    const { id } = request.params;
    
    const pedido = await db('pedidos')
      .join('clientes', 'pedidos.id_cliente', 'clientes.id')
      .select('pedidos.*', 'clientes.nome as cliente_nome', 'clientes.cidade as cliente_cidade')
      .where('pedidos.id', id)
      .first();
    
    if (!pedido) {
      return reply.code(404).send({ message: "Pedido não encontrado", data: null, error: true });
    }

    const itens = await db('itens_pedido')
      .join('produtos', 'itens_pedido.id_produto', 'produtos.id')
      .select('itens_pedido.*', 'produtos.nome as produto_nome')
      .where('itens_pedido.id_pedido', id);
    
    pedido.itens = itens;

    return { message: "Pedido encontrado", data: pedido, error: false };
  });

  fastify.get('/pedidos/cidade/:cidade', async (request, reply) => {
    const { cidade } = request.params;
    
    const pedidos = await db('pedidos')
      .join('clientes', 'pedidos.id_cliente', 'clientes.id')
      .select('pedidos.*', 'clientes.nome as cliente_nome', 'clientes.cidade as cliente_cidade')
      .where('clientes.cidade', cidade);

    for (let pedido of pedidos) {
      const itens = await db('itens_pedido')
        .join('produtos', 'itens_pedido.id_produto', 'produtos.id')
        .select('itens_pedido.*', 'produtos.nome as produto_nome')
        .where('itens_pedido.id_pedido', pedido.id);
      
      pedido.itens = itens;
    }

    return { message: "Pedidos da cidade", data: pedidos, error: false };
  });

  fastify.post('/pedidos', async (request, reply) => {
    const { data_pedido, id_cliente, itens } = request.body;

    if (!data_pedido || !id_cliente || !itens) {
      return reply.code(400).send({ message: "Campos obrigatórios", data: null, error: true });
    }

    const cliente = await db('clientes').where('id', id_cliente).first();
    if (!cliente) {
      return reply.code(400).send({ message: "Cliente não encontrado", data: null, error: true });
    }

    let valorTotal = 0;
    for (let item of itens) {
      valorTotal += parseFloat(item.preco_unitario) * parseInt(item.quantidade);
    }

    const [pedidoId] = await db('pedidos').insert({
      data_pedido,
      id_cliente,
      valor_total: valorTotal
    });

    for (let item of itens) {
      await db('itens_pedido').insert({
        id_pedido: pedidoId,
        id_produto: item.id_produto,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario
      });
    }

    const novoPedido = await db('pedidos')
      .join('clientes', 'pedidos.id_cliente', 'clientes.id')
      .select('pedidos.*', 'clientes.nome as cliente_nome')
      .where('pedidos.id', pedidoId)
      .first();

    return reply.code(201).send({ message: "Pedido criado", data: novoPedido, error: false });
  });
}

module.exports = pedidosRoutes;