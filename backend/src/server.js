const fastify = require('fastify')({ logger: false });
const path = require('path');

fastify.register(require('@fastify/cors'), {
  origin: true
});

// Registrar arquivos estáticos (frontend)
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '../../frontend'),
  prefix: '/'
});

// Rotas da API
fastify.register(require('./routes/marcas'));
fastify.register(require('./routes/produtos'));
fastify.register(require('./routes/clientes'));
fastify.register(require('./routes/pedidos'));

// Rota para servir o index.html na raiz
fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html');
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Servidor rodando na porta 3000');
    console.log('Acesse http://localhost:3000 para ver o frontend');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();