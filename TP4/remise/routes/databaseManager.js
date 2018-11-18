let utilities = require("./utilities")
let mongoose = require("mongoose")
const Product = mongoose.model("Product")
const Order = mongoose.model("Order")
const databaseManager = {
  //Method to find all products from the database.
  findAllProducts: (callback) => {
    Product.find({}, function (err, products) {
      callback(products)
    });
  },
  //Method to find a product by id from the database.
  findProductById: (id, callback) => {
    Product.findOne({"id": id}, function (err, product) {
      callback(product)
    })
  },
  //Method to find products by category from the database.
  findProductByCategory: (category, callback) => {
    Product.find({"category": category}, function (err, products) {
      callback(products)
    });
  },
  //Method to delete all products from the database.
  deleteAllProducts: (callback) => {
    Product.remove({}, function () {
      callback()
    })
  },
  //Method to delete a product by id from the database.
  deleteProductById: (id, callback) => {
    Product.findOneAndRemove({"id": id}, function (err, removed) {
      callback(err, removed)
    })
  },
  //Method to a product by id from the database.
  countProducts: (id, callback) => {
    Product.count({"id": id}, function (err, count) {
      callback(count)
    })
  },
  //Method to get product name and price from the database based on shopping cart.
  getAllProductsBasedOnShoppingCart: (products, callback) => {

    let allProductInfo = []
    if (products) {
      let allProducts = JSON.parse(products)
      let itemsProcessed = 0
      allProducts.forEach(function (p) {
        Product.findOne({"id": p.productId}, function (err, product) {
          p.name = product.name
          p.price = product.price
          allProductInfo.push(p)
          itemsProcessed++
          if (itemsProcessed === allProducts.length) {
            utilities.sortProducts("alpha-asc", allProductInfo)
            callback(allProductInfo)
          }
        })
      })
    }
    else {
      callback(allProductInfo)
    }
  },

  //Method to get last placed order of a customer based on his first and last name
  getLatestPlacedOrderByFirstAndLastName: (firstName, lastName, callback) => {
    Order.findOne({'firstName': firstName, 'lastName': lastName}, ['id'], {sort: {id: -1}}, function (err, order) {
      callback(order)
    })
  }
}

module.exports = databaseManager
