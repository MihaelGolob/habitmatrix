import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() { 
    this.toggleTheme();
  }

  toggleTheme() {
    this.isDarkMode.set(!this.isDarkMode());
    document.body.classList.toggle('dark-mode', this.isDarkMode());
    document.body.classList.toggle('light-mode', !this.isDarkMode());
  }  
}
