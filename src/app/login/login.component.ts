import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from './services/login.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  constructor(private builder: FormBuilder, public _loginService: LoginService, public _authService: AuthService, private route: Router) { }

  ngOnInit() {
    this.loginForm = this.builder.group({
      userType: [null, [Validators.required]],
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })

  }
  OnSubmit() {
    this._loginService.CheckLoginDetails(this.loginForm.value).subscribe((res) => {
      const status = (res as { status: boolean }).status;
      const message = (res as { token: string }).token;
      if (status) {
        this._authService.setToken(res.token);
        this.route.navigate(['dashboard']);
      } else {
        alert(message);
      }
    }, (error) => {
      alert('Error in request. Please try again later!');
    });
  }

}
