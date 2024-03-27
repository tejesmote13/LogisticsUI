import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrdersService } from './services/orders.service';
import { IOrder } from './services/IOrder'
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../login/services/login.service';
import { SearchPipe } from "./pipe/search.pipe";
import { SortPipe } from './pipe/sort.pipe';
import { AuthService } from '../login/services/auth.service';
import { PaginationPipe } from "./pipe/pagination.pipe";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SearchPipe, SortPipe, RouterModule, PaginationPipe]
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
  historicalOrderList!: IOrder[];
  isDateValid!: boolean;
  searchText = "";
  addressList: any[] = [];
  equipmentList: any[] = [];
  Searchcolumns = ['equipmentName', 'originAddress', 'destinationAddress']
  sortColumn!: string;
  sortOrder!: string;
  currentPage = 1;
  itemPerPage = 10;
  IsUpdateOrder = false;

  constructor(private _authService: AuthService, private _loginService: LoginService, private _orderservice: OrdersService, private builder: FormBuilder, private route: Router) { }
  ngOnInit() {
    this.quoteForm = this.builder.group({
      originZipId: ['', [Validators.required]],
      destinationZipId: ['', [Validators.required]],
      pickUpDate: ['', [Validators.required]],
      equipmentName: ['', [Validators.required]],

    });

    const decodedToken = this._authService.decodeToken();
    if (decodedToken) {
      this.userId = decodedToken.unique_name[0];
      this.userType = decodedToken.unique_name[1];
      this.custOrcarrUserId = decodedToken.unique_name[2];
    }
    if (this.userType == "customer") {
      this.loadOrderDetails(this.userId);
      this.getQuoteOrders();
      this.getAddressList();
      this.getEquipmentList();

    } else if (this.userType == "customerRep") {
      this.loadOrderDetails(this.custOrcarrUserId);
    }
    else {
      this.loadCarrierOrderDetails();
    }

  }

  sortBy(column: keyof IOrder) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  changeOrderStatus(orderId: number) {
    this._orderservice.changeOrderStatus(orderId).subscribe(res => { alert(`Order No. ${orderId} status changed.`); window.location.reload(); }, err => { });
  }

  loadOrderDetails(userId: string) {
    this._orderservice.getOrderDetails(userId).subscribe((res) => {
      this.orderList = res.filter(order => order.status === 'New' || order.status === 'InProgress');
      this.historicalOrderList = res.filter(order => order.status === 'Completed');
    }, (error) => this.error = error);
  }

  loadCarrierOrderDetails() {
    this._orderservice.getCarrierOrderDetails().subscribe((res) => {
      this.orderList = res.filter(order => order.status === 'New' || order.status === 'InProgress');
      this.historicalOrderList = res.filter(order => order.status === 'Completed');
    }, (error) => this.error = error);
  }

  GetQuote() {
    const today = new Date();
    debugger
    if (this.quoteForm.value.pickUpDate < today) {
      alert("PickUpDate is not valid. Please enter valid pickUpDate.")
    }
    else {
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
  }

  getQuoteOrders() {
    this._orderservice.getQuoteOrders(this.userId).subscribe((res) => {
      this.quoteorderList = res;
    }, (error) => this.error = error);
  }

  createOrder() {
    const today = new Date();
    if (this.quoteForm.value.pickUpDate < today) {
      alert("PickUpDate is not valid. Please enter valid pickUpDate.")
    }
    else {
      this.quoteForm.value.customerPrice = this.quotePrice;
      this.quoteForm.value.userId = this.userId;
      this._orderservice.saveOrder(this.quoteForm.value, 0).subscribe((res) => {
        alert("Your Order Number: " + res);
        this.loadOrderDetails(this.userId);
        this.selectedTab = 'tab1';
      }, (error) => { this.error = error })
    }
  }
  createOrderFromQuote(order: any) {
    const today = new Date();
    if (this.quoteForm.value.pickUpDate < today) {
      alert("PickUpDate is not valid. Please update order.")
    } else {
      order.userId = this.userId;
      this._orderservice.saveOrder(order, order.pendingOrderId).subscribe((res) => {
        alert("Your Order Number: " + res);
        this.loadOrderDetails(this.userId);
        window.location.reload();
        this.selectedTab = 'tab1';
      }, (error) => { this.error = error })
    }
  }
  saveQuote() {
    this.quoteForm.value.customerPrice = this.quotePrice;
    this.quoteForm.value.userId = this.userId;
    this._orderservice.saveQuoteOrder(this.quoteForm.value).subscribe((res) => {
      alert("Your Order Number: " + res);
      this.getQuoteOrders();
      this.selectedTab = 'tab3';
    }, (error) => { this.error = error })
  }
  updateOrderFromQuote(orderData: any) {
    this.route.navigate(['dashboard/updatequoteOrder', orderData.pendingOrderId, orderData.equipmentName, orderData.originZipId, orderData.destinationZipId, formatDate(orderData.pickUpDate, 'yyyy-MM-dd', 'en')]);
  }

  getAddressList() {
    this._orderservice.getAddressList().subscribe((res) => { this.addressList = res; }, (error) => { this.error = error; })
  }
  getEquipmentList() {
    this._orderservice.getEquipmentList().subscribe((res) => { this.equipmentList = res; console.log(this.equipmentList) }, (error) => { this.error = error; })
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  nextPage() {
    this.currentPage++;
  }
  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }
  getPageNumbers(itemsList: any[]) {
    const totalPage = Math.ceil(itemsList.length / this.itemPerPage);
    return Array(totalPage).fill(0).map((x, i) => i + 1);
  }

}
