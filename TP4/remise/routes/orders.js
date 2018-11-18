let express = require("express");
let router = express.Router();
let validator = require('validator');
let mongoose = require("mongoose");
let Order = mongoose.model('Order');
let Product = mongoose.model('Product');

// Route for GET /api/orders (Get all orders)
router.get("/", function (req, res) {
  Order.find({}, function (err, orders) {
    return res.status(200).json(orders).end()
  })
})

// Route for GET /api/orders/:id (Get a specific order)
router.get("/:id", function (req, res) {
  let id = req.params.id
  Order.findOne({"id": id}, function (err, order) {
    if (order == null) {
      return res.status(404).send("Specified ID is not associated with an order").end()
    }
    return res.status(200).json(order).end()
  })
})

// Route for POST /api/orders (Place an order)
router.post("/", function (req, res) {
  if (validator.isInt(JSON.stringify(req.body.id))) {
    Order.count({id: JSON.stringify(req.body.id)}, function (err, count) {
      if (count > 0) {
        return res.status(400).send("Specified id is already associated to an order").end()
      }
      else {
        if (JSON.stringify(req.body.firstName) === JSON.stringify('') || JSON.stringify(req.body.lastName) === JSON.stringify('')) {
          return res.status(400).send("Customer name is invalid").end()
        }
        else {
          if (!validator.isEmail(req.body.email)) {
            return res.status(400).send("Invalid customer email").end()
          }
          else {
            let phone = req.body.phone
            phone = phone.replace("-", "");
            if (!validator.isMobilePhone(phone, 'en-CA')) {
              return res.status(400).send("Specified phone number is invalid").end()
            }
            else {
              let products = req.body.products
              let isValidProducts = true
              for (let product of products) {
                if (!validator.isFloat(JSON.stringify(product.quantity), {gt: 0.00}) || !validator.isInt(JSON.stringify(product.id))) {
                  isValidProducts = false
                  break
                }
              }

              if (isValidProducts) {
                let allIds = []
                for (let product of products) {
                  allIds.push(product.id)
                }
                Product.find({"id": {"$in": allIds}}).exec(function (err, prods) {
                  if (!err && prods.length == allIds.length) {
                    let newOrder = Order({
                      id: req.body.id,
                      firstName: req.body.firstName,
                      lastName: req.body.lastName,
                      email: req.body.email,
                      phone: req.body.phone,
                      products: req.body.products
                    })
                    newOrder.save(function (err) {
                      return res.status(201).send("Order was successfully saved").end()
                    })
                  }
                  else {
                    return res.status(400).send("One or more invalid product id").end()
                  }
                })
              }
              else {
                return res.status(400).send("One of the products purchased have an invalid id or quantity").end()
              }
            }
          }
        }
      }
    })
  }
  else {
    return res.status(400).send("Specified id is invalid.")
  }
})

// Route for delete /api/orders/:id (Delete a specific order)
router.delete("/:id", function (req, res) {
  let id = req.params.id
  Order.remove({"id": id}, function (err, removed) {
    if (removed.result.n == 0) {
      return res.status(404).send("Specified ID is not associated with an existing order").end()
    }
    else {
      return res.status(204).send("Order was successfully removed from the database").end()
    }
  })
})

// Route for delete /api/orders (Delete all orders)
router.delete("/", function (req, res) {
  Order.remove({}, function (err, removed) {
    return res.status(204).send("Order collection was pruned").end()
  })
})


module.exports = router
