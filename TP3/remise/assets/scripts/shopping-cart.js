// Variable globale pour contenir le montant total de la commande
var totalAmount = 0;

$(function() {
    var productVector = [];
    var allProducts;
    var cartProducts;
    // Vérification si le panier d'achat est vide
    if (utilities.isShoppingCartEmpty()) {
        // Vider le tableau des articles de la commande et affichage du message de panier vide
        emptyTableOfProducts();
    } else {
        // Si le panier est non vide on commence par enlever tous les articles du tableau de comande
        $("tbody").empty();
        // Récupérer tous les articles du panier
        cartProducts = JSON.parse(localStorage.getItem('cart'));
        // Récupérer tous les produits
        allProducts = utilities.getAllProducts(allProducts);
        // Récupérer, dans un tableau, tous les articles du panier avec leurs données
        cartProducts.forEach(function(product) {
			allProducts.forEach(function(data) {
				if (product.id == data.id) {	
                    productVector.push(data);			
				}
			});		
        });
        // Tri par ordre croissant du nom des articles du panier
        utilities.sortNameAscending(productVector);
        // Population de la table de commande avec les articles triés
        productVector.forEach(function(product) {
            cartProducts.forEach(function(data) {
                if (data.id == product.id) {
                    appendProductToTable(product, data.quantity);
                }
            });
        });
        // Mise à jour du montant total de la commande
        updateTotalAmount(totalAmount);
        // Mise à jour du nombre d'article dans le panier
        $('.count').text(localStorage.getItem("cartQuantity"));
    }
    // Mise à jour de l'affichage du nombre d'articles dans le logo du panier
    utilities.updateShoppingCartBadge();
    // Mise à jour de l'état du bouton '-' des lignes de commande (activé ou désactivé)
    updateRemoveQtyBtn();

    // Capture de l'événement du click du bouton 'X'(suppression) d'une ligne de commande 
    $(".remove-item-button").click(function() {   
        // Affichage de la boite de dialogue pour confirmer la suppression du produit et récupérer la réponse 
        if(confirm("Voulez-vous supprimer le produit du panier ?"))
        {
            // Récupérer le nombre d'articles dans le panier
            let cartQuantity = localStorage.getItem("cartQuantity");
            // Récupérer le nombre d'article du produit à supprimer de la commande
            let quantity = $(this).parents('tr').find(".quantity").text();
            cartQuantity = parseFloat(cartQuantity) - parseFloat(quantity);
            // Mise à jour du nombre d'articles du panier dans localStorage
            localStorage.setItem("cartQuantity", cartQuantity);
            // Mise à jour du nombre d'articles du panier pour affichage dans le logo du panier
            $(".count").text(cartQuantity);
            // Récupération du nom de l'article à supprimer de la commande pour le retirer des produits du panier
            let prodName = $(this).parents('tr').find("a").text();
            cartProducts = cartProducts.filter(product => product.name != prodName);
            // Mise à jour de localStorage
            localStorage.setItem("cart", JSON.stringify(cartProducts));
            // Récupération du prix unitaire et mise à jour du montant total de la commande
            let price = $(this).parents('tr').find(".unitPrice").text();
            price = parseFloat(price.substring(0, price.length - 2).replace(',','.'));
            totalAmount = parseFloat(totalAmount) - (parseFloat(quantity) * price);
            // retirer la ligne de commande
            $(this).parents('tr').remove();
            // Mise à jour de l'affichage du nombre d'articles dans le logo du panier
            utilities.updateShoppingCartBadge();            
            // Vérifier si le panier est vide après la mise à jour
            if (utilities.isShoppingCartEmpty()) {
                // Vider le tableau des articles de la commande et afficher le message du panier vide
                emptyTableOfProducts();
                // Mise à jour du localStorage
                localStorage.removeItem("cart");
                localStorage.removeItem("cartQuantity");
            } else {
                // Mise à jour du montant total de la commande si le panier est non vide
                updateTotalAmount(totalAmount);
            }
        }
    });

    // Capture de l'événement du click du bouton '-'(retrait) d'une ligne de commande 
    $(".remove-quantity-button").click(function() {            
        let productLine = $(this).parents('tr');
        // Mise à jour de la quantité et du prix du produit de la ligne de commande
        updateProductQuantity(cartProducts, productLine, -1);
    });

    // Capture de l'événement du click du bouton '+'(ajout) d'une ligne de commande 
    $(".add-quantity-button").click(function() {    
        let productLine = $(this).parents('tr');
        // Mise à jour de la quantité et du prix du produit de la ligne de commande
        updateProductQuantity(cartProducts, productLine, 1);
    });

    // Capture de l'événement du click du bouton 'Vider le panier' pour supprimer tous les articles du panier
    $("#remove-all-items-button").click(function() {   
        // Affichage de la boite de dialogue pour confirmer la suppression de tous les produits et récupérer la réponse 
        if(confirm("Voulez-vous supprimer tous les produits du panier ?"))
        {   
            // Vider le tableau des articles de la commande et afficher le message du panier vide     
            emptyTableOfProducts();
            // Mise à jour du localStorage
            localStorage.removeItem("cart");
            localStorage.removeItem("cartQuantity");
            // Mise à jour de l'affichage du nombre d'articles dans le logo du panier
            utilities.updateShoppingCartBadge(); 
        }
    });
    
})

