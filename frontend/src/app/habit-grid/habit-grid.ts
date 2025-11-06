import { Component } from '@angular/core';
import { HabitGridDay } from './habit-grid-day/habit-grid-day';

@Component({
  selector: 'app-habit-grid',
  imports: [HabitGridDay],
  templateUrl: './habit-grid.html',
  styleUrl: './habit-grid.scss',
})
export class HabitGrid {
  months: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  getDaysForMonth(month:number) {
    var numDays = new Date(2025, month, 0).getDate()
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
}
