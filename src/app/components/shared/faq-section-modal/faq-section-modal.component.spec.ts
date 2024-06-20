import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqSectionModalComponent } from './faq-section-modal.component';

describe('FaqSectionModalComponent', () => {
  let component: FaqSectionModalComponent;
  let fixture: ComponentFixture<FaqSectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqSectionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaqSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
