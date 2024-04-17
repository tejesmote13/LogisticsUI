import { Component, OnInit } from '@angular/core';
import { RegistrationComponent } from '../registration/registration.component';
import { LoginComponent } from '../login/login.component';
import { routes } from '../app.routes';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login/services/login.service';
import { Init } from 'v8';
import { AuthService } from '../login/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RegistrationComponent, LoginComponent, RouterModule, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  userId!: string;
  constructor(public _authService: AuthService, private route: Router) { }

  logout() {
    this._authService.clearToken();
    this.route.navigate(['home']);
  }

}


