import {Component, OnInit} from '@angular/core';
import {OrderHistory} from "../../common/order-history";
import {OrderHistoryService} from "../../services/order-history.service";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {
  }

  ngOnInit() {
    this.handleOrderHistory();
  }

  handleOrderHistory() {

    //Leer la dirección de correo de usuario desde el almacen del navegador
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    //Recuperar datos desde servicio
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    );
  }
}
