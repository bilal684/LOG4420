$(function() {
	var firstName;
	var lastName;
	var confirmationNumber;
	var acc = [];
    utils.updateShoppingCartBadge();
    
	jQuery.validator.addMethod("expirationDate", function(value, element) {
        let regEx = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        return this.optional(element) || regEx.test(value);
	}, "La date d'expiration de votre carte de crédit est invalide.");

    $("#order-form").validate({
	  rules: {
	    'first-name': {
	      required: true,
	      minlength: 2
	    },
	    'last-name': {
	      required: true,
	      minlength: 2
	    },
	    email: {
	      required: true,
	      email: true
	    },
	    phone: {
	      required: true,
	      phoneUS: true
	    },
	    'credit-card': {
	      required: true,
	      creditcard: true
	    },
	    'credit-card-expiry': {
	      required: true,
	      expirationDate: true
	    }
	  },
	  messages: {
	    'first-name': {
	      minlength: jQuery.validator.format("Veuillez fournir au moins {0} caractères.")
	    },
	    'last-name': {
	      minlength: jQuery.validator.format("Veuillez fournir au moins {0} caractères.")
	    }
	  }

	});

	$("form").submit(function(){
		
        if ($("#order-form").valid() == true) {
			firstName = $("#first-name").val();
			lastName = $("#last-name").val();			
			acc.push({"prenom": firstName, "nom": lastName});
            localStorage.setItem("compte", JSON.stringify(acc));
			
			if(localStorage.getItem("confirmation") == null) {
				confirmationNumber = 1;
			} else {
				confirmationNumber = parseInt(localStorage.getItem("confirmation")) + 1;
			}
			localStorage.setItem("confirmation", confirmationNumber.toString());
			
			localStorage.removeItem("cart");
			localStorage.removeItem("cartQuantity");
			utils.updateShoppingCartBadge();
		}
	});
});