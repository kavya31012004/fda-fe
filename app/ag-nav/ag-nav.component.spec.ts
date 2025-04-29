import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgNavComponent } from './ag-nav.component';

describe('AgNavComponent', () => {
  let component: AgNavComponent;
  let fixture: ComponentFixture<AgNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
