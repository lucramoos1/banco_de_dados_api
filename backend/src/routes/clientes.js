const db = require('../database');

async function clientesRoutes(fastify, options) {
  fastify.get('/clientes', async (request, reply) => {
    const clientes = await db('clientes').select('*');
    return { message: "Clientes listados", data: clientes, error: false };
  });

  fastify.get('/clientes/:id', async (request, reply) => {
    const { id } = request.params;
    const cliente = await db('clientes').where('id', id).first();
    
    if (!cliente) {
      return reply.code(404).send({ message: "Cliente não encontrado", data: null, error: true });
    }

    return { message: "Cliente encontrado", data: cliente, error: false };
  });

  fastify.post('/clientes', async (request, reply) => {
    const { nome, email, cidade } = request.body;

    if (!nome || !email || !cidade) {
      return reply.code(400).send({ message: "Campos obrigatórios", data: null, error: true });
    }

    const clienteExistente = await db('clientes').where('email', email).first();
    if (clienteExistente) {
      return reply.code(400).send({ message: "Email já cadastrado", data: null, error: true });
    }

    const [clienteId] = await db('clientes').insert({ nome, email, cidade });
    const novoCliente = await db('clientes').where('id', clienteId).first();

    return reply.code(201).send({ message: "Cliente cadastrado", data: novoCliente, error: false });
  });
}

module.exports = clientesRoutes;