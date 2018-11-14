const utilities = {
    //Fonction pour mettre à jour le badge du shopping cart.
    /*updateShoppingCartBadge: () => {
        if (localStorage.getItem('cartQuantity') === null || localStorage.getItem('cartQuantity') === 0) {
          $('.count').hide()
        } else {
          $('.count').text(localStorage.getItem('cartQuantity'))
          $('.count').show()
        }
    },*/
    //Fonction pour trier en fonction du prix (croissant)
    sortPriceAscending: (data) => {
        data.sort(function(a,b) {
            return a.price - b.price
        })
    },
    //Fonction pour trier en fonction du prix (décroissant)
    sortPriceDescending: (data) => {
        data.sort(function(a,b) {
            return b.price - a.price
        })
    },
    //Fonction pour trier en fonction du nom (croissant)
    sortNameAscending: (data) => {
        data.sort(function(a,b) {
            if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        })
    },
    //Fonction pour trier en fonction du nom (décroissant)
    sortNameDescending: (data) => {
        data.sort(function(a,b) {
            if(b.name.toLowerCase() < a.name.toLowerCase()) return -1;
            if(b.name.toLowerCase() > a.name.toLowerCase()) return 1;
            return 0;
        })
    },
    //Fonction maitresse pour le trie des produits.
    sortProducts: (basedOn, data) => {
        if(basedOn === "alpha-dsc")
        {
            utilities.sortNameDescending(data)
        }
        else if (basedOn === "price-dsc")
        {
            utilities.sortPriceDescending(data)
        }
        else if (basedOn === "alpha-asc")
        {
            utilities.sortNameAscending(data)
        }
        else
        {
            utilities.sortPriceAscending(data)
        }
    },

    isListOfNonEmptyElements : (list) => {
        if(list.length < 1)
        {
            return false
        }
        for(l of list)
        {
            if(!l || 0 === l.length)
            {
                return false
            }
        }
        return true
    },

    getShoppingCartCount : (allProducts) => {
        totalCount = 0
        if(allProducts)
        {
          allProducts = JSON.parse(allProducts)
          for(product of allProducts)
          {
            totalCount += product.quantity
          }
        }
        return totalCount
    }
    

    /*//Fonction pour obtenir l'identifiant du URL.
    getUrlParams: (name) =>{
            var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href)
            if (results === null)
            {
                return null
            }
            return results[1] || 0;
    },*/
    //Fonction qui effectue un appelle vers le serveur pour obtenir la liste des produits
    /*getAllProducts: (products) => {
        if(!products)
        {
            $.ajax({
                async:false,
                url:"./data/products.json",
                success: function(data)
                {
                    //Dans le cas d'un succès, on trie les produits et on les mets dans le tableau.
                    products = data
                },
                error: function(err) //Quand le serveur répond pas.
                {
                    alert("Ouvre ton serveur.")
                }
            })
        }
        return products
    },
    //Fonction qui vérifie si le shopping cart est vide.
    isShoppingCartEmpty: () => {
        return (localStorage.getItem('cartQuantity') === null || localStorage.getItem('cartQuantity') === 0)
    },*/
    
}

module.exports = utilities
