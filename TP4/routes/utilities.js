let mongoose = require("mongoose")
let Product = mongoose.model("Product")

const utilities = {
  //Fonction pour trier en fonction du prix (croissant)
  sortPriceAscending: (data) => {
    data.sort(function (a, b) {
      return a.price - b.price
    })
  },
  //Fonction pour trier en fonction du prix (décroissant)
  sortPriceDescending: (data) => {
    data.sort(function (a, b) {
      return b.price - a.price
    })
  },
  //Fonction pour trier en fonction du nom (croissant)
  sortNameAscending: (data) => {
    data.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    })
  },
  //Fonction pour trier en fonction du nom (décroissant)
  sortNameDescending: (data) => {
    data.sort(function (a, b) {
      if (b.name.toLowerCase() < a.name.toLowerCase()) return -1;
      if (b.name.toLowerCase() > a.name.toLowerCase()) return 1;
      return 0;
    })
  },
  //Fonction maitresse pour le trie des produits.
  sortProducts: (basedOn, data) => {
    if (basedOn === "alpha-dsc") {
      utilities.sortNameDescending(data)
    }
    else if (basedOn === "price-dsc") {
      utilities.sortPriceDescending(data)
    }
    else if (basedOn === "alpha-asc") {
      utilities.sortNameAscending(data)
    }
    else {
      utilities.sortPriceAscending(data)
    }
  },

  isListOfNonEmptyElements: (list) => {
    if (list.length < 1) {
      return false
    }
    for (l of list) {
      if (!l || 0 === l.length) {
        return false
      }
    }
    return true
  },

  getShoppingCartCount: (allProducts) => {

    totalCount = 0
    if (allProducts && typeof(allProducts) == "string") {
      allProducts = JSON.parse(allProducts)
      for (product of allProducts) {
        totalCount += product.quantity
      }
    }
    return totalCount
  },

  formatPrice : (price) => {
    return price.toFixed(2).replace(".", ",")
  },

  getTotalShoppingCartPrice : (shoppingCart) => {

    let total = 0
    for(let p of shoppingCart)
    {
      total += p.quantity * p.price
    }
    return total
  }

}

module.exports = utilities
