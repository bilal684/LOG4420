$(function(){
    //On update le shopping cart badge lorsque sur confirmation.html.
    utilities.updateShoppingCartBadge()

    //Update du nom du client (on prend celui de order.html)
    let acc = JSON.parse(localStorage.getItem("compte"))
    $("#name").text(acc.prenom + " " + acc.nom)
    //Confirmation number.
    let confirmationNumber = localStorage.getItem("confirmation")
    $("#confirmation-number").text(confirmationNumber)
})