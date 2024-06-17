import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ChanoChocaFormService} from "../../services/chano-choca-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {ChanoChocaValidators} from "../../validators/chano-choca-validators";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private chanoChocaFormService: ChanoChocaFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {
  }

  ngOnInit() {

    this.reviewCartDetails();

    //Leer la dirección de correo del usuario desde almacen de navegador
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
            [Validators.required,
              Validators.minLength(2),
              ChanoChocaValidators.notOnlyWhitespace]),

        lastName: new FormControl('',
            [Validators.required,
              Validators.minLength(2),
              ChanoChocaValidators.notOnlyWhitespace]),

        email: new FormControl(theEmail,
            [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
          ChanoChocaValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
          ChanoChocaValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
          ChanoChocaValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
          ChanoChocaValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
          ChanoChocaValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
          ChanoChocaValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2),
                                          Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      })
    });

    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.chanoChocaFormService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("Retrieved credit card months: " + JSON.stringify(data));
          this.creditCardMonths = data;
        }
    );

    // populate credit card years

    this.chanoChocaFormService.getCreditCardYears().subscribe(
        data => {
          console.log("Retrieved credit card years: " + JSON.stringify(data));
          this.creditCardYears = data;
        }
    );

    // populate countries

    this.chanoChocaFormService.getCountries().subscribe(
        data => {
          console.log("Retrieved countries: " + JSON.stringify(data));
          this.countries = data;
        }
    );
  }

  reviewCartDetails() {

    //Subscribirse a cantidad y precio de carrito
    this. cartService.totalQuantity.subscribe(
        totalQuantity => this.totalQuantity = totalQuantity
    );

    this. cartService.totalPrice.subscribe(
        totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country');}

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode');}
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country');}

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode');}

  copyShippingAddressToBillingAddress(event: Event) {
    //si no funciona correctamente, agregar lo siguiente (&&) al if: (event.target as HTMLInputElement)
    if ((event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls['billingAddress']
          .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //Configurar orden
    let order = new Order(this.totalQuantity, this.totalPrice);

    const cartItems = this.cartService.cartItems;

    //Crear orderItems desde cartItems
    // let orderItems: OrderItem[] = [];
    // for (let i=0; i < cartItems.length; i++) {
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    //Manera más corta de realizar lo de arriba
    let orderItemsShort: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem.imageUrl, tempCartItem.unitPrice, tempCartItem.quantity, tempCartItem.id));

    //Configurar compra
    let purchase = new Purchase();

    //populate compra - cliente
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate compra - dirección de envio
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate compra - dirección de facturación
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate compra - orden y los items pedidos
    purchase.order = order;
    purchase.orderItems = orderItemsShort;

    //Llamar a REST API por CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          //reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );
  }

  private resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup!.value.country.code;
    const countryName = formGroup!.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.chanoChocaFormService.getStates(countryCode).subscribe(
        data => {

          if (formGroupName === 'shippingAddress') {
            this.shippingAddressStates = data;
          } else {
            this.billingAddressStates = data;
          }

          //Seleccionar el primer item por defecto
          formGroup!.get('state')!.setValue(data[0]);
        }
    );
  }
}
