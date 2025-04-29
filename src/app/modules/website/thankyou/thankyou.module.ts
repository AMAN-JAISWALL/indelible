import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ThankyouComponent } from './thankyou.component';

const routes: Route[] = [
  {
    path: '',  // Your route path
    component: ThankyouComponent,  // Component to load when the path matches
  }
];


@NgModule({
  declarations: [
    ThankyouComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class ThankyouModule { }
