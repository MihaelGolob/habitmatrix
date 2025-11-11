import { Component, signal } from '@angular/core';
import { ThemeService } from '../../services/theme-service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMoon, heroSun } from '@ng-icons/heroicons/outline';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [NgIconComponent, RouterLink],
  providers: [provideIcons({heroMoon, heroSun})],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(public themeService:ThemeService) {}

  dialogOpen = signal(false);

  onDialogOpen() {
    this.dialogOpen.set(true);
  }

  onDialogClosed(selectedIds?: number[]) {
    this.dialogOpen.set(false);
  }
}
