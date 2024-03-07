import { Pokemon } from './../models/pokemon';
import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';


@Injectable()
export class PokemonService {

  // URL a llamar
  private nextUrl: string;

  constructor() {
    this.nextUrl = 'https://pokeapi.co/api/v2/pokemon?offset=00&limit=20';
  }

  getPokemons() {

    const url = this.nextUrl;

    if (url) {

      const options = {
        url,
        headers: {},
        params: {}
      }

      // Hacemos una peticion get a la url
      return CapacitorHttp.get(options).then(async (response) => {
        // Array donde guardar los pokemons recogidos
        let pokemons: Pokemon[] = [];

        if (response.data) {

          const results = response.data.results;
          this.nextUrl = response.data.next;

          const promises: Promise<HttpResponse>[] = [];

          // Recogemos todas las promesas de cada pokemon para obtener mas informacion
          for (let index = 0; index < results.length; index++) {
            const pokemon = results[index];
            const urlPokemon = pokemon.url;
            const options = {
              url: urlPokemon,
              headers: {},
              params: {}
            }
            promises.push(CapacitorHttp.get(options));
          }

          // Ejecutamos todas las promesas y nos devuelve todos los resultados
          await Promise.all(promises).then((responses) => {

            // Recorremos los datos de cada pokemon
            for (const response of responses) {
              const pokemonData = response.data;

              const pokemonObj = new Pokemon();

              pokemonObj.id = pokemonData.order;
              pokemonObj.name = pokemonData.name;
              // Tipos
              pokemonObj.type1 = pokemonData.types[0].type.name;
              if(pokemonData.types[1]){
                pokemonObj.type2 = pokemonData.types[1].type.name;
              }
              // Sprite
              pokemonObj.sprite = pokemonData.sprites.front_default;

              // peso y altura
              pokemonObj.weight = pokemonData.weight / 10;
              pokemonObj.height = pokemonData.height / 10;
              // Stats
              pokemonObj.stats = pokemonData.stats;

              // Habilidades
              pokemonObj.abilities = pokemonData.abilities.filter(ab => !ab.is_hidden).map(ab => ab.ability.name);

              const hiddenAbility = pokemonData.abilities.find(ab => ab.is_hidden);

              if(hiddenAbility){
                pokemonObj.hiddenAbility = hiddenAbility.ability.name;
              }

              // Añadimos el pokemon al array
              pokemons.push(pokemonObj);
            }
            
          });

        }
        // Devolvemos los pokemons
        return pokemons;
      })

    }
    return null;
  }

}
