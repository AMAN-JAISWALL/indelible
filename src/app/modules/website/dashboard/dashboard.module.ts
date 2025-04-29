import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartDB } from 'src/app/fack-db/chartData';
import { LocaleService, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const route:Route []=[
  {
    path:'',
    component:DashboardComponent
  }
]

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedModule,
    NgApexchartsModule,
    NgxDaterangepickerMd.forRoot()
  ],
  providers: [ChartDB, LocaleService, DatePipe],
})
export class DashboardModule { }
