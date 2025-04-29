import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AboutusComponent } from './aboutus.component';

import { SharedModule } from 'src/app/theme/shared/shared.module';
const routes: Route[] = [
  {
    path: '',  // Your route path
    component: AboutusComponent,  // Component to load when the path matches
  }
];

@NgModule({
  declarations: [
    AboutusComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AboutusModule { }
