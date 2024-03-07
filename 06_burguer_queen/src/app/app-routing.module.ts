import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule),
    data: { showBack: false } // No mostramos la flecha de volver
  },
  {
    path: 'list-products',
    loadChildren: () => import('./pages/list-products/list-products.module').then( m => m.ListProductsPageModule),
    data: { showBack: true } // Mostramos la flecha de volver
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule),
    data: { showBack: true } // Mostramos la flecha de volver
  },
  {
    path: 'pay',
    loadChildren: () => import('./pages/pay/pay.module').then( m => m.PayPageModule),
    data: { showBack: false } // No mostramos la flecha de volver
  },
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
