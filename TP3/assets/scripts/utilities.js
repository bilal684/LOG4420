const utilities = {
    updateShoppingCartBadge: () => {
        if (localStorage.getItem('cartQuantity') === null || localStorage.getItem('cartQuantity') === 0) {
          $('.count').hide()
        } else {
          $('.count').text(localStorage.getItem('cartQuantity'))
          $('.count').show()
        }
    },

    sortPriceAscending: (data) => {
        data.sort(function(a,b) {
            return a.price - b.price
        })
    },

    sortPriceDescending: (data) => {
        data.sort(function(a,b) {
            return b.price - a.price
        })
    },

    sortNameAscending: (data) => {
        data.sort(function(a,b) {
            if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        })
    },

    sortNameDescending: (data) => {
        data.sort(function(a,b) {
            if(b.name.toLowerCase() < a.name.toLowerCase()) return -1;
            if(b.name.toLowerCase() > a.name.toLowerCase()) return 1;
            return 0;
        })
    },

    sortProducts: (basedOn, data) => {
        if(basedOn === "prix (bas-haut)")
        {
            utilities.sortPriceAscending(data)
        }
        else if (basedOn === "prix (haut-bas)")
        {
            utilities.sortPriceDescending(data)
        }
        else if (basedOn === "nom (a-z)")
        {
            utilities.sortNameAscending(data)
        }
        else
        {
            utilities.sortNameDescending(data)
        }
    },

    getUrlParams: (name) =>{
            var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href)
            if (results === null)
            {
                return null
            }
            return results[1] || 0;
    },

    getAllProducts: (products) => {
        if(!products)
        {
            $.ajax({
                async:false, 
                url:"./data/products.json",
                success: function(data){
                    products = data;
                }
            });
        }
        return products
    },

    isShoppingCartEmpty: () => {
        return (localStorage.getItem('cartQuantity') == null || localStorage.getItem('cartQuantity') == 0)
    },
    
}