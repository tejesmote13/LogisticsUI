import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuoteOrderComponent } from './update-quote-order.component';

describe('UpdateQuoteOrderComponent', () => {
  let component: UpdateQuoteOrderComponent;
  let fixture: ComponentFixture<UpdateQuoteOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQuoteOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateQuoteOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
