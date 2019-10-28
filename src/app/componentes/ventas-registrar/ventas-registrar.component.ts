import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProducto, IVenta } from 'src/app/interfaces';
import { Venta } from 'src/app/entidades';
import { AccesoDatosService } from 'src/app/services/acceso-datos.service';

@Component({
  selector: 'app-ventas-registrar',
  templateUrl: './ventas-registrar.component.html',
  styleUrls: ['./ventas-registrar.component.css']
})
export class VentasRegistrarComponent implements OnInit {

  debug: any;
  loading: boolean;
  validaciones: string;

  productos: IProducto[] = [];

  ventaForm: FormGroup;

  constructor(private accesoDatosService: AccesoDatosService) { }

  ngOnInit() {

    this.loading = true;

    this.ventaForm = new FormGroup({
      selectProductos: new FormControl(''),
      inputCantidad: new FormControl('')
    });

    /*this.productos = [
      { id: 1, codigo_barra: '', nombre: 'Jeans Dama', descripcion: '', precio: 3500 },
      { id: 2, codigo_barra: '', nombre: 'Jeans Caballero', descripcion: '', precio: 3600 },
      { id: 3, codigo_barra: '', nombre: 'Camisa Dama', descripcion: '', precio: 1700 },
      { id: 4, codigo_barra: '', nombre: 'Camisa Caballero', descripcion: '', precio: 1800 },
      { id: 5, codigo_barra: '', nombre: 'Remera Dama', descripcion: '', precio: 1000 },
      { id: 6, codigo_barra: '', nombre: 'Remera Caballero', descripcion: '', precio: 1200 }
    ];*/

    this.accesoDatosService.getProductos()
    .subscribe(response => {
      console.log('getProductos()', response);
      this.productos = response;
      this.unselect();
      this.loading = false;
    });
  }

  unselect() {
    this.ventaForm.controls.selectProductos.setValue(0);
    this.ventaForm.controls.inputCantidad.setValue('');
  }

  add() {

    if (this.formValidation() === false) { return; }
    this.loading = true;

    const venta = new Venta();
    venta.usuario = 1;
    venta.producto = this.ventaForm.controls.selectProductos.value;
    venta.cantidad = this.ventaForm.controls.inputCantidad.value;
    venta.fecha = Date.now();

    console.log('CREATE', venta);
    this.accesoDatosService.postVenta(venta)
    .subscribe(response => {
      console.log('postVenta()', response);
      this.validaciones = 'venta registarda satisfactoriamente.';
      this.loading = false;
    });
  }

  formValidation(): boolean {

    this.validaciones = '';

    if (this.ventaForm.controls.selectProductos.value === '' ||  this.ventaForm.controls.selectProductos.value === 0) {
      this.validaciones += 'Falta elegir el producto.\n';
    }

    if (this.ventaForm.controls.inputCantidad.value <= 0) {
      this.validaciones += 'Falta completar la cantidad.\n';
    }
    if (this.ventaForm.controls.inputCantidad.value > 9999) {
      this.validaciones += 'Cantidad inválida. Máximo $9999.\n';
    }
    if (this.ventaForm.controls.inputCantidad.value % 1 !== 0) {
      this.validaciones += 'Cantidad inválida. Ingrese un número entero.\n';
    }

    return (this.validaciones === '') ? true : false;
  }
}
