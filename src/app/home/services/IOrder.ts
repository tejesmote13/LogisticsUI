export interface IOrder {
    lastName: string;
    firstName: string;
    orderId: number,
    customerId: number,
    carrierId: number,
    orderDate: Date,
    pickUpDate: Date,
    status: string,
    originZipId: number,
    destinationZipId: number,
    equipmentName: string,
    carrierPrice: number,
    customerPrice: number,
}