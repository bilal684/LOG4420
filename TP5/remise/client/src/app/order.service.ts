import {Injectable} from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Config} from './config'

export class JsonProduct {
    id: number;
    quantity: number;
  }
  
  export class Order  {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    products: JsonProduct[];
  }

  @Injectable()
  export class OrderService {

    constructor(private http: HttpClient) { }

    static uri = Config.apiUrl + '/orders'

    headers = new HttpHeaders({'Content-Type': 'application/json'})
    options = {headers : this.headers, withCredentials:true}

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

    createOrder(id:number, firstName:string, lastName:string, email:string, phone:string, products:JsonProduct[])
    {
        return this.http.post(OrderService.uri, JSON.stringify({
            id:id,
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone:phone,
            products:products
        }), this.options)
    }

    getAllOrders():Promise<any>{
        return this.http.get(OrderService.uri, this.options)
        .toPromise()
        .then(allOrders => allOrders as Array<Order>)
        .catch(OrderService.handleError)
    }

    getOrder(id:number):Promise<any>{
        return this.http.get(OrderService.uri + '/' + id, this.options)
        .toPromise()
        .then(order => order as Order)
        .catch(OrderService.handleError)
    }

}