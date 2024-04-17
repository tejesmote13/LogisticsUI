import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, timeout } from 'rxjs';
import { IOrder } from './IOrder';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }
  url = 'http://localhost:5011/api/Order/';

  getOrderDetails(userId: string): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.url + 'getOrdersDetails/' + userId).pipe(catchError(this.errorHandler));
  }

  getCarrierOrderDetails(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.url + 'getCarrierOrdersDetails').pipe(catchError(this.errorHandler));
  }

  getQuotePrice(quoteForm: any, distance: number) {
    const quoteData = {
      equipmentName: quoteForm.value.equipmentName,
      pickUpDate: quoteForm.value.pickUpDate,
      distance: distance
    }
    return this.http.post<any>(this.url + 'getQuotePrice', quoteData).pipe(catchError(this.errorHandler));
  }

  getQuoteOrders(userId: string): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'getQuoteOrders/' + userId).pipe(catchError(this.errorHandler));
  }

  getDistanceForQuote(originZipCode: number, destinationZipCode: Number): Observable<any> {
    var apiKey = 'js-rrKphvRPnIGgRRH4lYQBNEE4DIoJcUDjkV4AdBoCIOjnJuMKK4md2ugkiJlQT3xa';
    var apiUrl = 'https://www.zipcodeapi.com/rest/';
    const url = `${apiUrl}${apiKey}/distance.json/${originZipCode}/${destinationZipCode}/mile`;
    return this.http.get<any>(url);
  }

  saveQuoteOrder(quoteData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.url + 'saveQuoteOrder', quoteData, { headers: headers }).pipe(catchError(this.errorHandler));
  }

  saveOrder(orderData: any, pendingOrderId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.url + 'saveOrder?pendingOrderId=' + pendingOrderId, orderData, { headers: headers }).pipe(catchError(this.errorHandler));
  }

  changeOrderStatus(orderId: number): Observable<any> {
    return this.http.get<any>(this.url + 'changeOrderStatus?orderId=' + orderId).pipe(catchError(this.errorHandler));
  }

  getAddressList(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'getAddressList').pipe(catchError(this.errorHandler));
  }
  getEquipmentList(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'getEquipmentList').pipe(catchError(this.errorHandler));
  }

  updateOrder(updateOrderData: any): Observable<any> {
    return this.http.post<any>(this.url+'updateQuoteOrder', updateOrderData).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message)
  }
}
