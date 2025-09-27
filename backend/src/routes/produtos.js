const db = require('../database');

async function produtosRoutes(fastify, options) {
  fastify.get('/produtos', async (request, reply) => {
    const produtos = await db('produtos')
      .join('marcas', 'produtos.id_marca', 'marcas.id')
      .select('produtos.*', 'marcas.nome as marca_nome');
    
    return { message: "Produtos listados", data: produtos, error: false };
  });

  fastify.get('/produtos/:id', async (request, reply) => {
    const { id } = request.params;
    const produto = await db('produtos')
      .join('marcas', 'produtos.id_marca', 'marcas.id')
      .select('produtos.*', 'marcas.nome as marca_nome')
      .where('produtos.id', id)
      .first();
    
    if (!produto) {
      return reply.code(404).send({ message: "Produto não encontrado", data: null, error: true });
    }

    return { message: "Produto encontrado", data: produto, error: false };
  });

  fastify.post('/produtos', async (request, reply) => {
    const { nome, preco, estoque, id_marca } = request.body;

    if (!nome || !preco || estoque === undefined || !id_marca) {
      return reply.code(400).send({ message: "Campos obrigatórios", data: null, error: true });
    }

    const marca = await db('marcas').where('id', id_marca).first();
    if (!marca) {
      return reply.code(400).send({ message: "Marca não encontrada", data: null, error: true });
    }

    const [produtoId] = await db('produtos').insert({ nome, preco, estoque, id_marca });
    const novoProduto = await db('produtos')
      .join('marcas', 'produtos.id_marca', 'marcas.id')
      .select('produtos.*', 'marcas.nome as marca_nome')
      .where('produtos.id', produtoId)
      .first();

    return reply.code(201).send({ message: "Produto cadastrado", data: novoProduto, error: false });
  });
}

module.exports = produtosRoutes;