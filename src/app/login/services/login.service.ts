import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }
  private url = "http://localhost:5011/api/Registration/";

  CheckLoginDetails(login: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url + 'checkLoginDetails', login, { headers: headers }).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message)
  }
}
