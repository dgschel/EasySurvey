import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: ':template',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
      },
    ],
  },
  {
    path: 'store',
    loadComponent: () =>
      import('./store-form/store-form.component').then(
        (m) => m.StoreFormComponent,
      ),
  },
  {
    path: 'survey',
    loadChildren: () => import('./features/survey/survey.routes'), // https://v17.angular.io/guide/standalone-components#lazy-loading-many-routes-at-once
  },
  {
    path: 'checkout/return',
    loadComponent: () =>
      import(
        './core/component/stripe-checkout-session/stripe-checkout-session.component'
      ).then((m) => m.StripeCheckoutSessionComponent),
  },
  { path: '**', redirectTo: 'home' },
];
