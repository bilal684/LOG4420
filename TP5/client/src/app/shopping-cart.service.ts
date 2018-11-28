import {Injectable, EventEmitter} from '@angular/core'
import { HttpClient } from '@angular/common/http';

export class shoppingCartProduct {
    id : number
    name : string
    price : number
    quantity : number
    total : number
}

@Injectable()
export class ShoppingCartService {

    constructor(private http : HttpClient){}

    static uri = 'http://localhost:3000/api/shopping-cart'

    badgeUpdateEvent = new EventEmitter()

    updateBadge()
    {
        this.badgeUpdateEvent.emit()
    }

  /**
   * Handles the current error.
   *
   * @param error                   The error to handle.
   * @return {Promise<object>}      A promise object.
   */
    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.feedbackMessage || error);
    }

    getShoppingCart() : Promise<any> {
        return this.http.get(ShoppingCartService.uri)
        .toPromise()
        .then(prods => prods as Array<{productId : number, quantity:number}>)
        .catch(ShoppingCartService.handleError)
    }

    addToCart(productId : number, quantity : number) {
        return this.http.post(ShoppingCartService.uri, JSON.stringify({
            productId: productId,
            quantity : quantity
        }))
    }

    updateProductQuantity(productId : number, quantity : number)
    {
        return this.http.put(ShoppingCartService.uri + '/' + productId, JSON.stringify({
            quantity : quantity
        }))
    }

    removeProduct(productId : number)
    {
        return this.http.delete(ShoppingCartService.uri + '/' + productId)
    }

    removeAllProducts()
    {
        return this.http.delete(ShoppingCartService.uri)
    }

}