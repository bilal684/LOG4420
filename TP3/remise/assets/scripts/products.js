$(function()
{
    utilities.updateShoppingCartBadge()

    var allProducts
    var currentProducts
    $(".product").remove()

    //Obtention de la liste des produits du serveur.
    allProducts = utilities.getAllProducts(allProducts)
    utilities.sortProducts($("#product-criteria .selected").text().toLowerCase(), allProducts)
    appendProductToList(allProducts)
    $("products-count").text(allProducts.length + " produits") //Update du décompte des produits sur la page.

    //Pour la sélection des catégories de produits.
    $("#product-categories button").click(function(){

        $("#product-categories .selected").removeClass("selected")
        $(this).addClass("selected")

        $(".product").remove()

        let selectedCategory;
        
        if($(this).text().toLowerCase() === "appareils photo")
        {
            selectedCategory = "cameras"
        }
        else if ($(this).text().toLowerCase() === "consoles")
        {
            selectedCategory = "consoles"
        }
        else if ($(this).text().toLowerCase() === "ordinateurs")
        {
            selectedCategory = "computers"
        }
        else if ($(this).text().toLowerCase() === "écrans")
        {
            selectedCategory = "screens"
        }
        else
        {
            selectedCategory = null
        }

        currentProducts = []

        if(selectedCategory === null)
        {
            currentProducts = allProducts
        }
        else
        {
            allProducts.forEach(function(product)
            {
                if(product.category === selectedCategory)
                {
                    currentProducts.push(product)
                }
            })
        }

        utilities.sortProducts($("#product-criteria .selected").text().toLowerCase(), currentProducts)
        appendProductToList(currentProducts)
        $("#products-count").text(currentProducts.length + " produits")
    })

    //Pour le filtrage des produits.
    $("#product-criteria button").click(function(){

        $("#product-criteria .selected").removeClass("selected")
        $(this).addClass("selected")

        $(".product").remove();

        let products;

        if($("#product-categories .selected").text().toLowerCase() === "tous les produits")
        {
            products = allProducts
        }
        else
        {
            products = currentProducts
        }

        utilities.sortProducts($(this).text().toLowerCase(), products)
        appendProductToList(products)
    })

})
//Permet d'ajouter un produit au tableau des produits.
function appendProductToList(data)
{
    data.forEach(function(product) {
        let price = product.price.toString().replace('.',',')
        var newProduct = $("<div class='product'>" +
            "<a href='./product.html?id=" + product.id + "' title='En savoir plus...'>" +
            "<h2>" + product.name + "</h2>" +
            "<img alt='" + product.name + "' src='./assets/img/" + product.image + "'>" +
            "<p class='price'><small>Prix </small>" + price + "&thinsp;$</p>" +
            "</a></div>"
        )

        $('#products-list').append(newProduct)
    })
}