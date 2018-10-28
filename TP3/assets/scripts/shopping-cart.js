var totalPrice = 0;

$(function() {
    var productVector = [];
    var allProducts;
    var cartProducts;
    if (utils.isShoppingCartEmpty()) {
        emptyTableOfProducts();
    } else {
        $("tbody").empty();
        cartProducts = JSON.parse(localStorage.getItem('cart'));
        allProducts = utils.getAllProducts(allProducts);
        cartProducts.forEach(function(product) {			
			allProducts.forEach(function(data) {				
				if (product.id == data.id)
				{	
                    productVector.push(data);			
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
        updateTotalPrice(totalPrice);
        $('.count').text(localStorage.getItem("cartQuantity"));
    }
    utils.updateShoppingCartBadge();  
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
            let price = parseFloat($(this).parents('tr').find(".price").text().replace(',','.'));
            totalPrice = parseFloat(totalPrice) - (parseFloat(quantity) * price);
            $(this).parents('tr').remove();
    
            utils.updateShoppingCartBadge();            
    
            if (utils.isShoppingCartEmpty()) {
                emptyTableOfProducts();
                localStorage.removeItem("cart");
                localStorage.removeItem("cartQuantity");
            } else {
                updateTotalPrice(totalPrice);
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
            utils.updateShoppingCartBadge(); 
        }
    });
    
})

function updateProductQuantity(cartProducts, productLine, value) {
    let quantity = productLine.find(".quantity").text();
    quantity = parseInt(quantity) + value;   
    if (quantity > 0) {     
        productLine.find(".quantity").text(quantity);            
        let price = parseFloat(productLine.find(".price").text().replace(',','.'));
        let totalAmount = parseFloat(productLine.find("#total-amount").text().replace(',','.'));
        totalAmount = totalAmount + value * price;
        productLine.find("#total-amount").text(totalAmount.toFixed(2).toString().replace('.', ','));
        totalPrice = parseFloat(totalPrice) + value * price;
        updateTotalPrice(totalPrice);
        let cartQuantity = localStorage.getItem("cartQuantity");
        cartQuantity = parseInt(cartQuantity) + value;
        localStorage.setItem("cartQuantity", cartQuantity);
        $(".count").text(cartQuantity);
        let prodName = productLine.find("a").text();
        updateProductCart(prodName, quantity, cartProducts)
        utils.updateShoppingCartBadge(); 
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

function updateTotalPrice(total) {
    $('.shopping-cart-total').remove();
    total = total.toFixed(2);
    $("table").after("<p class='shopping-cart-total'>Total: <strong id='total-amount'>" + total.toString().replace('.',',') + "</strong>&thinsp;$</p>");
}

function appendProductToTable(product, quantity) {
    let price = product.price.toFixed(2);
    let totalAmount = price * quantity;
    let element = $("<tr>" +
    "<td><button title='Supprimer' class='remove-item-button'><i class='fa fa-times'></i></button></td>" +
    "<td><a href='./product.html?id=" + product.id + "'>" + product.name + "</a></td>" +
    "<td class='price'>" + price.toString().replace('.',',') + "&thinsp;$</td>" +
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
    "<td id='total-amount'>" + totalAmount.toString().replace('.',',') + "&thinsp;$</td>" +
    "</tr>");
    $('tbody').append(element);
    totalPrice = parseFloat(totalPrice) + parseFloat(totalAmount);
}


