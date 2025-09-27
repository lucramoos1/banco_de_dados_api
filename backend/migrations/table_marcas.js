/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('marcas', function (table) {
    table.increments('id').primary();
    table.string('nome', 100).notNullable();
    table.string('site', 255);
    table.string('telefone', 20);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('marcas');
};