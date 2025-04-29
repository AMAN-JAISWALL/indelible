import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import path from 'path';
import { ItemcontentComponent } from './itemcontent.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes:Route[]=[
  {
    path:'',
    component:ItemcontentComponent
  }
]
@NgModule({
  declarations: [
    ItemcontentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ItemcontentModule { }
