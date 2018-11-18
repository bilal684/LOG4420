//This file contains all the routes (get and post) of the application
const express = require("express");
const router = express.Router();
let databaseManager = require("./databaseManager")
let utilities = require("./utilities")


router.get("/", (req, res) => {
  res.render("index", {
    title: "OnlineShop - Accueil",
    name: "index",
    shoppingCartCount: utilities.getShoppingCartCount(req.session.order)
  });
});

router.get("/accueil", (req, res) => {
  res.render("index", {
    title: "OnlineShop - Accueil",
    name: "index",
    shoppingCartCount: utilities.getShoppingCartCount(req.session.order)
  });
});

router.get('/produits', function (req, res, next) {
  databaseManager.findAllProducts(function (prods) {
    utilities.sortProducts("price-asc", prods)
    res.render('produits', {
      title: "OnlineShop - Produits",
      name: "produits",
      productsCount: prods.length,
      products: prods,
      shoppingCartCount: utilities.getShoppingCartCount(req.session.order),
      fPrice: utilities.formatPrice
    })
  })
});

router.get('/produits/:id', function (req, res, next) {
  databaseManager.findProductById(req.params.id, function (prod) {
    res.render('produit', {
      title: "OnlineShop - Produit",
      name: "produits",
      product: prod,
      shoppingCartCount: utilities.getShoppingCartCount(req.session.order),
      fPrice: utilities.formatPrice
    })
  })
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "OnlineShop - Contact",
    name: "contact",
    shoppingCartCount: utilities.getShoppingCartCount(req.session.order)
  });
});

router.get("/panier", (req, res) => {
  databaseManager.getAllProductsBasedOnShoppingCart(req.session.order, function (order) {
    res.render("panier", {
      title: "OnlineShop - Panier",
      shoppingCartCount: utilities.getShoppingCartCount(req.session.order),
      order: order,
      fPrice: utilities.formatPrice,
      total: utilities.getTotalShoppingCartPrice(order),
      containsItems: (order.length > 0)
    });
  })

});

router.get("/commande", (req, res) => {
  res.render("commande", {
    title: "OnlineShop - Commande",
    shoppingCartCount: utilities.getShoppingCartCount(req.session.order)
  });
});

router.post("/confirmation", (req, res) => {
  databaseManager.getLatestPlacedOrderByFirstAndLastName(req.body["first-name"], req.body["last-name"], function (order) {
    res.render("confirmation", {
      title: "OnlineShop - Confirmation",
      shoppingCartCount: utilities.getShoppingCartCount(req.session.order),
      firstName: req.body["first-name"],
      lastName: req.body["last-name"],
      orderId: order.id
    })
  });
});

module.exports = router
