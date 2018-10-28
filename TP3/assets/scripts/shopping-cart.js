var totalAmount = 0;

$(function() {
    var productVector = [];
    var allProducts;
    var cartProducts;
    if (utilities.isShoppingCartEmpty()) {
        emptyTableOfProducts();
    } else {
        $("tbody").empty();
        cartProducts = JSON.parse(localStorage.getItem('cart'));
        allProducts = utilities.getAllProducts(allProducts);
        cartProducts.forEach(function(product) {
			allProducts.forEach(function(data) {
				if (product.id == data.id) {	
                    productVector.push(data);			
				}
			});		
        });
        utilities.sortNameAscending(productVector);
        productVector.forEach(function(product) {
            cartProducts.forEach(function(data) {
                if (data.id == product.id) {
                    appendProductToTable(product, data.quantity);
                }
            });
        });
        updateTotalAmount(totalAmount);
        $('.count').text(localStorage.getItem("cartQuantity"));
    }
    utilities.updateShoppingCartBadge();  
    updateRemoveQtyBtn();  
    $(".remove-item-button").click(function() {
    
        if(confirm("Voulez-vous supprimer le produit du panier ?"))
        {        
            let cartQuantity = localStorage.getItem("cartQuantity");
            let quantity = $(this).parents('tr').find(".quantity").text();
            cartQuantity = parseFloat(cartQuantity) - parseFloat(quantity);
            localStorage.setItem("cartQuantity", cartQuantity);
            $(".count").text(cartQuantity);
    
            let prodName = $(this).parents('tr').find("a").text();
            cartProducts = cartProducts.filter(product => product.name != prodName);
            localStorage.setItem("cart", JSON.stringify(cartProducts));
            let price = $(this).parents('tr').find(".unitPrice").text();
            price = parseFloat(price.substring(0, price.length - 2).replace(',','.'));
            totalAmount = parseFloat(totalAmount) - (parseFloat(quantity) * price);
            $(this).parents('tr').remove();
    
            utilities.updateShoppingCartBadge();            
    
            if (utilities.isShoppingCartEmpty()) {
                emptyTableOfProducts();
                localStorage.removeItem("cart");
                localStorage.removeItem("cartQuantity");
            } else {
                updateTotalAmount(totalAmount);
            }
        }
    });

    $(".remove-quantity-button").click(function() {            
        let productLine = $(this).parents('tr');
        updateProductQuantity(cartProducts, productLine, -1);
    });

    $(".add-quantity-button").click(function() {    
        let productLine = $(this).parents('tr');
        updateProductQuantity(cartProducts, productLine, 1);
    });

    $("#remove-all-items-button").click(function() {    
        if(confirm("Voulez-vous supprimer tous les produits du panier ?"))
        {        
            emptyTableOfProducts();
            localStorage.removeItem("cart");
            localStorage.removeItem("cartQuantity");
            utilities.updateShoppingCartBadge(); 
        }
    });
    
})

function updateProductQuantity(cartProducts, productLine, value) {
    let quantity = parseInt(productLine.find(".quantity").text());
    value = parseInt(value);
    quantity = quantity + value;   
    if (quantity > 0) {     
        productLine.find(".quantity").text(quantity.toString());            
        let price = productLine.find(".unitPrice").text().replace(',','.');
        let dollarSymbol = price.slice(-2);
        price = parseFloat(price.substring(0, price.length - 2)).toFixed(2);
        let totalPrice = productLine.find(".price").text().replace(',','.');
        totalPrice = totalPrice.substring(0, totalPrice.length - 2);
        totalPrice = parseFloat(totalPrice) + parseFloat(value * price);
        totalPrice = parseFloat(totalPrice).toFixed(2).toString().replace('.', ',') + dollarSymbol;
        productLine.find(".price").text(totalPrice);
        totalAmount = parseFloat(totalAmount) + parseFloat(value * price);
        updateTotalAmount(parseFloat(totalAmount).toFixed(2));
        let cartQuantity = localStorage.getItem("cartQuantity");
        cartQuantity = parseInt(cartQuantity) + value;
        localStorage.setItem("cartQuantity", cartQuantity);
        $(".count").text(cartQuantity);
        let prodName = productLine.find("a").text();
        updateProductCart(prodName, quantity, cartProducts)
        utilities.updateShoppingCartBadge(); 
        updateRemoveQtyBtn();           
    }
}

function updateRemoveQtyBtn() {
    $("table tr .quantity").each(function () {
		if ( $(this).text() == 1 ) {
			$(this).parents('.row').find("button[title|='Retirer']").prop('disabled', true);
		} else {
            $(this).parents('.row').find("button[title|='Retirer']").prop('disabled', false);
        }
	});
}

function emptyTableOfProducts() {
    $('.shopping-cart-table, .shopping-cart-total, .btn').remove();
    $("article").append("<p>Aucun produit dans le panier.</p>")
}

function updateProductCart(prodName, prodQty, cartProducts) {
	cartProducts.forEach(function(product) {
		if(product.name == prodName) {
			product.quantity = prodQty;
		}
	});

	localStorage.setItem("cart", JSON.stringify(cartProducts));
}

function updateTotalAmount(total) {
    $('.shopping-cart-total').remove();
    total = parseFloat(total).toFixed(2);
    $("table").after("<p class='shopping-cart-total'>Total: <strong id='total-amount'>" + total.toString().replace('.',',') + "</strong>&thinsp;$</p>");
}

function appendProductToTable(product, quantity) {
    let price = parseFloat(product.price).toFixed(2);
    let totalPrice = (parseFloat(price) * parseFloat(quantity)).toFixed(2);
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
    $('tbody').append(element);
    totalAmount = parseFloat(totalAmount) + parseFloat(totalPrice);
}


