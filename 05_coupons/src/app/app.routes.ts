import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'card-coupon',
    loadComponent: () => import('./pages/card-coupon/card-coupon.page').then( m => m.CardPage)
  },
  {
    path: 'coupons',
    loadComponent: () => import('./pages/coupons/coupons.page').then( m => m.CouponsPage)
  },
  {
    path: '',
    redirectTo: 'coupons',
    pathMatch: 'full'
  },
];
