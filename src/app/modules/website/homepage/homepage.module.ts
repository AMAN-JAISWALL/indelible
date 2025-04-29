import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage.component';

const routes:Route[]=[
  {
    path:'',
    component:HomepageComponent
  }
  ]

@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HomepageModule { }
