$(function()
{
    utils.updateShoppingCartBadge()

    var allProducts
    var currentProducts
    $(".product").remove()

    $.ajax({
        async:false,
        url:"./data/products.json",
        success: function(data)
        {
            allProducts = data
            utils.sortProducts($("#product-criteria .selected").text().toLowerCase(), data)
            appendProductToList(data)
            $("products-count").text(data.length + " produits")
        }
    })

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

        utils.sortProducts($("#product-criteria .selected").text().toLowerCase(), currentProducts)
        appendProductToList(currentProducts)
        $("#products-count").text(currentProducts.length + " produits")
    })


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

        utils.sortProducts($(this).text().toLowerCase(), products)
        appendProductToList(products)
    })

})

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