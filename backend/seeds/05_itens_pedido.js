/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('itens_pedido').del();
  
  // Inserts seed entries
  await knex('itens_pedido').insert([
    {id_pedido: 1, id_produto: 3, quantidade: 1, preco_unitario: 7299.00},
    {id_pedido: 1, id_produto: 4, quantidade: 1, preco_unitario: 4599.00},
    {id_pedido: 2, id_produto: 5, quantidade: 1, preco_unitario: 7599.00},
    {id_pedido: 2, id_produto: 6, quantidade: 1, preco_unitario: 5999.00},
    {id_pedido: 3, id_produto: 10, quantidade: 1, preco_unitario: 6599.00},
    {id_pedido: 3, id_produto: 11, quantidade: 1, preco_unitario: 5899.00},
    {id_pedido: 4, id_produto: 13, quantidade: 1, preco_unitario: 3999.00},
    {id_pedido: 4, id_produto: 14, quantidade: 1, preco_unitario: 1299.00}
  ]);
};