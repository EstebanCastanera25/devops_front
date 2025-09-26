import { NgModule } from '@angular/core';
import { RouterModule, Routes,PreloadAllModules  } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import {  roleGuardCanMatch } from './guards/admin.guard';
import { DashboardInicioComponent } from './layouts/dashboard-inicio/dashboard-inicio.component';

const routes: Routes = [  
  { path: '', component: DashboardInicioComponent },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
        canMatch: [roleGuardCanMatch],
        data: { roles: ['admin', 'colaborador','contactar','evento'] } 
      },
      {
        path: 'personas',
        loadChildren: () =>
          import('./pages/persona/persona.module').then((m) => m.PersonaModule),
        canMatch: [roleGuardCanMatch],
        data: { roles: ['admin', 'colaborador'] } 
      }
    ],
  },
  {
    path: 'authentication',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
