import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, NavParams } from '@ionic/angular';
import { Pokemon } from 'src/app/models/pokemon';
import { GetstatPipe } from 'src/app/pipes/getstat.pipe';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, GetstatPipe]
})
export class DetailPokemonPage  {

  public pokemon: Pokemon;

  constructor(
    private navParams: NavParams,
    private navController: NavController
  ) {
    // Recogemos el pokemon del navParams
    this.pokemon = this.navParams.data["pokemon"];
  }

  goBack(){
    // Volvemos a list-pokemons
    this.navController.pop();
  }

}
