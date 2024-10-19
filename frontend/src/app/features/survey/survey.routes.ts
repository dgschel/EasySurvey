import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  //   {
  //     path: ':id/statistic',
  //     loadComponent: () =>
  //       import('./statistic/statistic.component').then(
  //         (m) => m.StatisticComponent,
  //       ),
  //   },
  {
    path: ':id/view',
    loadComponent: () => import('./pages/survey-view/survey-view.component').then((m) => m.SurveyViewComponent),
  },
  {
    path: ':id/checkout',
    loadComponent: () =>
      import('./pages/survey-checkout/survey-checkout.component').then((m) => m.SurveyCheckoutComponent),
  },
];

export default routes;
