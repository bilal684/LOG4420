import { Component } from '@angular/core';
import { OrderService } from 'app/order.service';
import { ShoppingCartService } from 'app/shopping-cart.service';

/**
* Defines the component responsible to manage the confirmation page.
*/
@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent {
  // TODO: À compléter

  name : string
  id : string

  constructor(private orderService:OrderService, private shoppingCartService:ShoppingCartService){}

  ngOnInit()
  {
    this.orderService.getAllOrders().then(orders => {
      if(orders.length > 0)
      {
        this.orderService.getOrder(orders.length).then(o =>{
          this.name = o.firstName + " " + o.lastName
          this.id = o.id//this.format((o.id).toString(), 5, '0')
          this.shoppingCartService.removeAllProducts().subscribe(() =>
          {
            this.shoppingCartService.updateBadge()
          })
        })
      }
    })
  }
}
