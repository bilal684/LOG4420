$(function()
{
    var allProducts
    var currentPageId

    utils.updateShoppingCartBadge()

    allProducts = utils.getAllProducts(allProducts)
    currentPageId = utils.getUrlParams('id')

    let elementFound = false;
    for(product of allProducts)
    {
        if(product.id == currentPageId)
        {
            elementFound = true
            constructProductPage(product)
            break;
        }
    }

    if (!elementFound)
    {
        constructNotFoundProductPage()
    }

    $("form").submit(onFormSubmit)
})

function onFormSubmit(action)
{
    action.preventDefault()

    let cart = []
    if(localStorage.getItem("cart") !== null)
    {
        cart = JSON.parse(localStorage.getItem("cart"))
    }
    let currentPageId = utils.getUrlParams('id')
    let isInCart = false
    for(article of cart)
    {
        if(article.id === currentPageId)
        {
            isInCart = true
            article.quantity = parseInt(article.quantity) + parseInt($("#product-quantity").val())
        }
    }

    if(!isInCart)
    {
        cart.push({"id": currentPageId, "quantity": $("#product-quantity").val(), "name": $("article h1").text()})
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    let totalQuantity = localStorage.getItem("cartQuantity")
    if(totalQuantity === null)
    {
        totalQuantity = 0
    }

    totalQuantity = parseInt(totalQuantity) + parseInt($("#product-quantity").val())
    localStorage.setItem("cartQuantity", totalQuantity)
    utils.updateShoppingCartBadge()
    $("#dialog").addClass("show");
    setTimeout(function(){ $("#dialog").removeClass("show") }, 5000);
}

function constructProductPage(product)
{
    $("article h1").text(product.name)
    $("#product-image").remove()
    $(".col ul li").remove()
    $(".col p strong").remove()
    $(".col section:first-child p").remove()
    productImage = $("<img id='product-image' alt='" + product.name + "' src='./assets/img/" + product.image + "'>")
    $(".row .col:first-child").append(productImage)
    $(".col section:first-child").append("<p id='product-desc'>" + product.description + "</p>")
    $(".col ul").attr('id', 'product-features')
    product.features.forEach(function(feature){
        htmlFeature = $("<li>" + feature + "</li>");
        $(".col ul").append(htmlFeature)
    })
    let price = product.price.toString().replace('.',',')
    htmlPrice = $("<strong id='product-price'>" + price + "&thinsp;$</strong>")
    $(".col > p").append(htmlPrice)
}

function constructNotFoundProductPage()
{
    $("article").remove()
    $("main").append($("<h1>Page non trouvée!</h1>"))
}