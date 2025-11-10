import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { HabitModel } from '../../domain/habit-model';

@Component({
  selector: 'app-habit-day-dialog',
  imports: [],
  templateUrl: './habit-day-dialog.html',
  styleUrl: './habit-day-dialog.scss',
})
export class HabitDayDialog implements OnInit{
  date = input.required<Date>();
  habits = input.required<HabitModel[]>();
  initialSelectedHabits = input<number[]>([]);

  closed = output<number[] | undefined>();

  private selectedHabits = signal<Set<number>>(new Set<number>());
  selectedHabitsSet = this.selectedHabits.asReadonly();

  ngOnInit(): void {
    this.selectedHabits.set(new Set(this.initialSelectedHabits() ?? []));
  }

  cancel() {
    this.closed.emit(undefined);
  }

  save() {
    this.closed.emit(Array.from(this.selectedHabits()));
  }

  onBackdropClick() {
    this.cancel();
  }

  isSelected(id: number) : boolean {
    return this.selectedHabits().has(id);
  }

  toggle(id: number, checked: boolean) {
    const next = new Set(this.selectedHabits());
    checked ? next.add(id) : next.delete(id);
    this.selectedHabits.set(next);
  }
}
