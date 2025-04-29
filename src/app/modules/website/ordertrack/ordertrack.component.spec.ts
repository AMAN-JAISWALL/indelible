import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdertrackComponent } from './ordertrack.component';

describe('OrdertrackComponent', () => {
  let component: OrdertrackComponent;
  let fixture: ComponentFixture<OrdertrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdertrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdertrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
