import { TestBed } from '@angular/core/testing';

import { AdminRestaurantService } from './admin-restaurant.service';

describe('AdminRestaurantService', () => {
  let service: AdminRestaurantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRestaurantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
