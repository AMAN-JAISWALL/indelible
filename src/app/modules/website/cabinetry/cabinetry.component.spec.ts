import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetryComponent } from './cabinetry.component';

describe('CabinetryComponent', () => {
  let component: CabinetryComponent;
  let fixture: ComponentFixture<CabinetryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
