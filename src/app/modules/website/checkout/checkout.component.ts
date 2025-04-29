import { Component, inject, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private modalService = inject(NgbModal);

  openAddHotel(addhotel: TemplateRef<any>) {
    this.modalService.open(addhotel, { centered: true, size:'lg' });
  }
  openSendEmail(sendemail: TemplateRef<any>) {
    this.modalService.open(sendemail, { centered: true, size:'lg' });
  }
}
