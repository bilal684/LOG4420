import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, Product} from '../products.service'
import {ShoppingCartService} from '../shopping-cart.service'

/**
 * Defines the component responsible to manage the product page.
 */
@Component({
  selector: 'product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  /**
   * Initializes a new instance of the ProductComponent class.
   *
   * @param route                   The active route.
   */
  constructor(private route: ActivatedRoute, private productsService: ProductsService, private shoppingCartService : ShoppingCartService) { }

  product : Product
  showSnackbar : boolean = false
  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id')
    // TODO: Compléter la logique pour afficher le produit associé à l'identifiant spécifié (productId).
    this.productsService.getProduct(parseInt(productId)).then(p => {
      this.product = p
    })
  }

  onAddToShoppingCart(id, quantity)
  {
    let isInCart = false
    this.shoppingCartService.getShoppingCart().then(prods =>
      {
        if(prods.length > 0)
        {
          prods.forEach(p => {
            if(p.productId == id)
            {
              isInCart = true
              this.shoppingCartService.updateProductQuantity(id, parseInt(p.quantity + parseInt(quantity))).subscribe(() => {
                this.shoppingCartService.updateBadge()
              })
            }
          })
        }

        if(!isInCart)
        {
          this.shoppingCartService.addToCart(id, parseInt(quantity)).subscribe(() => {
            this.shoppingCartService.updateBadge()
          })
        }
      })
      this.showSnackbar = true

      setTimeout(() => {
        this.showSnackbar = false
      }, 5000)
  }
}
