$(function()
{
    var productVector = [];
    var quantityVector = [];
    var allProducts;
    var cartProducts;
    var totalPrice = 0;    

    if (utils.isShoppingCartEmpty()) {
        $('.shopping-cart-table, .shopping-cart-total, .btn').remove();
        $("article").append("<p>Aucun produit dans le panier.</p>")
    } else {
        $("tbody").empty();
        cartProducts = JSON.parse(localStorage.getItem('cart'));
        allProducts = getProduct(allProducts);
        cartProducts.forEach(function(product) {			
			allProducts.forEach(function(data) {				
				if (product.id == data.id)
				{	
                    productVector.push(data);	
                    quantityVector.push(product.quantity);			
				}
			});
		
        });
        utils.sortNameAscending(productVector);
        productVector.forEach(function(product) {
            cartProducts.forEach(function(data) {
                if (data.id == product.id)	{
                    appendProductToTable(product, data.quantity);
                }
            });
        });
        totalPrice = totalPrice.toFixed(2);
        totalPrice = totalPrice.replace('.',',');
        //$(".shopping-cart-total").remove();
        //$('tbody').append("<p class=\"shopping-cart-total\">Total: <strong>" + overallPrice + "&thinsp;$</strong></p>");
        $('.overall-price').text(totalPrice);
        $(".count").text(localStorage.getItem("cartQuantity"));
    }
    utils.updateShoppingCartBadge();
})

function appendProductToTable(product, quantity)
{
    let price = product.price.toString().replace('.',',');
    let totalAmount = price * quantity;
    let element = $("<tr>" +
    "<td><button title='Supprimer' class='remove-item-button'><i class='fa fa-times'></i></button></td>" +
    "<td><a href='./product.html?id=" + product.id + "'>" + product.name + "</a></td>" +
    "<td>" + price + "&thinsp;$</td>" +
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
    "<td class='price'>" + totalAmount + "&thinsp;$</td>" +
    "</tr>");
    $('tbody').append(element);

    totalPrice = parseFloat(totalPrice) + parseFloat(totalAmount);
}
