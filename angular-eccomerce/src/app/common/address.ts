import {state} from "@angular/animations";

export class Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;

    constructor(street: string, city: string, state: string, country: string, zipCode: string) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipCode = zipCode;
    }
}
