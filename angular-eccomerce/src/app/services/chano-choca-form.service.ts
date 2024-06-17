import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import { map } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {Country} from "../common/country";
import {State} from "../common/state";

@Injectable({
  providedIn: 'root'
})
export class ChanoChocaFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
        map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]> {

    //search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
        map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    //Construir array 'Month', esto va hacer una lista con despliegue
    //Comienza desde el mes actual hasta el mes 12
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    //Envuelve el objeto como un Observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    //Construir array 'Year', ...
    //Desde año actual hasta 10 años más
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
