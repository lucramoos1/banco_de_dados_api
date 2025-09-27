/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('pedidos').del();
  
  // Inserts seed entries
  await knex('pedidos').insert([
    {id: 1, data_pedido: '2025-09-17', id_cliente: 1, valor_total: 11898.00},
    {id: 2, data_pedido: '2025-09-17', id_cliente: 2, valor_total: 13598.00},
    {id: 3, data_pedido: '2025-09-17', id_cliente: 3, valor_total: 12498.00},
    {id: 4, data_pedido: '2025-09-17', id_cliente: 4, valor_total: 5298.00}
  ]);
};