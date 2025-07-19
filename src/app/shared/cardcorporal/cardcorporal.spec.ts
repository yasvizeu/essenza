import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cardcorporal } from './cardcorporal';

describe('Cardcorporal', () => {
  let component: Cardcorporal;
  let fixture: ComponentFixture<Cardcorporal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cardcorporal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cardcorporal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
