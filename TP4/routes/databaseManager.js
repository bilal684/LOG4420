let mongoose = require("mongoose")
let Product = mongoose.model("Product")

const databaseManager = {

    findAllProducts: (callback) => {
        Product.find({}, function(err,products)
        {  
            callback(products)
        });
    },

    findProductById: (id, callback) => {
        Product.findOne({"id" : id}, function(err, product)
        {
            callback(product)
        })
    },

    findProductByCategory: (category, callback) => {
        Product.find({"category" : category}, function(err,products)
        {  
            callback(products)
        });
    },

    deleteAllProducts: (callback) => {
        Product.remove({}, function()
        {
            callback()
        })
    },
    deleteProductById: (id, callback) => {
        Product.findOneAndRemove({"id" : id}, function(err, removed)
        {
            callback(err, removed)
        })
    },

    countProducts:(id,callback) => {
        Product.count({"id":id}, function(err, count) {

            callback(count)
        })
    }
}

module.exports = databaseManager