$(document).ready(function() {

  function renderMenuItems(input) {

  }

  // Loads all menu items in database, called once on page load
  function loadAllMenuItems() {
    $.getJSON('/tweets', function(data) {
      renderMenuItems(data);
    });
  }

  // Makes html article from data input properties
  function createMenuItems(data) {

    let $text = $("<article>").addClass("menu-item");

    // Item properties
    let name = data.name;
    let price = data.price
    let photo = data.picture_url;
    let description = data.description;
    let category = data.category;
    let inventory = data.inventory;

    // HTML to append
    let insert = 
    `
      <article class=${category}>
        <h2 class="item-name">${name}</h2>
        <img class="item-photo" src="${photo}"></img>
        <p class="item-text">${description}</p>
        <p class="item-price>${price}</p>
        <p class="item-inventory">${inventory}</p>
      </article>
    `

      $text.html(insert);
      return $text;
  }
})