/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pedidos', function (table) {
    table.increments('id').primary();
    table.date('data_pedido').notNullable();
    table.integer('id_cliente').unsigned().notNullable();
    table.decimal('valor_total', 10, 2).notNullable();
    table.timestamps(true, true);
    
    table.foreign('id_cliente').references('id').inTable('clientes').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('pedidos');
};