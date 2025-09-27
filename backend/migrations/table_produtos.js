/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('produtos', function (table) {
    table.increments('id').primary();
    table.string('nome', 255).notNullable();
    table.decimal('preco', 10, 2).notNullable();
    table.integer('estoque').notNullable().defaultTo(0);
    table.integer('id_marca').unsigned().notNullable();
    table.timestamps(true, true);
    
    table.foreign('id_marca').references('id').inTable('marcas').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('produtos');
};