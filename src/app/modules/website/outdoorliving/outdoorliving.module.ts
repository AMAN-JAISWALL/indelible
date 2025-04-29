import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { OutdoorlivingComponent } from './outdoorliving.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Route[] = [
  {
    path: '',  // Your route path
    component: OutdoorlivingComponent,  // Component to load when the path matches
  }
];

@NgModule({
  declarations: [
    OutdoorlivingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class OutdoorlivingModule { }
