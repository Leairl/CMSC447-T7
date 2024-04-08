import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme: string;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null)
   }

   initTheme() {
    this.getColorTheme();
    this.renderer.addClass(document.body, this.colorTheme)
   }

   update(theme: 'dark-mode' | 'light-mode') {
    this.setColorTheme(theme)

    const previousColorTheme = (theme === 'dark-mode' ? 'light-mode' : 'dark-mode'); /* if dark-mode changes to previous color light-mode, else dark-mode */
    this.renderer.removeClass(document.body, previousColorTheme); /* removes the color theme of where we are at */
    this.renderer.addClass(document.body, theme) /* adds to new theme */
   }

   
   isDarkMode() {
    return this.colorTheme === 'dark-mode';
   }
   private setColorTheme(theme) {
   this.colorTheme = theme;
   localStorage.setItem('user-theme', theme); /*storage cookie when user reopens browser */
   }

   private getColorTheme() { /* retrieve from local storage */
    if (localStorage.getItem('user-theme')) {
      this.colorTheme = localStorage.getItem('user-theme');
    } else {
      this.colorTheme = 'light-mode';
    }
   }
}
