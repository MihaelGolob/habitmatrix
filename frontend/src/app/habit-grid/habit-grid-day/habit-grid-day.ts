import { Component } from '@angular/core';
import { HabitModel } from '../../domain/habit-model';

@Component({
  selector: 'app-habit-grid-day',
  imports: [],
  templateUrl: './habit-grid-day.html',
  styleUrl: './habit-grid-day.scss',
})
export class HabitGridDay {
  completedHabits:HabitModel[] = [];
}
