import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { CareerComponent } from './career.component';

const routes: Route[] = [
  {
    path: '',  // Your route path
    component: CareerComponent,  // Component to load when the path matches
  }
];

@NgModule({
  declarations: [
    CareerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CareerModule { }
