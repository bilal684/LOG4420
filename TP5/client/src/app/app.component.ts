import { Component } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';

/**
 * Defines the main component of the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  // TODO: Modifier le nom des auteurs pour vos noms
  readonly authors = [
    'Bilal Itani',
    'Said Hmani'
  ];

  badge:number = 0;

  constructor(private shoppingCartService : ShoppingCartService){}

  ngOnInit()
  {
    this.updateCount()
    this.shoppingCartService.badgeUpdateEvent.subscribe(() => {
      this.updateCount()
    })
  }

  updateCount() {
    this.shoppingCartService.getShoppingCart().then(prods =>{
      this.badge = 0
      console.log(prods)
      if(prods.length > 0)
      {
        prods.forEach(p => {
          this.badge = this.badge + p.quantity
        })
      }
    })
  }


}
