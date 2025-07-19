import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cardmassagem } from './cardmassagem';

describe('Cardmassagem', () => {
  let component: Cardmassagem;
  let fixture: ComponentFixture<Cardmassagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cardmassagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cardmassagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
