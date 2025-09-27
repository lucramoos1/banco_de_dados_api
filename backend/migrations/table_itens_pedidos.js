/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('itens_pedido', function (table) {
    table.increments('id').primary();
    table.integer('id_pedido').unsigned().notNullable();
    table.integer('id_produto').unsigned().notNullable();
    table.integer('quantidade').notNullable();
    table.decimal('preco_unitario', 10, 2).notNullable();
    table.timestamps(true, true);
    
    table.foreign('id_pedido').references('id').inTable('pedidos').onDelete('CASCADE');
    table.foreign('id_produto').references('id').inTable('produtos').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('itens_pedido');
};