import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import OktaAuth from "@okta/okta-auth-js";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
  }

  ngOnInit() {

    //Subscribirse a los cambios de estado de autenticación
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if (this.isAuthenticated) {

      //Obtener detalles de usuario autenticado

      //El nombre de usuario está expuesto como name de propiedad
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;

          //Recuperar el email del usaurio desde la autenticación
          const theEmail = res.email;

          //Almacenar el email en el almacen del navegador
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
        }
      );
    }
  }

  logout() {
    //Terminar sesión con Okta y remover el token actual
    this.oktaAuth.signOut();
  }
}
