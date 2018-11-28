import {Injectable, EventEmitter} from '@angular/core'
import { Http, RequestOptions, Headers } from '@angular/http';
import {Config} from './config'

export class ShoppingCartProduct {
    id : number
    name : string
    price : number
    quantity : number
    total : number
}

@Injectable()
export class ShoppingCartService {

    constructor(private http : Http){}

    static uri = Config.apiUrl + '/shopping-cart'

    badgeUpdateEvent = new EventEmitter()

    options():RequestOptions{
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers, withCredentials: true });
        return options;
    }

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
        return Promise.reject(error.feedbackMessage || error)
    }

    getShoppingCart() : Promise<any> {
        return this.http.get(ShoppingCartService.uri, this.options())
            .toPromise()
            .then(products => products.json() as Array<{productId: number, quantity:number}>)
            .catch(ShoppingCartService.handleError);
    }

    addToCart(productId : number, quantity : number) {
        return this.http.post(ShoppingCartService.uri, JSON.stringify({
            productId: productId,
            quantity : quantity
        }), this.options())
    }

    updateProductQuantity(productId : number, quantity : number)
    {
        return this.http.put(ShoppingCartService.uri + '/' + productId, JSON.stringify({
            quantity : quantity
        }), this.options())
    }

    removeProduct(productId : number)
    {
        return this.http.delete(ShoppingCartService.uri + '/' + productId, this.options())
    }

    removeAllProducts()
    {
        return this.http.delete(ShoppingCartService.uri, this.options())
    }

}