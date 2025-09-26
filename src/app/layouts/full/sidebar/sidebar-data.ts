import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  { displayName: 'Home', iconName: 'home',rolesAny: ['admin'],
    children: [{ displayName: 'Dashboard', iconName: 'layout-dashboard', route: '/dashboard', rolesAny: ['admin'] }]
  },
  { displayName: 'Miembros', iconName: 'users',rolesAny: ['admin','colaborador'],
    children: [
      { displayName: 'Miembros',         iconName: 'list',      route: '/personas/lista', rolesAny: ['admin', 'colaborador']  },
      { displayName: 'Baja de Miembros', iconName: 'user-off',  route: '/personas/lista-baja', rolesAny: ['admin']  },
    ]
  }
];