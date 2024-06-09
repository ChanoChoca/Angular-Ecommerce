import {Component, OnInit} from '@angular/core';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.listCartDetails();
  }

  private listCartDetails() {

    //Obtener un manejador de items de carrito
    this.cartItems = this.cartService.cartItems;

    //Subscribirse al carrito totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //Subscribe al carrito totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //Calcular total carrito (precio y cantidad)
    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem) {
      this.cartService.addToCart(theCartItem);

  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }
}
