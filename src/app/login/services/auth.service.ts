import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginComponent } from '../login.component';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private router: Router, private _loginService: LoginService) { }
    canActivate(): boolean {
        if (this._loginService.isLoggedIn()) {
            return true;
        } else {
            alert("Please Login First.");
            this.router.navigate(['/login']);
            return false;
        }
    }
}
