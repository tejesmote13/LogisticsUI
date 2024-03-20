import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistationService {
  constructor(private http: HttpClient) { }
  private url = "http://localhost:5011/api/Registration/";

  addCustomerDetails(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(data);
    return this.http.post(this.url + 'addCustomerDetails', data, { headers: headers }).pipe(catchError(this.errorHandler));
  }

  addCarrierRegistrationDetails(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var status = this.http.post(this.url + 'addCarrierRegistrationDetails', data, { headers: headers }).pipe(catchError(this.errorHandler));
    return status;
  }

  addCarrierRepRegistrationDetails(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var status = this.http.post(this.url + 'addCarrierRepRegistrationDetails', data, { headers: headers }).pipe(catchError(this.errorHandler));
    return status;
  }

  addCustomerRepRegistrationDetails(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var status = this.http.post(this.url + 'addCustomerRepRegistrationDetails', data, { headers: headers }).pipe(catchError(this.errorHandler));
    return status;
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message)
  }
}
