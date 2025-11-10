import { Component, input, OnInit, signal } from '@angular/core';
import { HabitModel } from '../../domain/habit-model';
import { HabitService } from '../../services/habit-service';
import { HabitDayDialog } from '../../components/habit-day-dialog/habit-day-dialog';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-habit-grid-day',
  imports: [HabitDayDialog, AsyncPipe],
  templateUrl: './habit-grid-day.html',
  styleUrl: './habit-grid-day.scss',
})
export class HabitGridDay implements OnInit{
  completedHabits = signal<HabitModel[]>([]);
  dayDate = input.required<Date>();
  showTooltip = signal(false);
  dialogOpen = signal(false);

  constructor(public habitService: HabitService) {}

  async ngOnInit() {
    this.completedHabits.set(await this.habitService.getCompletedHabitsForDayAsync(this.dayDate()));
  }

  getHabitWidthPercentage(): string {
    return (100 / this.completedHabits().length).toString() + '%';
  }

  isToday() {
    return this.dayDate().toDateString() == new Date().toDateString();
  }

  onMouseEnter() {
    this.showTooltip.set(true);
  }

  onMouseLeave() {
    this.showTooltip.set(false);
  }

  onMouseClick() {
    this.dialogOpen.set(true);
  }

  onDialogClosed(selectedIds?: number[]) {
    this.dialogOpen.set(false);
    if (!selectedIds) return;
  }

  getCompletedHabitsIds() : number[] {
    return this.completedHabits().map(h => h.id);
  }
}
