import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { this.decodeToken(); }
  private url = "http://localhost:5011/api/Registration/";
  private tokenKey = 'logintoken';

  CheckLoginDetails(login: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url + 'checkLoginDetails', login, { headers: headers }).pipe(catchError(this.errorHandler));
  }

  getToken(): string | null {
    if (typeof localStorage != 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message)
  }
}
