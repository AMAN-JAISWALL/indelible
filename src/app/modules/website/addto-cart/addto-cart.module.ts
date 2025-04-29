import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AddtoCartComponent } from './addto-cart.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Route[] = [
  {
    path: '',  // Your route path
    component: AddtoCartComponent,  // Component to load when the path matches
  }
];

@NgModule({
  declarations: [
    AddtoCartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AddtoCartModule { }
