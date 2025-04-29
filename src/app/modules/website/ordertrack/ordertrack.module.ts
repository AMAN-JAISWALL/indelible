import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { OrdertrackComponent } from './ordertrack.component';

const routes:Route[]=[
  {
    path:'',
    component:OrdertrackComponent
  }
]


@NgModule({
  declarations: [
    OrdertrackComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OrdertrackModule { }
