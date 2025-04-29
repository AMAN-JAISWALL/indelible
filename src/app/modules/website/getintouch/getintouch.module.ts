import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { GetintouchComponent } from './getintouch.component';

const routes: Route[] = [
  {
    path: '',  // Your route path
    component: GetintouchComponent,  // Component to load when the path matches
  }
];

@NgModule({
  declarations: [
    GetintouchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class GetintouchModule { }
