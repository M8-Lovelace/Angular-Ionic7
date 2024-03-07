import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'list-pokemons',
    loadComponent: () => import('./pages/list-pokemons/list-pokemons.page').then(m => m.ListPokemonsPage)
  },
  {
    path: 'detail-pokemon',
    loadComponent: () => import('./pages/detail-pokemon/detail-pokemon.page').then(m => m.DetailPokemonPage)
  },
  {
    path: '',
    redirectTo: 'list-pokemons',
    pathMatch: 'full'
  },
];
