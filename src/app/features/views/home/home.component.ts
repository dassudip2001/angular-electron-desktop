import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div
      class="flex flex-col h-screen w-screen items-center justify-center gap-4"
    >
      <h1
        class="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Discover Images Through Colors
      </h1>
      <p class="text-xl text-gray-600 text-center mb-6 max-w-2xl">
        Search and explore images using your favorite colors. Let your
        imagination guide you through a world of visual possibilities.
      </p>
      <img
        src="/ui-backend.png"
        alt="Welcome to Your Vue.js App"
        class="max-w-[50%] h-1/2"
      />
      <button
        [routerLink]="['/ui/color-select']"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-5"
      >
        Get Started
      </button>
    </div>
  `,
  styles: ``,
})
export class HomeComponent {}
