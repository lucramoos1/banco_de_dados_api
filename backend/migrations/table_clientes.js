/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('clientes', function (table) {
    table.increments('id').primary();
    table.string('nome', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('cidade', 100).notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('clientes');
};