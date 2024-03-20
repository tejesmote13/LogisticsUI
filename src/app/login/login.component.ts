import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from './services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  constructor(private builder: FormBuilder, private _loginService: LoginService, private route: Router) { }

  ngOnInit() {
    this.loginForm = this.builder.group({
      userType: [null, [Validators.required]],
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })

  }
  OnSubmit() {
    this._loginService.CheckLoginDetails(this.loginForm.value).subscribe((res) => {
      if (res) {
        localStorage.setItem('logintoken', res.token);
        this.route.navigate(['dashboard']);
      } else {
        alert('Wrong user id or password')
      }
    }, (error) => {
      alert('Error in request. Please try again later!' );
    });
  }

}
