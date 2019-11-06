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
      price: '5.00',
      category: 'Main',
    },
    {
      id: 2,
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      name: 'Bacon',
      price: '4.00',
      category: 'Breakfast',
    },
    {
      id:3, 
      date_added: new Date('1919-12-22T16:28:32.615Z'), 
      name: 'Oranges',
      price: '3.00',
      category: 'Snack',
    },
  ];

  before(() =>{
    knexInstance=knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });
  
  //truncate method will remove all data from the table
  before(() =>knexInstance('shopping_list').truncate());
  afterEach(() =>knexInstance('shopping_list').truncate());

  after(()=> knexInstance.destroy());
    
  context('Given "shopping_list" has data', () => {
      beforeEach(()=>{
          return knexInstance
          .into('shopping_list')
          .insert(testItems)
      });
      
      it('getAllItems() resolves all items from "shopping_list" table', () => {
        return ShoppingList.getAllItems(knexInstance)
         .then(actual => {
           expect(actual).to.eql(testItems.map(item =>({
            ...item,
            checked: false,
          })));
        });
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
                   date_added: thirdTestItem.date_added,
                   checked: false,
               })
           })
      })

      it('deleteItem() removes an item by id from "shopping_list" table', () =>{
          const itemId = 3
          return ShoppingList.deleteItem(knexInstance, itemId)
           .then(() =>ShoppingList.getAllItems(knexInstance))
           .then(allItems =>{
               const expected = testItems
                .filter(item => item.id !== itemId)
                .map(item =>({
                    ...item,
                    checked: false,
                }))
               expect(allItems).to.eql(expected)
           })
      })
      it('updateItem() updates an item from the "shopping_list" table', ()=>{
          const idOfItemToUpdate = 3
          const newItemData = {
            name: 'updated name',
            price: '7.00',
            date_added: new Date(),
            category: "Main",
            checked: true,
          }
          return ShoppingList.updateItem(knexInstance, idOfItemToUpdate, newItemData)
             .then(() => ShoppingList.getById(knexInstance, idOfItemToUpdate))
             .then(item => {
              expect(item).to.eql({
               id: idOfItemToUpdate,
              ...newItemData,
              })
          })
       })
  });

  context('Given "shopping_list" has no data', ()=>{
      it('getAllItems() resolves an empty array', ()=>{
          return ShoppingList.getAllItems(knexInstance)
           .then(actual => {
              expect(actual).to.eql([])
           });
      });

      it('insertItem() inserts a new item and resolves the new article with an "id"', () =>{
          const newItem = {
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            name: 'Test new title',
            price: '6.00',
            category: 'Main',
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


