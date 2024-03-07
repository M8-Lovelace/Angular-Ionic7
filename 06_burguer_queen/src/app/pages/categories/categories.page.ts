import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { GetCategories } from 'src/app/state/categories/categories.actions';
import { CategoriesState } from 'src/app/state/categories/categories.state';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {

  @Select(CategoriesState.categories)
  private categories$: Observable<Category[]>;

  public categories: Category[];
  private subscription: Subscription;

  constructor(
    private store: Store,
    private loadingController: LoadingController,
    private translate: TranslateService,
    private navController: NavController,
    private navParams: NavParams
  ) {
    this.categories = [];
  }

  ionViewWillEnter() {
    this.subscription = new Subscription();
    this.loadData();
  }

  async loadData() {

    // Loading
    const loading = await this.loadingController.create({
      message: this.translate.instant('label.loading'),
    });

    await loading.present();

    // Obtener categorias
    this.store.dispatch(new GetCategories());
    this.categories$.subscribe({
      next: () => {
        // Obtenemos las categorias
        this.categories = this.store.selectSnapshot(CategoriesState.categories);
        console.log(this.categories);
        loading.dismiss(); // Ocultamos el loading
      }, error: (err) => {
        console.error(err);
        loading.dismiss(); // Ocultamos el loading
      }
    });

  }

  goToProducts(category: Category) {
    // guardamos el id de la categoria en navParams
    this.navParams.data['idCategory'] = category._id;
    this.navController.navigateForward('list-products')
  }

  refreshCategories($event) {
    // Refrescar categorias
    this.store.dispatch(new GetCategories());
    // Indicamos que el refresher se ha completado
    $event.target.complete();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
