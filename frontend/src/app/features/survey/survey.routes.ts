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
  //   {
  //     path: ':id/viewform',
  //     loadComponent: () =>
  //       import('./view-survey-form/view-survey-form.component').then(
  //         (m) => m.ViewSurveyFormComponent,
  //       ),
  //   },
  {
    path: ':id/checkout',
    loadComponent: () =>
      import('./pages/survey-checkout/survey-checkout.component').then((m) => m.SurveyCheckoutComponent),
  },
];

export default routes;
