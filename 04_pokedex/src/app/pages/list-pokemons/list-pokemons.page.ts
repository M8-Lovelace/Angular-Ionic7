import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, NavController, NavParams } from '@ionic/angular';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [PokemonService]
})
export class ListPokemonsPage implements OnInit {

  // Array donde guardaremos los pokemons recogidos
  public pokemons: Pokemon[];

  constructor(
    private pokemonService: PokemonService,
    private loadingController: LoadingController,
    private navParams: NavParams,
    private navController: NavController
  ) {
    this.pokemons = [];
  }

  ngOnInit() {
    this.morePokemon();
  }

  async morePokemon($event = null) {

    // Recogemos los pokemons
    const promise = this.pokemonService.getPokemons();

    // Si nos devuelve una promesa la procesamos
    if (promise) {

      let loading = null;
      if (!$event) {
        // Creamos un modal para indicar que esta cargando el contenido
        loading = await this.loadingController.create({
          message: 'Cargando...'
        });
        await loading.present();
      }

      // Procesamos la promesa
      promise.then((result: Pokemon[]) => {

        // Recojo los pokemons
        this.pokemons = this.pokemons.concat(result);

        // Si viene un evento del scroll infinite, le indicamos que se ha completado
        if ($event) {
          $event.target.complete();
        }

        // Si la variable loading existe, ocultamos el modal de carga
        if (loading) {
          loading.dismiss();
        }

      }).catch((err) => {

        // Si viene un evento del scroll infinite, le indicamos que se ha completado
        if ($event) {
          $event.target.complete();
        }
        // Si la variable loading existe, ocultamos el modal de carga
        if (loading) {
          loading.dismiss();
        }
      })

    }


  }

  goToDetail(pokemon: Pokemon) {
    // guardamos en navParams el pokemon a enviar
    this.navParams.data["pokemon"] = pokemon;
    // Nos redirige al detalle del pokemon
    this.navController.navigateForward("detail-pokemon")
  }

}
