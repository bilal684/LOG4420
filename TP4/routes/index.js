const express = require("express");
const router = express.Router();
let request = require('request');
let databaseManager = require("./databaseManager")
let utilities = require("./utilities")
const session = require("express-session");


router.get("/", (req, res) => {
  res.render("index", { title: "OnlineShop - Accueil", name:"index" });
});

router.get("/accueil", (req, res) => {
  res.render("index", { title: "OnlineShop - Accueil", name:"index"/*, shoppingCartCount: (session.order) ? session.order.length: 0*/});
});

router.get('/produits', function(req, res, next) {
    databaseManager.findAllProducts(function(prods) {
      utilities.sortProducts("price-asc", prods)
      res.render('produits', { title: "OnlineShop - Produits", name:"produits", productsCount : prods.length, products : prods/*, shoppingCartCount: (session.order) ? session.order.length: 0*/})
    })
});

router.get('/produits/:id', function(req, res, next) {
    databaseManager.findProductById(req.params.id, function(prod) {
      res.render('produit', { title: "OnlineShop - Produit", name:"produits", product : prod/*, shoppingCartCount: (session.order) ? session.order.length: 0 */})
    })
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "OnlineShop - Contact", name:"contact"/*, shoppingCartCount: (session.order) ? session.order.length: 0*/ });
});

router.get("/panier", (req, res) => {
  res.render("panier", { title: "OnlineShop - Panier"/*, shoppingCartCount: (session.order) ? session.order.length: 0*/ });
});

router.get("/commande", (req, res) => {
  res.render("commande", { title: "OnlineShop - Commande"/*, shoppingCartCount: (session.order) ? session.order.length: 0 */});
});

router.get("/confirmation", (req, res) => {
  res.render("confirmation", { title: "OnlineShop - Confirmation"/*, shoppingCartCount: (session.order) ? session.order.length: 0*/ });
});

module.exports = router
