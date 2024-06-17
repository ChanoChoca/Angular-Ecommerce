import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //Si se tiene una escritura diferente a la anterior: setear thePageNumber a 1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    //buscar por los productos escritos en teclado
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                                       this.thePageSize,
                                                       theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    //Chequear si el id está disponible
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //Obtener id, y convertirlo a número
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      //No se encontró categoria, usamos default a 1
      this.currentCategoryId = 1;
    }

    //Comprobar si se tiene una diferente categoria que la anterior
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    //Obtener productos por id categoria
    //Componente de paginación: paginas en 1. Spring Data REST: criterio 0 pagina
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                                       this.thePageSize,
                                                       this.currentCategoryId)
                                                       .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts(); //actualizar la vista de pagina
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct.id, theProduct.name, theProduct.imageUrl, theProduct.unitPrice);

    this.cartService.addToCart(theCartItem);
  }
}
