let express = require("express")
let router = express.Router()
let validator = require("validator")
let mongoose = require("mongoose")
let Product = mongoose.model("Product")
let utilities = require("./utilities")
let databaseManager = require("./databaseManager")

router.get("/", function (req, res) {
  if (Object.keys(req.query).length > 0) {
    let category = req.query.category
    let criteria = req.query.criteria
    if (category && criteria) {
      if ((category === "cameras" || category === "computers" || category === "consoles" || category === "screens" || category === "all") &&
        (criteria === "alpha-asc" || criteria === "alpha-dsc" || criteria === "price-asc" || criteria === "price-dsc")) {
        databaseManager.findProductByCategory(category, function (products) {
          utilities.sortProducts(criteria, products)
          return res.status(200).json(products).end()
        })
      }
      else {
        return res.status(400).send("Invalid category or criteria.")
      }
    }
    else if (category) {
      if (category === "cameras" || category === "computers" || category === "consoles" || category === "screens") {
        databaseManager.findProductByCategory(category, function (products) {
          utilities.sortProducts("price-asc", products)
          return res.status(200).json(products).end()
        })
      }
      else {
        return res.status(400).send("Invalid category.")
      }
    }
    else if (criteria) {
      if (criteria === "alpha-asc" || criteria === "alpha-dsc" || criteria === "price-asc" || criteria === "price-dsc") {
        databaseManager.findAllProducts(function (products) {
          utilities.sortProducts(criteria, products)
          return res.status(200).json(products).end()
        })

      }
      else {
        return res.status(400).send("Invalid criteria.")
      }
    }
    else {
      return res.status(400).send("Allowed parameters are criteria and category.")
    }
  }
  else {
    databaseManager.findAllProducts(function (products) {
      utilities.sortProducts("price-asc", products)
      return res.status(200).json(products).end()
    })
  }
})

router.get("/:id", function (req, res) {
  let id = req.params.id;
  Product.findOne({"id": id}, function (err, product) {
    if (product === null) {
      return res.status(404).send("Product not found.")
    }
    return res.status(200).json(product).end()
  });

});


router.post("/", function (req, res) {
  if (validator.isInt(JSON.stringify(req.body.id))) {
    databaseManager.countProducts(JSON.stringify(req.body.id), function (count) {
      if (count > 0) {
        return res.status(400).send("ID already associated with another object in the database.").end()
      }
      else {
        if (JSON.stringify(req.body.name) === JSON.stringify('')) {
          return res.status(400).send("Name of the product cannot be empty.").end()
        }
        else {
          if (!validator.isFloat(JSON.stringify(req.body.price), {gt: 0.00})) {

            return res.status(400).send("Specified price is invalid.").end()
          }
          else {
            if (JSON.stringify(req.body.image) === JSON.stringify('')) {
              return res.status(400).send("Image needs to be specified.").end()
            }
            else {
              let category = JSON.stringify(req.body.category)

              if (category !== JSON.stringify('cameras') && category !== JSON.stringify('computers') && category !== JSON.stringify('consoles') && category !== JSON.stringify('screens')) {
                return res.status(400).send("Category must be in range [cameras, computers, consoles, screens]").end()
              }
              else {
                if (JSON.stringify(req.body.description) === JSON.stringify('')) {
                  return res.status(400).send("Description cannot be empty.").end()
                }
                else {
                  if (!utilities.isListOfNonEmptyElements(req.body.features)) {
                    return res.status(400).send("Features are invalid.").end()
                  }
                  else {
                    let newProduct = Product({
                      id: req.body.id,
                      name: req.body.name,
                      price: req.body.price,
                      image: req.body.image,
                      category: req.body.category,
                      description: req.body.description,
                      features: req.body.features
                    });

                    newProduct.save(function (err) {
                      return res.status(201).send("Product " + req.body.id + " - " + req.body.name + " was added to the database.").end()
                    })
                  }
                }
              }
            }
          }
        }
      }
    })
  }
  else {
    return res.status(400).send("ID is invalid.").end()
  }
});


router.delete("/:id", function (req, res) {
  let id = req.params.id;

  databaseManager.deleteProductById(id, function (err, removed) {
    if (err) {
      return res.status(404).send("Cannot remove item.").end()
    }
    if (!removed) {
      return res.status(404).send("Product not found.").end()

    }
    return res.status(204).send("Product " + removed.id + " was successfully deleted.").end()
  })
});

router.delete("/", function (req, res) {
  databaseManager.deleteAllProducts(function () {
    return res.status(204).send("All products were removed.").end()
  })
});


module.exports = router
