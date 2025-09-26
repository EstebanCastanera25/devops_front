import { Routes } from '@angular/router';
import { ListPersonaComponent } from './list-persona/list-persona.component';
import { CreatePersonaComponent } from './create-persona/create-persona.component';
import { EditPersonaComponent } from './edit-persona/edit-persona.component';
import { ProfilePersonaComponent } from './profile-persona/profile-persona.component';
import { ListarBajaMiembrosComponent } from './listar-baja-miembros/listar-baja-miembros.component';

// ui

export const PersonaRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'crear',
        component: CreatePersonaComponent ,
      },
      {
        path: 'editar/:id',
        component: EditPersonaComponent,

      },
      {
        path: 'lista',
        component: ListPersonaComponent,
      },
      {
        path: 'perfil/:id',
        component: ProfilePersonaComponent,
      },
      {
        path: 'lista-baja',
        component: ListarBajaMiembrosComponent,
      }
    ],
  },
];
