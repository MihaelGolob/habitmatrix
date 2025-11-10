import { Component, OnInit, signal } from '@angular/core';
import { HabitGridDay } from './habit-grid-day/habit-grid-day';
import { HabitService } from '../services/habit-service';

@Component({
  selector: 'app-habit-grid',
  imports: [HabitGridDay],
  templateUrl: './habit-grid.html',
  styleUrl: './habit-grid.scss',
})
export class HabitGrid implements OnInit{
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
  loaded = signal(false);

  constructor(public habitService: HabitService) {}

  async ngOnInit() {
    await Promise.all([this.habitService.getHabitsAsync(), this.habitService.getHabitEntriesAsync()]);
    this.loaded.set(true);
  }

  getDaysForMonth(month:number) {
    var numDays = new Date(Date.UTC(2025, month, 0)).getDate()
    return Array.from({ length: numDays }, (_, i) => i + 1)
  }

  getMonthName(month:number) {
    switch(month) {
      case 1:
        return "January"
      case 2:
        return "February"
      case 3:
        return "March"
      case 4:
        return "April"
      case 5:
        return "May"
      case 6:
        return "June"
      case 7:
        return "July"
      case 8:
        return "August"
      case 9:
        return "September"
      case 10:
        return "October"
      case 11:
        return "November"
      case 12:
        return "December"
      default:
        return "Unknown"
    }
  }

   makeDate(year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month - 1, day));
  }
}
