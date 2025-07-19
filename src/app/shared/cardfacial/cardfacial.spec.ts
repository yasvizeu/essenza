import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cardfacial } from './cardfacial';

describe('Cardfacial', () => {
  let component: Cardfacial;
  let fixture: ComponentFixture<Cardfacial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cardfacial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cardfacial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
