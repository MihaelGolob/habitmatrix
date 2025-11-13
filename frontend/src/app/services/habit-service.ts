import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environment/environment';
import { HabitEntryModel } from '../domain/habit-entry-model';
import { HabitModel } from '../domain/habit-model';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  constructor(private http: HttpClient) {}
  url: string = environment.apiBaseUrl;
  habitEntries = signal<HabitEntryModel[]>([]);
  habits = signal<HabitModel[]>([]);

  private habitsPromise: Promise<HabitModel[]> | null = null;
  private habitEntriesPromise: Promise<HabitEntryModel[]> | null = null;

  getHabitsAsync(): Promise<HabitModel[]> {
    if (this.habits().length > 0) {
      return Promise.resolve(this.habits());
    }
    if (!this.habitsPromise) {
      this.habitsPromise = firstValueFrom(
        this.http.get<HabitModel[]>(this.url + '/GetAllHabits', { params: { userId: environment.userId } })
      ).then(data => {
        this.habits.set(data);
        return data;
      });
    }
    return this.habitsPromise;
  }

  getHabitEntriesAsync(): Promise<HabitEntryModel[]> {
    if (this.habitEntries().length > 0) {
      return Promise.resolve(this.habitEntries());
    }
    if (!this.habitEntriesPromise) {
      this.habitEntriesPromise = firstValueFrom(
        this.http.get<HabitEntryModel[]>(this.url + '/GetAllHabitEntries', { params: { userId: environment.userId } })
      ).then(data => {
        this.habitEntries.set(data);
        return data;
      });
    }
    return this.habitEntriesPromise;
  }

  async getCompletedHabitsForDayAsync(date: Date): Promise<HabitModel[]> {
    await Promise.all([this.getHabitsAsync(), this.getHabitEntriesAsync()]); // Ensures both are loaded

    const dayStr = date.toDateString();
    const entriesForDay = this.habitEntries().filter(e => new Date(e.date).toDateString() === dayStr);
    const result: HabitModel[] = [];

    for (const entry of entriesForDay) {
      const habit = this.habits().find(h => h.id === entry.habitId);
      if (habit) result.push(habit);
    }

    return result;
  }

  async removeHabitEntryAsync(habitId: number, date: Date) {
    const entry = this.habitEntries().find(e => e.habitId === habitId && new Date(e.date).toDateString() === date.toDateString());
    if (!entry?.id) return;

    await firstValueFrom(this.http.delete(this.url + '/DeleteHabitEntry', { params: { habitEntryId: entry.id } }));
    // Update local signal to avoid refetch
    this.habitEntries.update(entries => entries.filter(e => e.id !== entry.id));
  }

  async addHabitEntryAsync(habitId: number, date: Date) {
    const response = await firstValueFrom(
      this.http.post<HabitEntryModel>(this.url + '/AddHabitEntry', null, {
        params: { userId: environment.userId, habitId: habitId, date: date.toISOString() }
      })
    );
    // Update local signal to avoid refetch
    this.habitEntries.update(entries => [...entries, response]);
  }

  async addNewHabit(habit : HabitModel) {
    const url = `${this.url}/AddHabit?userId=${habit.userId}`;
    const body = {
      name: habit.name,
      colorHex: habit.colorHex
    };

    try {
      await lastValueFrom(this.http.post(url, body));
    } catch (error) {
      console.error('Error adding new habit:', error);
      throw error; 
    }
  }

  async removeHabit(habit : HabitModel) {
    try {
      await firstValueFrom(this.http.delete(this.url + '/DeleteHabit', {params: {userId: environment.userId, habitId: habit.id}}));
    } catch (error) {
      console.error('Error removing a habit: ', error);
      throw error;
    }
  }

  async editHabit(habit : HabitModel) {
    const updateUrl = `${this.url}/UpdateHabit?userId=${habit.userId}&habitId=${habit.id}`;
    const body = {
      name: habit.name,
      colorHex: habit.colorHex
    };

    try {
      await lastValueFrom(this.http.put(updateUrl, body));
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error; 
    }
  }
}