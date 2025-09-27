/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('produtos').del();
  
  // Inserts seed entries
  await knex('produtos').insert([
    {id: 1, nome: 'iPhone 15 Pro Max', preco: 9999.00, estoque: 160, id_marca: 1},
    {id: 2, nome: 'iPhone 15 Pro', preco: 8599.00, estoque: 200, id_marca: 1},
    {id: 3, nome: 'iPhone 15', preco: 7299.00, estoque: 300, id_marca: 1},
    {id: 4, nome: 'iPhone SE', preco: 4599.00, estoque: 100, id_marca: 1},
    {id: 5, nome: 'Samsung Galaxy S23 Ultra', preco: 7599.00, estoque: 180, id_marca: 2},
    {id: 6, nome: 'Samsung Galaxy S23', preco: 5999.00, estoque: 250, id_marca: 2},
    {id: 7, nome: 'Samsung Galaxy A54', preco: 2199.00, estoque: 400, id_marca: 2},
    {id: 8, nome: 'Samsung Galaxy Z Fold 5', preco: 12999.00, estoque: 50, id_marca: 2},
    {id: 9, nome: 'Samsung Galaxy Z Flip 5', preco: 7999.00, estoque: 80, id_marca: 2},
    {id: 10, nome: 'Xiaomi 13 Pro', preco: 6599.00, estoque: 120, id_marca: 3},
    {id: 11, nome: 'Xiaomi 13', preco: 5899.00, estoque: 150, id_marca: 3},
    {id: 12, nome: 'Xiaomi Redmi Note 12 Pro', preco: 2299.00, estoque: 350, id_marca: 3},
    {id: 13, nome: 'Xiaomi Poco F5 Pro', preco: 3999.00, estoque: 200, id_marca: 3},
    {id: 14, nome: 'Xiaomi Redmi 12', preco: 1299.00, estoque: 500, id_marca: 3},
    {id: 15, nome: 'Huawei P60 Pro', preco: 8299.00, estoque: 90, id_marca: 4},
    {id: 16, nome: 'Huawei Nova 11 Pro', preco: 4999.00, estoque: 110, id_marca: 4},
    {id: 17, nome: 'Huawei Mate X3', preco: 14999.00, estoque: 40, id_marca: 4},
    {id: 18, nome: 'Huawei Pura 70 Ultra', preco: 11999.00, estoque: 60, id_marca: 4},
    {id: 19, nome: 'Samsung Galaxy S24', preco: 6899.00, estoque: 220, id_marca: 2},
    {id: 20, nome: 'Xiaomi 14 Ultra', preco: 9599.00, estoque: 75, id_marca: 3},
    {id: 22, nome: 'Xiaomi 10 Ultra', preco: 9599.00, estoque: 0, id_marca: 3}
  ]);
};