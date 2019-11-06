/* eslint-disable no-console */
/* eslint-disable strict */
require('dotenv').config();
const knex = require('knex');
const ShoppingList = require('./shopping-list-service');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

console.log(ShoppingList.getAllItems());

// function searchByItemName(searchTerm) {
//   knexInstance
//     .select('name', 'price', 'date_added', 'category', 'checked')
//     .from('shopping_list')
//     .where('name', 'ILIKE', `%${searchTerm}%`)
//     .then(res => {
//       console.log(res);
//     });
// }

// // searchByItemName('fish');

// function paginateProducts(pageNumber) {
//   const productsPerPage = 6;
//   const offset = productsPerPage * (pageNumber - 1);
//   knexInstance
//     .select('name', 'price', 'date_added', 'category', 'checked')
//     .from('shopping_list')
//     .limit(productsPerPage)
//     .offset(offset)
//     .then(res => {
//       console.log(res);
//     });
// }

// //paginateProducts(3);

// function addedAfterDate(daysAgo) {
//   knexInstance
//     .select('name', 'price', 'date_added', 'category', 'checked')
//     .where(
//       'date_added',
//       '>',
//       // eslint-disable-next-line quotes
//       knexInstance.raw(`now() - '?? days' ::INTERVAL`, daysAgo)
//     )
//     .from('shopping_list')
//     .then(res => {
//       console.log(res);
//     });
// }

// //addedAfterDate(10);

// function totalCost() {
//   knexInstance
//     .select('category')
//     .sum('price as total')
//     .from('shopping_list')
//     .groupBy('category')
//     .then(res => console.log(res));
// }

// totalCost();
