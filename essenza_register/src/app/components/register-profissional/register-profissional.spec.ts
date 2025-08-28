import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterProfissional } from './register-profissional';

describe('RegisterProfissional', () => {
  let component: RegisterProfissional;
  let fixture: ComponentFixture<RegisterProfissional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterProfissional ],
      imports: [ReactiveFormsModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterProfissional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
