import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    private tokenKey = 'logintoken';

    getToken(): string | null {
        if (typeof localStorage != 'undefined') {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }
    decodeToken() {
        const jwtHelper = new JwtHelperService();
        const token = this.getToken()!;
        return jwtHelper.decodeToken(token);
    }

    isLoggedIn() {
        const token = this.getToken();
        return !!token;
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    clearToken(): void {
        localStorage.removeItem(this.tokenKey);
    }
}
