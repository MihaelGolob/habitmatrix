import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsEditPage } from './habits-edit-page';

describe('HabitsEditPage', () => {
  let component: HabitsEditPage;
  let fixture: ComponentFixture<HabitsEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitsEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
