const express = require("express");
const router = express.Router();
let databaseManager = require("./databaseManager")
let utilities = require("./utilities")
session = require("express-session");


router.get("/", (req, res) => {
  res.render("index", { title: "OnlineShop - Accueil", name:"index", shoppingCartCount: utilities.getShoppingCartCount(req.session.order)});
});

router.get("/accueil", (req, res) => {
  res.render("index", { title: "OnlineShop - Accueil", name:"index", shoppingCartCount: utilities.getShoppingCartCount(req.session.order)});
});

router.get('/produits', function(req, res, next) {
    databaseManager.findAllProducts(function(prods) {
      utilities.sortProducts("price-asc", prods)
      res.render('produits', { title: "OnlineShop - Produits", name:"produits", productsCount : prods.length, products : prods, shoppingCartCount: utilities.getShoppingCartCount(req.session.order)})
    })
});

router.get('/produits/:id', function(req, res, next) {
    databaseManager.findProductById(req.params.id, function(prod) {
      res.render('produit', { title: "OnlineShop - Produit", name:"produits", product : prod, shoppingCartCount: utilities.getShoppingCartCount(req.session.order) })
    })
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "OnlineShop - Contact", name:"contact", shoppingCartCount: utilities.getShoppingCartCount(req.session.order) });
});

router.get("/panier", (req, res) => {
  databaseManager.getAllProductsBasedOnShoppingCart(req.session.order, function (order) {
    res.render("panier", { title: "OnlineShop - Panier", shoppingCartCount: utilities.getShoppingCartCount(req.session.order), order : order, fPrice : formatPrice });
  })

});

router.get("/commande", (req, res) => {
  res.render("commande", { title: "OnlineShop - Commande", shoppingCartCount: utilities.getShoppingCartCount(req.session.order)});
});

router.get("/confirmation", (req, res) => {
  res.render("confirmation", { title: "OnlineShop - Confirmation", shoppingCartCount: utilities.getShoppingCartCount(req.session.order) });
});

function formatPrice(price)
{
    return price.toFixed(2).replace(".", ",") + " $"
}

module.exports = router
