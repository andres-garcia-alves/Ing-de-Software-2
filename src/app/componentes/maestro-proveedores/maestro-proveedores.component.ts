import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProveedor } from 'src/app/interfaces';
import { Proveedor } from 'src/app/entidades';
import { AccesoDatosService } from 'src/app/services/acceso-datos.service';

@Component({
  selector: 'app-maestro-proveedores',
  templateUrl: './maestro-proveedores.component.html',
  styleUrls: ['./maestro-proveedores.component.css']
})
export class MaestroProveedoresComponent implements OnInit {

  loading: boolean;
  validaciones: string;

  proveedores: IProveedor[];
  seleccionado: IProveedor = new Proveedor();

  constructor(private accesoDatosService: AccesoDatosService) { }

  ngOnInit() {
    this.loading = true;
    this.accesoDatosService.getProveedores()
      .subscribe(result => {
        // this.proveedores = result; // TODO: update desde back-end
        this.loading = false;
    });

    this.proveedores = [ // TODO: comentar
      { id: 1, nombre: 'Levis' },
      { id: 2, nombre: 'Wrangler' },
      { id: 3, nombre: '42 Street' },
      { id: 4, nombre: 'Chocolate' },
      { id: 5, nombre: 'Akiabara' },
      { id: 6, nombre: 'Solido' }
    ];
  }

  select(proveedor: IProveedor) {
    this.seleccionado = proveedor;
  }

  unselect() {
    this.seleccionado = new Proveedor();
  }

  addOrEdit() {

    if (this.formValidations() === false) { return; }
    this.loading = true;

    if (this.seleccionado.id === 0) { // nuevo

      console.log('new');
      const aux: IProveedor = this.seleccionado;
      this.proveedores.push(this.seleccionado);

      this.accesoDatosService.postProveedor(this.seleccionado)
        .subscribe(result => {
          // aux.id = result; // // TODO: update desde back-end
          aux.id = Math.max.apply(Math, this.proveedores.map(x => x.id)) + 1; // TODO: comentar
          this.loading = false;
      });
      // console.log(this.proveedores);

    } else { // update

      console.log('update');
      this.accesoDatosService.putProveedor(this.seleccionado)
        .subscribe(result => { this.loading = false; });
      // console.log(this.proveedores);
    }

    this.seleccionado = new Proveedor();
  }

  delete() {

    if (confirm('Está seguro que desea borrarlo?')) {
      this.loading = true;
      const id = this.seleccionado.id;

      this.accesoDatosService.deleteProveedor(id)
        .subscribe(result => { this.loading = false; });

      this.proveedores = this.proveedores.filter(x => x !== this.seleccionado);
      this.seleccionado = new Proveedor();
    }
  }

  formValidations(): boolean {

    this.validaciones = '';

    if (this.seleccionado.nombre === '') {
      this.validaciones += 'Falta completar el nombre.\n';
    }

    if (this.seleccionado.nombre.length > 30) {
      this.validaciones += 'La longitud máxima del texto es 30 carácteres.\n';
    }

    return (this.validaciones === '') ? true : false;
  }
}
