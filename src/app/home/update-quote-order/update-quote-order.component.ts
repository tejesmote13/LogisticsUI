import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-update-quote-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-quote-order.component.html',
  styleUrl: './update-quote-order.component.css'
})
export class UpdateQuoteOrderComponent implements OnInit {
  updateQuoteOrder!: FormGroup;
  quotePrice: any;
  addressList: any[] = [];
  equipmentList: any[] = [];
  error: any;
  quoteOrderId!: number;

  constructor(private _orderservice: OrdersService, private router: Router, private builder: FormBuilder, private route: ActivatedRoute) { }
  ngOnInit() {
    this.getAddressList();
    this.getEquipmentList();

    this.updateQuoteOrder = this.builder.group({
      originZipId: ['', [Validators.required]],
      destinationZipId: ['', [Validators.required]],
      pickUpDate: ['', [Validators.required]],
      equipmentName: ['', [Validators.required]],
      pendingOrderId: ['', [Validators.required]]
    });

    this.route.params.subscribe(params => {
      this.updateQuoteOrder.setValue({
        equipmentName: params['equipmentType'],
        originZipId: params['originZipId'],
        destinationZipId: params['destinationZipId'],
        pickUpDate: params['pickUpDate'],
        pendingOrderId: params['pendingOrderId']
      })
    });

  }
  goBack() {
    window.history.back();
  }

  updateOrder() {
    this.updateQuoteOrder.value.customerPrice = this.quotePrice;
    this._orderservice.updateOrder(this.updateQuoteOrder.value).subscribe((res) => {
      alert(`Order number ${res} has been successfully updated.`);
      this.router.navigate(['dashboard']);
    }, (error) => { this.error = error; })
  }
  getAddressList() {
    this._orderservice.getAddressList().subscribe((res) => { this.addressList = res; }, (error) => { this.error = error; })
  }
  getEquipmentList() {
    this._orderservice.getEquipmentList().subscribe((res) => { this.equipmentList = res; console.log(this.equipmentList) }, (error) => { this.error = error; })
  }
  GetQuote() {
    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    const pickUpDate = formatDate(this.updateQuoteOrder.value.pickUpDate, 'yyyy-MM-dd', 'en');
    if (pickUpDate < today) {
      alert("PickUpDate is not valid. Please update order.");
    } else {
      var totalDistance: any;
      this._orderservice.getDistanceForQuote(this.updateQuoteOrder.value.originZipId, this.updateQuoteOrder.value.destinationZipId).subscribe(
        (res) => {
          if (res) {
            totalDistance = res.distance;
            this._orderservice.getQuotePrice(this.updateQuoteOrder, totalDistance).subscribe(
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
}
