import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetryComponent } from './cabinetry.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Route[] = [
  {
    path: '',  // Your route path
    component: CabinetryComponent,  // Component to load when the path matches
  }
];

@NgModule({
  declarations: [
    CabinetryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CabinetryModule { }
