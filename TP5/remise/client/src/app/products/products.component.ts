import { Component } from '@angular/core'
import {ProductsService, Product} from '../products.service'


/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  // TODO: À compléter

  constructor(private productsService: ProductsService){}
  allProducts : Product[]
  category : string = "all"
  criteria : string = "price-asc"
  count : string;

  ngOnInit()
  {
    this.productsService.getProducts("price-asc").then(prods => {
      this.allProducts = prods
      this.count = this.allProducts.length + ""
    })
  }

  onCategoryClick(newValue:string)
  {
    this.category = newValue
    this.productsService.getProducts(this.criteria, newValue).then(prods => {
      this.allProducts = prods
      this.count = this.allProducts.length + ""
    })
  }

  onCriteriaClick(newValue:string)
  {
    this.criteria = newValue;
    this.productsService.getProducts(newValue, this.category).then(prods => {
      this.allProducts = prods;
      this.count = this.allProducts.length + ""
    })
  }
}
