import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewSurveyFormComponent } from './view-survey-form/view-survey-form.component';
import { StoreFormComponent } from './store-form/store-form.component';
import { StatisticComponent } from './statistic/statistic.component';
import { StripeCheckoutSessionComponent } from './core/component/stripe-checkout-session/stripe-checkout-session.component';
import { SurveyCheckoutComponent } from './survey-checkout/survey-checkout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home/:template', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'store', component: StoreFormComponent },
  { path: 'survey/:id/statistic', component: StatisticComponent },
  { path: 'survey/:id/viewform', component: ViewSurveyFormComponent },
  { path: 'survey/:id/checkout', component: SurveyCheckoutComponent },
  { path: 'checkout/return', component: StripeCheckoutSessionComponent },
  { path: '**', redirectTo: '/home' }
];
