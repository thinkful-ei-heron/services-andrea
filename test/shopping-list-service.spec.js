/* eslint-disable strict */
const ShoppingList = require('../src/shopping-list-service');
const knex = require('knex');

describe('Shopping list service object', function() {
  let knexInstance;
  let testItems = [
    {
      id: 1,
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      name: 'Chicken',
      price: 5.00,
      category: 'Main',
      checked: true,
    },
    {
      id: 2,
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      name: 'Bacon',
      price: 4.00,
      category: 'Breakfast',
      checked: false,
    },
    {
      id:3, 
      date_added: new Date('1919-12-22T16:28:32.615Z'), 
      name: 'Oranges',
      price: 3.00,
      category: 'Snack',
      checked: true,
    },
  ];

  before(() =>{
    knexInstance=knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });
  

  after(()=> knexInstance.destroy());
  //truncate method will remove all data from the table
  before(() =>knexInstance('shopping_list').truncate());
  
    
  context('Given "shopping_list" has data', () => {
      beforeEach(()=>{
          return knexInstance
          .into('shopping_list')
          .insert(testItems)
      });
      it('getById() resolves an item by id from "shopping_list" table', () =>{
          const thirdId = 3
          const thirdTestItem= testItems[thirdId -1]
          return ShoppingList.getById(knexInstance, thirdId)
           .then(actual => {
               expect(actual).to.eql({
                   id: thirdId,
                   name: thirdTestItem.name,
                   price: thirdTestItem.price,
                   category: thirdTestItem.category,
                   checked: thirdTestItem.checked,
                   date_added: thirdTestItem.date_added,
               })
           })
      })
      it('deleteItem() removes an item by id from "shopping_list" table', () =>{
          const itemId = 3
          return ShoppingList.deleteItem(knex, itemId)
           .then(() =>ShoppingList.getAllItems(knex))
           .then(allItems =>{
               const expected = testItems.filter(item => item.id !== itemId)
               expect(allItems).to.eql(expected)
           })
      })
    
      it('getAllItems() resolves all items from "shopping_list" table', () => {
        return ShoppingList.getAllItems(knexInstance)
         .then(actual => {
           expect(actual).to.eql(testItems.map(item =>({
            ...item,
            date_added: new Date(item.date_added)
          })));
        });
      });

  context('Given "shopping_list" has no data', ()=>{
      it('getAllItems() resiolves an empty array', ()=>{
          return ShoppingList.getAllItems(knexInstance)
           .then(actual => {
              expect(actual).to.eql([])
           });
      });
      it('insertItem() inserts a new item and resolves the new article with an "id"', () =>{
          const newItem = {
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            name: 'Test new title',
            price: 5.00,
            category: 'Test new content',
            checked: true,
          }
          return ShoppingList.insertItem(knexInstance, newItem)
           .then(actual =>{
               expect(actual).to.eql({
                   id: 1,
                   date_added: new Date (newItem.date_added),
                   name: newItem.name,
                   price: newItem.price,
                   category: newItem.category,
                   checked: newItem.checked,
               })
           })
      })
  }); 
  });
});