// Fonction pour la mise à jour d'une ligne de commande et du montant totale de la commande
// suite à un ajout ou retrait d'un article d'une ligne de commande
function updateProductQuantity(cartProducts, productLine, value) {
    // Récupérer la quantité du produit de la ligne de commande
    let quantity = parseInt(productLine.find(".quantity").text());
    value = parseInt(value);
    // Mise à jour de la quantité
    quantity = quantity + value;   
    if (quantity > 0) {     
        // Mise à jour de la quantité de l'article dans le tableau de la ligne de commande
        productLine.find(".quantity").text(quantity.toString());   
        // Récupérer le prix unitaire de l'article         
        let price = productLine.find(".unitPrice").text().replace(',','.');
        let dollarSymbol = price.slice(-2);
        price = parseFloat(price.substring(0, price.length - 2)).toFixed(2);
        // Récupérer le prix total de la ligne de commande
        let totalPrice = productLine.find(".price").text().replace(',','.');
        totalPrice = totalPrice.substring(0, totalPrice.length - 2);
        totalPrice = parseFloat(totalPrice) + parseFloat(value * price);
        totalPrice = parseFloat(totalPrice).toFixed(2).toString().replace('.', ',') + dollarSymbol;
        productLine.find(".price").text(totalPrice);
        // Mise à jour du montant total de la commande
        totalAmount = parseFloat(totalAmount) + parseFloat(value * price);
        updateTotalAmount(parseFloat(totalAmount).toFixed(2));
        // Récupérer le nombre d'article du panier
        let cartQuantity = localStorage.getItem("cartQuantity");
        // Mise à jour du nombre d'article du panier dans localStorage
        cartQuantity = parseInt(cartQuantity) + value;
        localStorage.setItem("cartQuantity", cartQuantity);
        // Mise à jour du nombre d'articles du panier pour affichage dans le logo du panier
        $(".count").text(cartQuantity);
        // Récupération du nom du produit et mise à jour de sa quantité dans le panier
        let prodName = productLine.find("a").text();
        updateProductCart(prodName, quantity, cartProducts)
        // Mise à jour de l'affichage du nombre d'articles dans le logo du panier
        utilities.updateShoppingCartBadge(); 
        // Mise à jour de l'état du bouton '-' des lignes de commande (activé ou désactivé)
        updateRemoveQtyBtn();           
    }
}

// Fonction de mise à jour de l'état du bouton '-' des lignes de commande (activé ou désactivé)
function updateRemoveQtyBtn() {
    $("table tr .quantity").each(function () {
        // Vérifier si la quantité de l'article est unitaire pour désactiver le bouton '-' (retrait)
		if ( $(this).text() == 1 ) {
			$(this).parents('.row').find("button[title|='Retirer']").prop('disabled', true);
		} else {
            $(this).parents('.row').find("button[title|='Retirer']").prop('disabled', false);
        }
	});
}

// Fonction pour vider le tableau des articles de la commande et afficher le message du panier vide
function emptyTableOfProducts() {
    $('.shopping-cart-table, .shopping-cart-total, .btn').remove();
    $("article").append("<p>Aucun produit dans le panier.</p>")
}

// Fonction de mise à jour de la quantité d'un produit dans le panier
function updateProductCart(prodName, prodQty, cartProducts) {
	cartProducts.forEach(function(product) {
		if(product.name == prodName) {
			product.quantity = prodQty;
		}
	});
    // Mise à jour de localStorage
	localStorage.setItem("cart", JSON.stringify(cartProducts));
}

// Fonction de mise à jour du montant total de la commande
function updateTotalAmount(total) {
    // Retirer la ligne courante du montant total
    $('.shopping-cart-total').remove();
    // Formatage du montant total et ajout de la ligne correspondante dans la commande
    total = parseFloat(total).toFixed(2);
    $("table").after("<p class='shopping-cart-total'>Total: <strong id='total-amount'>" + total.toString().replace('.',',') + "</strong>&thinsp;$</p>");
}

// Fonction pour ajouter une ligne de commande prenant en paramètre le produit et sa quantité
function appendProductToTable(product, quantity) {
    // Formatage du prix unitaire
    let price = parseFloat(product.price).toFixed(2);
    // Calcul et formatage du prix total de la ligne de commande
    let totalPrice = (parseFloat(price) * parseFloat(quantity)).toFixed(2);
    // Composition HTML de la ligne de commande à ajouter dans la table de commande
    let element = $("<tr>" +
    "<td><button title='Supprimer' class='remove-item-button'><i class='fa fa-times'></i></button></td>" +
    "<td><a href='./product.html?id=" + product.id + "'>" + product.name + "</a></td>" +
    "<td class='unitPrice'>" + price.toString().replace('.',',') + "&thinsp;$</td>" +
    "<td>" +
        "<div class='row'>" +
        "<div class='col'>" +
            "<button title='Retirer' class='remove-quantity-button'><i class='fa fa-minus'></i></button>" +
        "</div>" +
        "<div class='col quantity'>" + quantity + "</div>" +
        "<div class='col'>" +
            "<button title='Ajouter' class='add-quantity-button'><i class='fa fa-plus'></i></button>" +
        "</div>" +
        "</div>" +
    "</td>" +
    "<td  class='price'>" + totalPrice.toString().replace('.',',') + "&thinsp;$</td>" +
    "</tr>");
    // Ajout de l'élément à la table de commande
    $('tbody').append(element);
    // Mise à jour du montant total de la commande suite à l'ajout de l'élément
    totalAmount = parseFloat(totalAmount) + parseFloat(totalPrice);
}


