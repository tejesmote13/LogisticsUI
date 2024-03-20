import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistationService } from './service/registation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana",
    "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];
  passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  phoneNumberPattern = /^(\+?1)?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/;

  registerForm!: FormGroup;

  constructor(private builder: FormBuilder, private _registerService: RegistationService, private route: Router) { }

  ngOnInit() {
    this.registerForm = this.builder.group({
      userType: [null, [Validators.required]],
      userId: ['', [Validators.required]],
      customerUserId: [''],
      carrierUserId: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      address: this.builder.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: [null, [Validators.required]]
      }),
      zipId: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(this.phoneNumberPattern)]],
    })

    if (this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      this.registerForm.disable;
    }
  }

  OnRegister() {
    const addressString = JSON.stringify(this.registerForm.value.address);
    this.registerForm.value.address = addressString;

    if (this.registerForm.value.userType == 'customer') {
      this._registerService.addCustomerDetails(this.registerForm.value).subscribe((res) => {
        const status = (res as { status: boolean }).status;
        const message = (res as { message: string }).message;
        if (status) {
          alert('You have successfully registered : ' + this.registerForm.value.userId);
          this.route.navigate(['login']);
        } else {
          alert(message);
        }
      }, (error) => { console.error('Error in request : ', error) });
    }
    else if (this.registerForm.value.userType == 'carrier') {
      this._registerService.addCarrierRegistrationDetails(this.registerForm.value).subscribe((res) => {
        const status = (res as { status: boolean }).status;
        const message = (res as { message: string }).message;
        if (status) {
          alert('You have successfully registered : ' + this.registerForm.value.userId);
          this.route.navigate(['login']);
        } else {
          alert(message);
        }
      }, (error) => { console.error('Error in request : ', error) });
    }
    else if (this.registerForm.value.userType == 'carrierRep') {
      this._registerService.addCarrierRepRegistrationDetails(this.registerForm.value).subscribe((res) => {
        const status = (res as { status: boolean }).status;
        const message = (res as { message: string }).message;
        if (status) {
          alert('You have successfully registered : ' + this.registerForm.value.userId);
          this.route.navigate(['login']);
        } else {
          alert(message);
        }
      }, (error) => { console.error('Error in request', error) });
    }
    else {
      this._registerService.addCustomerRepRegistrationDetails(this.registerForm.value).subscribe((res) => {
        const status = (res as { status: boolean }).status;
        const message = (res as { message: string }).message;
        if (status) {
          alert('You have successfully registered : ' + this.registerForm.value.userId);
          this.route.navigate(['login']);
        } else {
          alert(message);
        }
      }, (error) => { console.error('Error in request', error) });
    }
  }
}
