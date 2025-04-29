import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteComponent } from './website.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TopNavComponent } from '../top-nav/top-nav.component';


const routes:Route[]=[
  {
    path:'',
    component:WebsiteComponent
  }
]
@NgModule({
  declarations: [
    WebsiteComponent,
    TopNavComponent
  ],
  imports: [
    CommonModule,
   RouterModule.forRoot(routes),
   SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebsiteModule { }
