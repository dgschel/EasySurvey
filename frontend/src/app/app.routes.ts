import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewSurveyFormComponent } from './view-survey-form/view-survey-form.component';
import { StoreFormComponent } from './store-form/store-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home/:template', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'store', component: StoreFormComponent },
  { path: ':id/viewform', component: ViewSurveyFormComponent },
  { path: '**', redirectTo: '/home' }
];
