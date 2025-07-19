import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detalhamento } from './detalhamento';

describe('Detalhamento', () => {
  let component: Detalhamento;
  let fixture: ComponentFixture<Detalhamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detalhamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detalhamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
