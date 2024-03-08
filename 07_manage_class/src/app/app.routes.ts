import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'list-students',
    loadComponent: () => import('./pages/students/list-students/list-students.component').then( m => m.ListStudentsComponent)
  },
  {
    path: 'form-student',
    loadComponent: () => import('./pages/students/form-student/form-student.component').then( m => m.FormStudentComponent)
  },
  {
    path: 'list-payment',
    loadComponent: () => import('./pages/payment/list-payments/list-payments.component').then( m => m.ListPaymentsComponent)
  },
  {
    path: 'list-classes',
    loadComponent: () => import('./pages/classes/list-classes/list-classes.component').then( m => m.ListClassesComponent)
  },
  {
    path: 'form-classes',
    loadComponent: () => import('./pages/classes/form-classes/form-classes.component').then( m => m.FormClassesComponent)
  },
];
