import { Component } from '@angular/core';

@Component({
  selector: 'app-ordertrack',
  templateUrl: './ordertrack.component.html',
  styleUrl: './ordertrack.component.scss'
})
export class OrdertrackComponent {

  tracker: boolean = true;
 
  showTracker(){
    this.tracker = !this.tracker;
  };

  tracker2: boolean = false;
  showTracker2(){
    this.tracker2 = !this.tracker2;
  };
  tracker3: boolean = false;
  showTracker3(){
    this.tracker3 = !this.tracker3;
  }
}
