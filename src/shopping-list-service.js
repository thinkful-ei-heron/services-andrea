/* eslint-disable strict */
const ShoppingList = {
  getAllItems(knex){
    return knex.select('*').from('shopping_list');
  },

  //CREATE
  insertItem(knex, newItem){
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => {
        return rows[0]
      });
  },
  //READ
  getById(knex, id){
    return knex
      .from('shopping_list')
      .select('*')
      .where('id', id)
      .first();
  },
  //UPDATE
  updateItem(knex, id, newItemFields){
    return knex('shopping_list')
      .where({id})
      .update(newItemFields);
  },
  //DELETE
  deleteItem(knex, id){
    return knex('shopping_list')
      .where({id})
      .delete();
  }
};

module.exports = ShoppingList;