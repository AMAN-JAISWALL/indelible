import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutdoorlivingComponent } from './outdoorliving.component';

describe('OutdoorlivingComponent', () => {
  let component: OutdoorlivingComponent;
  let fixture: ComponentFixture<OutdoorlivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutdoorlivingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutdoorlivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
