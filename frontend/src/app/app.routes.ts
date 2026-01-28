import { Routes } from '@angular/router';
import { HabitGrid } from './habit-grid/habit-grid';
import { HabitsEditPage } from './components/habits-edit-page/habits-edit-page';
import { LoginPage } from './login-page/login-page';
import { SignupPage } from './signup-page/signup-page';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'home', component: HabitGrid},
    {path: 'editHabits', component: HabitsEditPage},
    {path: 'login', component: LoginPage},
    {path: 'signup', component: SignupPage},
];
