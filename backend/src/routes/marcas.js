const db = require('../database');

async function marcasRoutes(fastify, options) {
  fastify.get('/marcas', async (request, reply) => {
    const marcas = await db('marcas').select('*');
    return { message: "Marcas listadas", data: marcas, error: false };
  });

  fastify.get('/marcas/:id', async (request, reply) => {
    const { id } = request.params;
    const marca = await db('marcas').where('id', id).first();
    
    if (!marca) {
      return reply.code(404).send({ message: "Marca não encontrada", data: null, error: true });
    }

    return { message: "Marca encontrada", data: marca, error: false };
  });

  fastify.delete('/marcas/:id', async (request, reply) => {
    const { id } = request.params;
    
    const marca = await db('marcas').where('id', id).first();
    if (!marca) {
      return reply.code(404).send({ message: "Marca não encontrada", data: null, error: true });
    }

    const produtos = await db('produtos').where('id_marca', id);
    if (produtos.length > 0) {
      return reply.code(412).send({ message: "Marca possui produtos vinculados", data: null, error: true });
    }

    await db('marcas').where('id', id).del();
    return reply.code(204).send();
  });
}

module.exports = marcasRoutes;