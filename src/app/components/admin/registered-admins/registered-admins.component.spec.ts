import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredAdminsComponent } from './registered-admins.component';

describe('RegisteredAdminsComponent', () => {
  let component: RegisteredAdminsComponent;
  let fixture: ComponentFixture<RegisteredAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredAdminsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisteredAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
