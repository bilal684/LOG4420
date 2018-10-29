$(function()
{
    var allProducts
    var currentPageId

    utilities.updateShoppingCartBadge() //Mise à jour du shopping cart badge.

    allProducts = utilities.getAllProducts(allProducts) //Obtention de tous les produits
    currentPageId = utilities.getUrlParams('id') //Obtention de l'id reçu en paramètre

    let elementFound = false;
    for(product of allProducts)
    {
        if(product.id == currentPageId) //Le produit qu'il veut existe vraiment.
        {
            elementFound = true
            constructProductPage(product) //Construire la page du produit en question.
            break;
        }
    }

    if (!elementFound)
    {
        constructNotFoundProductPage() //Produit non trouvé.
    }

    $("form").submit(onFormSubmit) //Évenement sur le submit du formulaire (e.g ajouter au panier)
})

//Fonction pour l'ajout d'un article au panier.
function onFormSubmit(action)
{
    action.preventDefault() //Stop le default behavior.

    let productQty = parseInt($("#product-quantity").val()) //On trouve la quantité que la personne a inséré

    let cart = []
    if(localStorage.getItem("cart") !== null) //Si il avait déjà une liste de produit dans son panier.
    {
        cart = JSON.parse(localStorage.getItem("cart"))
    }
    let currentPageId = utilities.getUrlParams('id')
    let isInCart = false
    for(article of cart)
    {
        if(article.id === currentPageId) //Si l'article qu'il veut ajouter existe déjà dans le panier
        {
            isInCart = true
            article.quantity = parseInt(article.quantity) + productQty
            break
        }
    }

    if(!isInCart) //Si pas déjà dans le panier, on l'ajoute.
    {
        cart.push({"id": currentPageId, "quantity": productQty, "name": $("article h1").text()})
    }

    localStorage.setItem("cart", JSON.stringify(cart)) //On met le panier d'achat dans le localStorage.
    let totalQuantity = localStorage.getItem("cartQuantity")
    if(totalQuantity === null) //Si localStorage n'avait pas de variable cartQuantity (e.g le premier produit qu'il ajoute dans le panier)
    {
        totalQuantity = 0
    }

    totalQuantity = parseInt(totalQuantity) + productQty 
    localStorage.setItem("cartQuantity", totalQuantity) //Mise à jour de la quantité
    utilities.updateShoppingCartBadge() //Mise à jour du shopping cart badge.
    $("#dialog").addClass("show") //Pour le snackbar
    setTimeout(function(){ $("#dialog").removeClass("show") }, 5000) //On enlève le snackbar après 5 secondes
}

//Fonction pour la construction d'une page de produit.
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

//Fonction pour construire la page d'erreur lorsque produit non trouvé.
function constructNotFoundProductPage()
{
    $("article").remove()
    $("main").append($("<h1>Page non trouvée!</h1>"))
}