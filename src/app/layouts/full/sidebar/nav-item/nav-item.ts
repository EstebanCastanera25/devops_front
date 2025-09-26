export interface NavItem {
  displayName: string;
  iconName?: string;

  /** Navegación interna (Angular Router) */
  route?: string;

  /** Navegación externa (URL absoluta) */
  href?: string;                        // 👈 nueva
  external?: boolean;                   // 👈 nueva (opcional, podés no usarla)
  target?: '_blank' | '_self' | '_parent' | '_top'; // 👈 nueva

  /** Submenú */
  children?: NavItem[];

   // Autorización (usa el que prefieras)
  rolesAny?: string[];   // visible si el usuario tiene AL MENOS uno
  rolesAll?: string[];   // (opcional) visible si tiene TODOS
}