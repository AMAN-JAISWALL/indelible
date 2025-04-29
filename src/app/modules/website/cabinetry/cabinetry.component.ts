import { Component } from '@angular/core';

@Component({
  selector: 'app-cabinetry',
  templateUrl: './cabinetry.component.html',
  styleUrl: './cabinetry.component.scss'
})
export class CabinetryComponent {
  active: number = 1;  // Default active parent tab
  active1: number = 3; // Default active inner tab for "DOOR STYLE"
  active2: number = 6; // Default active inner tab for "FINISHED" (set to PAINTS)

  activateFinishedTab() {
    // Set the inner tab to "Paints" when "Finished" is activated
    this.active2 = 6;
  }
}
