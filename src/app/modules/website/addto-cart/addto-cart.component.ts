import { Component, inject, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-addto-cart',
  templateUrl: './addto-cart.component.html',
  styleUrl: './addto-cart.component.scss'
})
export class AddtoCartComponent {
  private modalService = inject(NgbModal);
  openVerticallyCenteredSec(newaccount: TemplateRef<any>) {
    this.modalService.open(newaccount, { centered: true, size:'lg' });
  }

}
