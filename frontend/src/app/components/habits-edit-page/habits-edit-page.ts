import { Component, OnInit, signal } from '@angular/core';
import { HabitService } from '../../services/habit-service';
import { FormsModule } from '@angular/forms';
import { HabitModel } from '../../domain/habit-model';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-habits-edit-page',
  imports: [FormsModule],
  templateUrl: './habits-edit-page.html',
  styleUrl: './habits-edit-page.scss',
})
export class HabitsEditPage implements OnInit {
  constructor(public habitService: HabitService) {}

  editingHabitsIds = new Set<number>();
  editedHabits = signal<HabitModel[]>([]);

  async ngOnInit() {
    await this.habitService.getHabitsAsync();
    this.editedHabits.set(this.habitService.habits().map(h => ({ ...h })));
    this.editingHabitsIds.clear();
  }

  startEdit(id: number): void {
    this.editingHabitsIds.clear();
    this.editingHabitsIds.add(id);
  }
  
  stopEdit(id: number): void {
    this.editingHabitsIds.clear();
    this.editingHabitsIds.delete(id);
  }

  save() {
    // todo: save changed habits and add new habits
  }

  addHabit() {
    let habits = this.editedHabits();
    let maxHabitId = habits.reduce((max, habit) => (habit.id > max ? habit.id : max), 0);

    habits.push({
      id: maxHabitId + 1,
      name: 'new habit',
      colorHex: '#FF0000',
      userId: environment.userId,
    });
    this.editedHabits.set(habits);
  }

  removeHabit(id : number ) {
    let habits = this.editedHabits();
    let index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
      habits.splice(index, 1);
      this.editedHabits.set(habits);
    }
  }

  cancel() {
    this.editedHabits.set(this.habitService.habits().map(h => ({ ...h })));
    this.editingHabitsIds.clear();
  }
}
