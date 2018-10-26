$(function(){
    utils.updateShoppingCartBadge()

    let acc = JSON.parse(localStorage.getItem("compte"))
    $("#name").text(acc.prenom + " " + acc.nom)

    let confirmationNumber = localStorage.getItem("confirmation")
    $("#confirmation-number").text(confirmationNumber)
})