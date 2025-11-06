import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HabitGrid } from './habit-grid/habit-grid';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMoon, heroSun } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HabitGrid, NgIconComponent],
  providers: [provideIcons({heroMoon, heroSun})],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit{
  protected readonly title = signal('frontend');
  isDarkMode = false;
  
  ngOnInit(): void {
    this.toggleTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    document.body.classList.toggle('light-mode', !this.isDarkMode);
  }
}
