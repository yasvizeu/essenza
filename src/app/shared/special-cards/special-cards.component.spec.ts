import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCardsComponent } from './special-cards.component';

describe('SpecialCardsComponent', () => {
  let component: SpecialCardsComponent;
  let fixture: ComponentFixture<SpecialCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
