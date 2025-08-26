import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anamnese } from './anamnese';

describe('Anamnese', () => {
  let component: Anamnese;
  let fixture: ComponentFixture<Anamnese>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Anamnese]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Anamnese);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
