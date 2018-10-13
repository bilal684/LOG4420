const utils = {
    updateShoppingCartBadge: () => {
        if (localStorage.getItem('cartQuantity') === null || localStorage.getItem('cartQuantity') === 0) {
          $('.count').hide()
        } else {
          $('.count').text(localStorage.getItem('cartQuantity'))
        }
    }
}