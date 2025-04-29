import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutdetailsComponent } from './layoutdetails.component';

describe('LayoutdetailsComponent', () => {
  let component: LayoutdetailsComponent;
  let fixture: ComponentFixture<LayoutdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
