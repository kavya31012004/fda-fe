import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRestaurantComponent } from './admin-restaurant.component';

describe('AdminRestaurantComponent', () => {
  let component: AdminRestaurantComponent;
  let fixture: ComponentFixture<AdminRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRestaurantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
