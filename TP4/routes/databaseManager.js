let utilities = require("./utilities")
let mongoose = require("mongoose")
const Product = mongoose.model("Product")
const databaseManager = {

  findAllProducts: (callback) => {
    Product.find({}, function (err, products) {
      callback(products)
    });
  },

  findProductById: (id, callback) => {
    Product.findOne({"id": id}, function (err, product) {
      callback(product)
    })
  },

  findProductByCategory: (category, callback) => {
    Product.find({"category": category}, function (err, products) {
      callback(products)
    });
  },

  deleteAllProducts: (callback) => {
    Product.remove({}, function () {
      callback()
    })
  },
  deleteProductById: (id, callback) => {
    Product.findOneAndRemove({"id": id}, function (err, removed) {
      callback(err, removed)
    })
  },

  countProducts: (id, callback) => {
    Product.count({"id": id}, function (err, count) {

      callback(count)
    })
  },

  getAllProductsBasedOnShoppingCart: (products, callback) => {

    let allProductInfo = []
    if(products)
    {
      let allProducts = JSON.parse(products)
      let itemsProcessed = 0
      allProducts.forEach(function(p)
      {
        Product.findOne({"id" : p.productId}, function(err, product)
        {
          p.name = product.name
          p.price = product.price
          allProductInfo.push(p)
          itemsProcessed++
          if(itemsProcessed === allProducts.length)
          {
            utilities.sortProducts("alpha-asc", allProductInfo)
            callback(allProductInfo)
          }
        })
      })
    }
    else
    {
      callback(allProductInfo)
    }
  }
}

module.exports = databaseManager
