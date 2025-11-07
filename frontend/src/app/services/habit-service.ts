import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environment/environment';
import { HabitEntryModel } from '../domain/habit-entry-model';
import { HabitModel } from '../domain/habit-model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  constructor(private http: HttpClient) {}
  url:string = environment.apiBaseUrl;
  habitEntries = signal<HabitEntryModel[]>([]);
  habits = signal<HabitModel[]>([]);

  async getHabitsAsync() {
    if (this.habits.length <= 0) {
      this.habits();
    }

    const data = await firstValueFrom(this.http.get<HabitModel[]>(this.url + '/GetAllHabits', {params: {userId: environment.userId}}));
    this.habits.set(data);
    return data;
  }

  async getHabitEntriesAsync() {
    if (this.habitEntries.length <= 0) {
      this.habitEntries();
    }

    const data = await firstValueFrom(this.http.get<HabitEntryModel[]>(this.url + '/GetAllHabitEntries', {params: {userId: environment.userId}}));
    this.habitEntries.set(data);
    return data;
  }
  
  async getCompletedHabitsForDayAsync(date:Date) {
    // if (this.habitEntries.length <= 0) {
    //   await this.getHabitEntriesAsync();
    // }
    // if (this.habits.length <= 0) {
    //   await this.getHabitsAsync();
    // }
    await Promise.all([
      this.habits().length ? Promise.resolve(this.habits()) : this.getHabitsAsync(),
      this.habitEntries().length ? Promise.resolve(this.habitEntries()) : this.getHabitEntriesAsync()
    ]);

    const dayStr = date.toDateString();

    const entriesForDay = this.habitEntries().filter(e => new Date(e.date).toDateString() === dayStr);
    const result: HabitModel[] = [];

    for (const entry of entriesForDay) {
      const habit = this.habits().find(h => h.id === entry.habitId);
      if (habit) result.push(habit);
    }

    return result;
  }
}
