import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridViewLoader } from './grid-view-loader';

describe('GridViewLoader', () => {
  let component: GridViewLoader;
  let fixture: ComponentFixture<GridViewLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridViewLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridViewLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
