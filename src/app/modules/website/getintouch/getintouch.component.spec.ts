import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetintouchComponent } from './getintouch.component';

describe('GetintouchComponent', () => {
  let component: GetintouchComponent;
  let fixture: ComponentFixture<GetintouchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetintouchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetintouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
