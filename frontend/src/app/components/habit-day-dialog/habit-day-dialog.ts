import { Component, input, output, signal } from '@angular/core';
import { HabitModel } from '../../domain/habit-model';

@Component({
  selector: 'app-habit-day-dialog',
  imports: [],
  templateUrl: './habit-day-dialog.html',
  styleUrl: './habit-day-dialog.scss',
})
export class HabitDayDialog {
  date = input.required<Date>();
  habits = input.required<HabitModel[]>();
  selectedIds = input<number[]>([]);

  closed = output<number[] | undefined>();

  private selectedSet = signal<Set<number>>(new Set(this.selectedIds() ?? []));

  ngOnChanges() {
    this.selectedSet.set(new Set(this.selectedIds() ?? []));
  }

  cancel() {
    this.closed.emit(undefined);
  }

  save() {
    this.closed.emit(Array.from(this.selectedSet()));
  }

  onBackdropClick() {
    this.cancel();
  }

  isSelected(id: number) : boolean {
    return this.selectedIds().includes(id);
  }

  toggle(id: number, checked: boolean) {
    const next = new Set(this.selectedSet());
    checked ? next.add(id) : next.delete(id);
    this.selectedSet.set(next);
  }
}
