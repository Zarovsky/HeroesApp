import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe,Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
  img {
    width:100%;
    border-radius:5px;
  }
  `
  ]
})
export class AgregarComponent implements OnInit {

publishers = [
  {
    id: 'DC Comics',
    desc: 'DC - Comics'
  },
  {
    id: 'Marvel Comics',
    desc: 'Marvel - Comics'
  }
];

heroe: Heroe = {
  superhero:        '',
  publisher:        Publisher.DCComics,
  alter_ego:        '',
  first_appearance: '',
  characters:       '',
  alt_img:         ''
}

  constructor( private activatedRoute: ActivatedRoute,
    private servicioHeroes: HeroesService,
    private router: Router,
    private snackBar:MatSnackBar,
    private dialogo: MatDialog) { }

  ngOnInit(): void {

    if (!this.router.url.includes('editar'))
      return;

    // esto es solo si editamos
    this.activatedRoute.params
    .pipe(switchMap(({id}) => this.servicioHeroes.getHeroePorId(id)))
    .subscribe(heroe => this.heroe = heroe);

  }

  guardar() {
    if(this.heroe.superhero.trim().length === 0)
    return;

    if (this.heroe.id)
    {
      this.servicioHeroes.actualizarHeroe(this.heroe)
      .subscribe(resp => this.mostrarSnackBar('Registro actualizado'));
    } else {
    this.servicioHeroes.agregarHeroe(this.heroe)
    .subscribe(heroe => {
      this.router.navigate(['/heroes/editar', heroe.id]);
      this.mostrarSnackBar('Registro creado')
    });
    }
  }

  eliminar() {
    // usamos el dialog de material
    // de parámetro lleva un componente que creamos nosotros
    const dialog = this.dialogo.open(ConfirmarComponent, {
      width: '250px',
      // javascript todo es por referencia, con lo siguiente te aseguras de que no se va a modificar nada
      // data: {...this.heroe}
      // con esto mandas todo el objeto
      data: this.heroe
    });
    // en la variable dialog recuperamos el valor
    dialog.afterClosed().subscribe(
      (result)=> {
         this.servicioHeroes.eliminarHeroe(this.heroe.id!)
      .subscribe(resp => {this.router.navigate(['/heroes']);
      this.mostrarSnackBar('Registro eliminado!!')
    } );
      }
    );


  }

  mostrarSnackBar(mensaje:string) {
    this.snackBar.open(mensaje, 'ok!', {
      duration: 2500
    });
  }

}
