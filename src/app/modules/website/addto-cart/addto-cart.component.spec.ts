import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtoCartComponent } from './addto-cart.component';

describe('AddtoCartComponent', () => {
  let component: AddtoCartComponent;
  let fixture: ComponentFixture<AddtoCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddtoCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddtoCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
