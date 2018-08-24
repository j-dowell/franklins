const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);

const criteria = process.argv.slice(2);

const knex = require('./db_knex');


function newOrder(user, timePlaced, orderArray) {
  knex('orders')
    .insert({ user_id: user,
       date: timePlaced,
       time: timeplaced
     })
    .returning('id')
    .then(function(id){
      return knex.insert({order_id: id,
        menu_item_id: orderArray[0],
        quantity: orderArray[1]}).into('line_items');
    });

}

newOrder()

/*

menu page SELECT display all items
 - Cart -
menu page SELECT admin all items + UPDATE/delete
orders user SELECT list of all orders by their id sorted into current and past
orders admin SELECT list of all orders sorted into current and past AND UPDATE

*/