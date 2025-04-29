import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemcontentComponent } from './itemcontent.component';

describe('ItemcontentComponent', () => {
  let component: ItemcontentComponent;
  let fixture: ComponentFixture<ItemcontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemcontentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
