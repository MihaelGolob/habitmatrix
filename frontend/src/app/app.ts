import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HabitGrid } from './habit-grid/habit-grid';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMoon, heroSun } from '@ng-icons/heroicons/outline';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App{
}
