import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteActivitiesModalComponent } from './favorite-activities-modal.component';

describe('FavoriteActivitiesModalComponent', () => {
  let component: FavoriteActivitiesModalComponent;
  let fixture: ComponentFixture<FavoriteActivitiesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteActivitiesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteActivitiesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
