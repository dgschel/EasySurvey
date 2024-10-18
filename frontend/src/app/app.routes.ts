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
    children: [
      {
        path: ':id/statistic',
        loadComponent: () =>
          import('./statistic/statistic.component').then(
            (m) => m.StatisticComponent,
          ),
      },
      {
        path: ':id/viewform',
        loadComponent: () =>
          import('./view-survey-form/view-survey-form.component').then(
            (m) => m.ViewSurveyFormComponent,
          ),
      },
      {
        path: ':id/checkout',
        loadComponent: () =>
          import('./survey-checkout/survey-checkout.component').then(
            (m) => m.SurveyCheckoutComponent,
          ),
      },
    ],
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
