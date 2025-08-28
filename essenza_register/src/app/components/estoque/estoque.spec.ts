import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Estoque } from './estoque';

describe('Estoque', () => {
  let component: Estoque;
  let fixture: ComponentFixture<Estoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estoque ],
      imports: [ReactiveFormsModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Estoque);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
