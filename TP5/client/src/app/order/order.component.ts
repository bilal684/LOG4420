import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'app/shopping-cart.service';
import { Router } from '@angular/router';
import { OrderService, JsonProduct } from '../order.service';
declare const $: any;

/**
 * Defines the component responsible to manage the order page.
 */
@Component({
  selector: 'order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  orderForm: any;

  constructor(private shoppingCartService:ShoppingCartService, private route:Router, private orderService:OrderService){}

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    // Initializes the validation of the form. This is the ONLY place where jQuery usage is allowed.
    this.orderForm = $('#order-form');
    $.validator.addMethod('ccexp', function(value) {
      if (!value) {
        return false;
      }
      const regEx = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[1-9][0-9])$/g;
      return regEx.test(value);
    }, 'La date d\'expiration de votre carte de crédit est invalide.');
    this.orderForm.validate({
      rules: {
        'phone': {
          required: true,
          phoneUS: true
        },
        'credit-card': {
          required: true,
          creditcard: true
        },
        'credit-card-expiry': {
          ccexp: true
        }
      }
    });
  }

  /**
   * Submits the order form.
   */
  submit(firstName:string, lastName:string, email:string, phone:string) {
    if (!this.orderForm.valid()) {
      return;
    }
    this.shoppingCartService.getShoppingCart().then(prods => 
      {
        if(prods.length > 0)
        {
          let boughtProducts = new Array()
          prods.forEach(prod => {
            let boughtProduct = new JsonProduct()
            boughtProduct.id = prod.productId
            boughtProduct.quantity = prod.quantity
            boughtProducts.push(boughtProduct)
          })
          this.orderService.getAllOrders().then(orders => {
            this.orderService.createOrder(orders.length + 1, firstName, lastName, email, phone, boughtProducts).subscribe(() => {
              this.route.navigate(['/confirmation'])
            })
          })
        }
      })
    // TODO: Compléter la soumission des informations lorsque le formulaire soumis est valide.
  }
}
