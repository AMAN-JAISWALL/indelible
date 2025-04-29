import { Component, NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Route[] = [
  {
    path: '',  // Your route path
    component: RegistrationComponent,  // Component to load when the path matches
  }
];

@NgModule({
  declarations: [
   RegistrationComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  
})
export class RegistrationModule { }
