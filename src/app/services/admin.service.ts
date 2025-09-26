import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";
import { environment } from '../../environments/environment';

type Maybe<T> = T | null;

interface DecodedToken {
  sub?: string;
  email?: string;
  rol?: string;       // si tu backend usa un string único
  roles?: string[];   // o un array de roles
  permisos?: string[]; // opcional
  iat?: number;
  exp?: number;
  [k: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = environment.backendBaseUrl; // Puedes inicializar directamente si no necesitas lógica adicional
   private jwt = new JwtHelperService();
  
  constructor(private http: HttpClient) {
    this.url;
  }

  loginAdmin(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post<any>(`${this.url}/auth/login`, data,{headers});
  }

  getToken(){
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }
  getIdCreador(){
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('_id');
    }
    return null;
  }
  /** Devuelve el payload decodificado del JWT (o null si no hay / está mal) */
  getDecodedToken(): Maybe<DecodedToken> {
    const token = this.getToken();
    if (!token) return null;
    try {
      return this.jwt.decodeToken(token) as DecodedToken;
    } catch {
      return null;
    }
  }

  /** ¿Hay token y no está expirado? */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      return !this.jwt.isTokenExpired(token);
    } catch {
      return false;
    }
  }

  /** Obtiene los roles del usuario como array (soporta "rol" string o "roles[]" en el token) */
  getRoles(): string[] {
    const dec = this.getDecodedToken();
    if (!dec) return [];
    if (Array.isArray(dec.roles)) return dec.roles;
    if (typeof dec.rol === 'string' && dec.rol.trim()) return [dec.rol.trim()];
    return [];
  }

  /** Retorna true si el usuario tiene al menos 1 rol requerido */
  hasAnyRole(allowRoles: string[] = []): boolean {
    if (allowRoles.length === 0) return true; // sin restricción
    const mine = this.getRoles();
    return allowRoles.some(r => mine.includes(r));
  }
  public isAuthenticated(allowRoles:string[]):boolean{    
    if (typeof window !== 'undefined' && window.localStorage) {      
    const token: string | null  = localStorage.getItem('token');

    if(!token){
        return false;
    }
    else{
      try{
      const helper = new JwtHelperService();        
      var decodenToken = helper.decodeToken(token);
      if(!decodenToken)
      {
          return false;
        }       
  
      }catch(error){
        localStorage.removeItem('token');
        return false;
      }
    }
    return allowRoles.includes(decodenToken['rol']);
  }
  return false;
  }
}
