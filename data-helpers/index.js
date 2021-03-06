
const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

exports = module.exports;

function getOrders(user) {
  if (user === 'admin') {
    return knex.select(
    'orders.id',
    'orders.time',
    'users.name AS username',
    'users.phone_number',
    'users.email',
    'menu_items.name',
    'menu_items.price',
    'line_items.quantity',
    'orders.order_status'
    )
    .from('orders')
    .leftJoin('users', 'orders.user_id', 'users.id')
    .leftJoin('line_items', 'orders.id', 'line_items.order_id')
    .leftJoin('menu_items', 'line_items.menu_item_id', 'menu_items.id')
    .then(function(rows) {
      return rows;
    });
  } else {
    return knex.select(
    'orders.id',
    'orders.time',
    'menu_items.name',
    'menu_items.price',
    'line_items.quantity',
    'orders.order_status',
    'orders.pickup_time'
    )
    .from('orders')
    .where({'user_id': user})
    .leftJoin('line_items', 'orders.id', 'line_items.order_id')
    .leftJoin('menu_items', 'line_items.menu_item_id', 'menu_items.id')
    .then(function(rows) {
      return rows;
    });
  }
}

exports.getOrders = getOrders;

function getOrderDetails(user) {
  if (user === 'admin') {
    return knex.select('id', 'time', 'order_status', 'pickup_time')
      .from('orders')
      .groupBy('id')
      .then(function(rows) {
        return rows;
      });
  } else {
    return knex.select('id', 'time', 'order_status', 'pickup_time')
      .from('orders')
      .where({'user_id': user})
      .groupBy('id')
      .then(function(rows) {
        return rows;
      });
  }
}

exports.getOrderDetails = getOrderDetails;



function getItems() {
  return knex.select('*')
    .from('menu_items')
    .then(function(rows) {
      return rows;
    })
    .catch((err) => {
      console.log( err);
      throw err; });
}

exports.getItems = getItems;


function newOrder(user, timePlaced, lineItems) {
  return knex.insert({
    user_id: user,
    time: timePlaced,
    order_status: 1
  })
  .returning('id')
  .into('orders')
  .then(function([id]){
    const lineItemsWithId = lineItems.map(lineItem => {
      lineItem.order_id = id;
      return lineItem;
    });
    return knex.insert(lineItemsWithId).into('line_items');
  });
}

exports.newOrder = newOrder;


//Retrieves order status
function getStatus(orderId) {
  return knex.select('order_status')
  .from('orders')
  .where({ id: orderId })
  .then(function(rows) {
    return rows;
  });
}

exports.getStatus = getStatus;


// Increments order status value by 1
function updateStatus(orderId) {
  return knex('orders')
  .where({ id: orderId })
  .update({ order_status: knex.raw('order_status + 1') })
  .then(function(){
    return;
  });
}

exports.updateStatus = updateStatus;


//Retrieves pick-up time
function getPickupTime(orderId) {
  return knex.select('pickup_time')
  .from('orders')
  .where({ id: orderId })
  .then(function(rows) {
    return rows;
  });
}

exports.getPickupTime = getPickupTime;


// Updates order pick up time
function updatePickupTime(orderId, timeReady) {
  return knex('orders')
  .where({ id: orderId })
  .update({ pickup_time: timeReady })
  .then(function(){
    return;
  });
}

exports.updatePickupTime = updatePickupTime;

//Retrieves order status
function getStatus(orderId) {
  return knex.select('order_status')
  .from('orders')
  .where({ id:orderId })
  .then(function(rows) {
    return rows;
  });
}

exports.getStatus = getStatus;

function addMenuItem(addName, addCost, addPrice, addDescription, addUrl, addInventory, addCategory) {
  return knex.insert({
    name: addName,
    cost: addCost,
    price: addPrice,
    description: addDescription,
    image_url: addUrl,
    inventory: addInventory,
    category: addCategory
  })
  .into('menu_items')
  .then(function(){
    return;
  });
}

exports.addMenuItem = addMenuItem;


// function updateInventory(soldItems) {
//   for (var i = 0; i < soldItems.length; i++) {
//   }
// }

// console.log(addMenuItem('Turkey on Rye', 4.00, 12.00, 'Delicious ovenroasted Lilydale turkey on rye bread', 'https://images.pexels.com/photos/5506/bread-food-salad-sandwich.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 100, 'sandwich'));

// const order1 = [{menu_item_id: 7, quantity: 3}, {menu_item_id: 3, quantity: 2}];
// newOrder(2, '2018-08-24T14:39:07.318Z', order1);

/*

- menu page SELECT display all items
 - Cart -
 - add menu item
DELETE menu item
- UPDATE order status
- orders user SELECT list of all orders by their id sorted into current and past
- orders admin SELECT list of all orders sorted into current and past AND UPDATE

Placed
In Progress
Ready for pick up
Picked up

*/
