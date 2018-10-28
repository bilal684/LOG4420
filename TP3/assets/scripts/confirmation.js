$(function(){
    utilities.updateShoppingCartBadge()

    let acc = JSON.parse(localStorage.getItem("compte"))
    $("#name").text(acc[0].prenom + " " + acc[0].nom)

    let confirmationNumber = localStorage.getItem("confirmation")
    $("#confirmation-number").text(confirmationNumber)
})