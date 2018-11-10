const express = require("express");
const router = express.Router();
var request = require('request');

router.get("/", (req, res) => {
  res.render("index", { title: "OnlineShop - Accueil", name:"index" });
});

router.get("/accueil", (req, res) => {
  res.render("index", { title: "OnlineShop - Accueil", name:"index" });
});

router.get('/produits', function(req, res, next) {
  request("http://localhost:8000/api/products", function (err, response, body) {
    if (err) 
    {
      return err
    } else if(response.statusCode !== 200) {
      return response
    }
    res.render('produits', { title: "OnlineShop - Produits", name:"produits", products : JSON.parse(body) });
  });
});

router.get('/produits/:id', function(req, res, next) {
  request("http://localhost:8000/api/products/" + req.params.id, function (err, response, body) {
    if (err)
    {
      return err
    } 
    else if(response.statusCode !== 200) {
      return response
    }
    res.render('produit', { title: "OnlineShop - Produit", name:"produits", product : JSON.parse(body) });
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "OnlineShop - Contact", name:"contact" });
});

router.get("/panier", (req, res) => {
  res.render("panier", { title: "OnlineShop - Panier" });
});

router.get("/commande", (req, res) => {
  res.render("commande", { title: "OnlineShop - Commande" });
});

router.get("/confirmation", (req, res) => {
  res.render("confirmation", { title: "OnlineShop - Confirmation" });
});

module.exports = router
