import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindinspirationComponent } from './findinspiration.component';

describe('FindinspirationComponent', () => {
  let component: FindinspirationComponent;
  let fixture: ComponentFixture<FindinspirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindinspirationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindinspirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
