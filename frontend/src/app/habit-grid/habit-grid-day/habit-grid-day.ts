import { Component, input, OnInit, signal } from '@angular/core';
import { HabitModel } from '../../domain/habit-model';
import { HabitService } from '../../services/habit-service';

@Component({
  selector: 'app-habit-grid-day',
  imports: [],
  templateUrl: './habit-grid-day.html',
  styleUrl: './habit-grid-day.scss',
})
export class HabitGridDay implements OnInit{
  completedHabits = signal<HabitModel[]>([]);
  dayDate = input.required<Date>();

  constructor(private habitService: HabitService) {}

  async ngOnInit() {
    this.completedHabits.set(await this.habitService.getCompletedHabitsForDayAsync(this.dayDate()));
  }

  getHabitWidhtPercentage(): string {
    return (100 / this.completedHabits().length).toString() + '%';
  }
}
