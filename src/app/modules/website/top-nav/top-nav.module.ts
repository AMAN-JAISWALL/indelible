import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { TopNavComponent } from './top-nav.component';

const routes:Route[]=[
{
  path:'',
  component:TopNavComponent
}
]

@NgModule({
  declarations: [
    TopNavComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class TopNavModule { }
