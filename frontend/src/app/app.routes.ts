import { Routes } from '@angular/router';
import { HabitGrid } from './habit-grid/habit-grid';
import { HabitsEditPage } from './components/habits-edit-page/habits-edit-page';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HabitGrid},
    {path: 'editHabits', component: HabitsEditPage},
];
