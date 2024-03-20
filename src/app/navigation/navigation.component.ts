import { Component, OnInit } from '@angular/core';
import { RegistrationComponent } from '../registration/registration.component';
import { LoginComponent } from '../login/login.component';
import { routes } from '../app.routes';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login/services/login.service';
import { Init } from 'v8';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RegistrationComponent, LoginComponent, RouterModule, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(public _loginService:LoginService, private route:Router) {   }

  logout(){
    localStorage.removeItem('logintoken');
    this.route.navigate(['home']);
  }
}


