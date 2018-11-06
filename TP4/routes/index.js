const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "OnlineShop - Accueil" });
});

router.get("/accueil", (req, res) => {
  res.render("index", { title: "OnlineShop - Accueil" });
});

router.get("/produits", (req, res) => {
  res.render("produits", { title: "OnlineShop - Produits" });
});

router.get("/produits/:id", (req, res) => {
  res.render("produit", { title: "OnlineShop - Produit" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "OnlineShop - Contact" });
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

module.exports = router;
