import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Route[] = [
  {
    path: '',  // Your route path
    component: CheckoutComponent,  // Component to load when the path matches
  }
];

@NgModule({
  declarations: [
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    NgbAccordionModule,
    SharedModule,
    RouterModule.forChild(routes)

  ]
})
export class CheckoutModule { }
