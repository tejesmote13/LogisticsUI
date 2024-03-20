import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from './services/orders.service';
import { IOrder } from './services/IOrder'
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../login/services/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userId = '';
  userType = '';
  custOrcarrUserId = '';
  orderList!: IOrder[];
  error: any;
  selectedTab = 'tab1';
  quoteForm!: FormGroup;
  quotePrice: any;
  quoteorderList!: any[];
  isDateValid!: boolean;

  constructor(private _loginService: LoginService, private _orderservice: OrdersService, private builder: FormBuilder, private route: Router) { }
  ngOnInit() {
    const decodedToken = this._loginService.decodeToken();
    if (decodedToken) {
      this.userId = decodedToken.unique_name[0];
      this.userType = decodedToken.unique_name[1];
      this.custOrcarrUserId = decodedToken.unique_name[2];
    }
    if (this.userType == "customer") {
      this.loadOrderDetails(this.userId);
      this.getQuoteOrders();
    } else if (this.userType == "customerRep") {
      this.loadOrderDetails(this.custOrcarrUserId);
    }
    else {
      this.loadCarrierOrderDetails();
    }

    this.quoteForm = this.builder.group({
      originAddress: ['', [Validators.required]],
      originZipId: ['', [Validators.required]],
      destinationAddress: ['', [Validators.required]],
      destinationZipId: ['', [Validators.required]],
      pickUpDate: ['', [Validators.required]],
      equipmentName: ['', [Validators.required]],

    });
    if (this.quoteForm.value.pickUpDate >= new Date()) {
      this.isDateValid = true;
    }
  }

  sortBy(column: string) {

  }

  changeOrderStatus(orderId: number) {
    this._orderservice.changeOrderStatus(orderId).subscribe(res => { window.location.reload(); }, err => { });
  }

  loadOrderDetails(userId: string) {
    this._orderservice.getOrderDetails(userId).subscribe((res) => {
      this.orderList = res
    }, (error) => this.error = error);
  }

  loadCarrierOrderDetails() {
    this._orderservice.getCarrierOrderDetails(this.userId).subscribe((res) => {
      this.orderList = res
    }, (error) => this.error = error);
  }

  GetQuote() {
    var totalDistance: any;
    this._orderservice.getDistanceForQuote(this.quoteForm.value.originZipId, this.quoteForm.value.destinationZipId).subscribe(
      (res) => {
        if (res) {
          totalDistance = res.distance;
          this._orderservice.getQuotePrice(this.quoteForm, totalDistance).subscribe(
            (res) => {
              if (res) {
                this.quotePrice = res;
              } else {
                alert('Unable to fetch Quote Price.')
              }
            }, (error) => { console.error('Error in request', error) });

        } else {
          alert('Unable to fetch diactance.')
        }
      }, (error) => { console.error('Error in request', error) });

  }

  getQuoteOrders() {
    this._orderservice.getQuoteOrders(this.userId).subscribe((res) => {
      this.quoteorderList = res
      console.log(this.quoteorderList);
    }, (error) => this.error = error);
  }

  createOrder() {
    this.quoteForm.value.customerPrice = this.quotePrice;
    this._orderservice.saveOrder(this.quoteForm.value).subscribe((res) => {
      alert("Your Order Number: " + res);
      this.loadOrderDetails(this.userId);
      this.selectedTab = 'tab1';
    }, (error) => { this.error = error })
  }
  createOrderFromQuote(order: any) {
    order.userId = this.userId;
    this._orderservice.saveOrder(order).subscribe((res) => {
      alert("Your Order Number: " + res);
      this.loadOrderDetails(this.userId);
      this.selectedTab = 'tab1';
    }, (error) => { this.error = error })
  }
  saveQuote() {
    this.quoteForm.value.customerPrice = this.quotePrice;
    this._orderservice.saveQuoteOrder(this.quoteForm.value).subscribe((res) => {
      alert("Your Order Number: " + res);
      this.getQuoteOrders();
      this.selectedTab = 'tab3';
    }, (error) => { this.error = error })
  }
}
