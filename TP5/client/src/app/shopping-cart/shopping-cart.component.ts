import { Component } from '@angular/core';
import { ProductsService } from '../products.service';
import { ShoppingCartService, ShoppingCartProduct} from '../shopping-cart.service';

/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent {
  // TODO: À compléter

  prods : Array<ShoppingCartProduct>
  total : number = 0;

  constructor(private productsService : ProductsService, private shoppingCartService : ShoppingCartService){}

  ngOnInit() {
    var cart = new Array<ShoppingCartProduct>();

    this.productsService.getProducts("alpha-asc").then(allProds => {
      this.shoppingCartService.getShoppingCart().then(cartProds => {
        if(cartProds.length > 0)
        {
          allProds.forEach(prod => {
            cartProds.forEach(item => {
              if(prod.id == item.productId)
              {
                let cartProduct = new ShoppingCartProduct();
                cartProduct.id = prod.id
                cartProduct.name = prod.name
                cartProduct.price = prod.price
                cartProduct.quantity = item.quantity
                cartProduct.total = cartProduct.quantity * cartProduct.price
                cart.push(cartProduct)
                this.total += cartProduct.total
              }
            })
          })
          this.prods = cart
        }
        else
        {
          this.prods = undefined
        }
      })
    })
  }

  onProductAdd(product : ShoppingCartProduct)
  {
    this.prods.forEach(prod =>
      {
        if(prod.id == product.id)
        {
          prod.quantity += 1
          prod.total += prod.price
          this.total += prod.price
          this.shoppingCartService.updateProductQuantity(prod.id, prod.quantity).subscribe(() =>
          {
            this.shoppingCartService.updateBadge()
          })
        }
      })
  }

  onProductSubstract(product : ShoppingCartProduct)
  {
    this.prods.forEach(prod =>
      {
        if(prod.id == product.id)
        {
          prod.quantity -= 1
          prod.total -= prod.price
          this.total -= prod.price
          this.shoppingCartService.updateProductQuantity(prod.id, prod.quantity).subscribe(() =>
          {
            this.shoppingCartService.updateBadge()
          })
        }
      })
  }

  onProductRemove(product : ShoppingCartProduct)
  {
    if(confirm("Voulez-vous supprimer le produit du panier?"))
    {
      this.total -= product.total
      let productIndex = this.prods.indexOf(product)
      this.prods.splice(productIndex, 1)
      this.shoppingCartService.removeProduct(product.id).subscribe(() =>
      {
        this.shoppingCartService.updateBadge()
      })
      
      if(this.prods.length < 1)
      {
        this.prods = undefined
      }
    }
  }

  onAllProductRemoval()
  {
    if(confirm("Voulez-vous supprimer tous les produits du panier?"))
    {
      this.prods = undefined
      this.shoppingCartService.removeAllProducts().subscribe(() => {
        this.shoppingCartService.updateBadge()
      })
    }
  }


}
