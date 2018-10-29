$(function() {
	var firstName;
	var lastName;
	var confirmationNumber;
    var acc = {};
    // Mise à jour de l'affichage du nombre d'articles dans le logo du panier
	utilities.updateShoppingCartBadge();
    // Ajout de la méthode pour vérifier la validité de la date d'expiration de la carte de crédit
	jQuery.validator.addMethod("expirationDate", function(value, element) {
        let regEx = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        return this.optional(element) || regEx.test(value);
	}, "La date d'expiration de votre carte de crédit est invalide.");
    // Règles de vérification des champs du formulaire de commande
    $("#order-form").validate({
	  rules: {
        // Règle de vérification du prénom
	    'first-name': {
	      required: true,
	      minlength: 2
        },
        // Règle de vérification du nom
	    'last-name': {
	      required: true,
	      minlength: 2
        },
        // Règle de vérification du courriel
	    email: {
	      required: true,
	      email: true
        },
        // Règle de vérification du téléphone
	    phone: {
	      required: true,
	      phoneUS: true
        },
        // Règle de vérification de la carte de crédit
	    'credit-card': {
	      required: true,
	      creditcard: true
        },
        // Règle de vérification de la date d'expiration de la carte de crédit
	    'credit-card-expiry': {
	      required: true,
	      expirationDate: true
	    }
      },
      // Messages pour les saisie invalides des champs du formulaire
	  messages: {
	    'first-name': {
	      minlength: jQuery.validator.format("Veuillez fournir au moins {0} caractères.")
	    },
	    'last-name': {
	      minlength: jQuery.validator.format("Veuillez fournir au moins {0} caractères.")
	    }
	  }

    });
    
    // Capture de l'événement de soumission du formulaire
	$("form").submit(function(){
        // Vérification de la validité des champs du formulaire		
        if ($("#order-form").valid()) {
            // Récupération des valeurs des champs prénom et nom
			firstName = $("#first-name").val();
			lastName = $("#last-name").val();			
            acc = {
                prenom : firstName,
                nom : lastName 
            };
            // Mise à jour de localStorage
            localStorage.setItem("compte", JSON.stringify(acc));
			// Vérification si l'attribut "confirmation" de localStorage est initialisé
			if (localStorage.getItem("confirmation")) {
                // Incrémentation du numéro d'ordre de la confirmation
				confirmationNumber = parseInt(localStorage.getItem("confirmation")) + 1;
			} else {
                // Initialisation du numéro d'ordre de la confirmation
				confirmationNumber = 1;
            }
            // Mise à jour de localStorage
			localStorage.setItem("confirmation", confirmationNumber.toString());
			// Mise à jour de localStorage
			localStorage.removeItem("cart");
            localStorage.removeItem("cartQuantity");
            // Mise à jour de l'affichage du nombre d'articles dans le logo du panier
			utilities.updateShoppingCartBadge();
		}
	});
});