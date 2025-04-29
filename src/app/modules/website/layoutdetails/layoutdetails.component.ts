import { Component, inject, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-layoutdetails',
  templateUrl: './layoutdetails.component.html',
  styleUrl: './layoutdetails.component.scss'
})
export class LayoutdetailsComponent {
 private modalService = inject(NgbModal);

  openVerticallyCenteredSec(newaccount: TemplateRef<any>) {
    this.modalService.open(newaccount, { centered: true, size:'xl' });
  }
  openSelectHotelSec(selectHotel: TemplateRef<any>) {
    this.modalService.open(selectHotel, { centered: true, size:'lg' });
  }
  steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
  currentStep = 0;

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  finish() {
    console.log('Stepper completed!');
  }
}
