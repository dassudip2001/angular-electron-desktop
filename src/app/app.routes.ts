import { Routes } from '@angular/router';
import { HomeComponent } from './features/views/home/home.component';
import { ColorSelectComponent } from './features/views/color-select/color-select.component';
import { OutputComponent } from './features/views/output/output.component';
import { CommonComponent } from './shared/common/common.component';

export const routes: Routes = [
  {
    path: 'ui',
    component: CommonComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'color-select',
        component: ColorSelectComponent,
      },
      {
        path: 'output',
        component: OutputComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'ui/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'ui/home',
    pathMatch: 'full',
  },
];
