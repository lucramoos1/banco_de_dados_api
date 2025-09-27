/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('clientes').del();
  
  // Inserts seed entries
  await knex('clientes').insert([
    {id: 1, nome: 'Daniel Ventura', email: 'daniel@email.com', cidade: 'Juiz de Fora'},
    {id: 2, nome: 'Danilu Samuel', email: 'danilu@email.com', cidade: 'Santana de Cataguases'},
    {id: 3, nome: 'Larissa da Glória', email: 'larissa@email.com', cidade: 'Cataguases'},
    {id: 4, nome: 'Lucas Araújo', email: 'lucas.a@email.com', cidade: 'Leopoldina'},
    {id: 5, nome: 'João Pedro', email: 'joao@email.com', cidade: 'Rio de Janeiro'},
    {id: 6, nome: 'Yasmin Dias', email: 'yasmin@email.com', cidade: 'São Paulo'}
  ]);
};