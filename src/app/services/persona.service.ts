import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private url = environment.backendBaseUrl+ '/miembros'; // Puedes inicializar directamente si no necesitas lógica adicional

  constructor( private http:HttpClient,
    private router: Router) {
    this.url 
  }

  listar_personas_filtro(filtro:any): Observable<any> {
    const token = localStorage.getItem('token') || ''; 
    const endpoint= this.url +'/listar'

    // Configura los encabezados con el token
    const headers = new HttpHeaders({'Authorization': `${token}`});
    return this.http.post<any>(endpoint,filtro,{ headers: headers})
  }

  registro_persona(data:any): Observable<any> {
    const endpoint= this.url +'/agregar'
    const token = localStorage.getItem('token') || ''; 
    // Configura los encabezados con el token
    const headers = new HttpHeaders({'Authorization': `${token}`});
    return this.http.post<any>(endpoint,data,{ headers: headers })
  }
  obtener_persona(id:any): Observable<any> {
    const token = localStorage.getItem('token') || ''; 
    const endpoint= this.url +'/obtener/'+ id;

    // Configura los encabezados con el token
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    return this.http.get<any>(endpoint,{ headers: headers })
  }

  actualizar_persona(id:any,data:any): Observable<any> {
    const token = localStorage.getItem('token') || ''; 
    const endpoint= this.url +'/actualizar/'+id
    // Configura los encabezados con el token
    const headers = new HttpHeaders({'Authorization': `${token}`});
    return this.http.put<any>(endpoint,data,{ headers: headers })
  }

  marcarComoBaja(id:any,data:any): Observable<any> {
    const token = localStorage.getItem('token') || ''; 
    const endpoint= this.url +'/marcar-baja/'+id

    // Configura los encabezados con el token
    const headers = new HttpHeaders({'Authorization': `${token}`});
    return this.http.put<any>(endpoint,data,{ headers: headers })
  }
  marcarComoAlta(id:any): Observable<any> {
    const token = localStorage.getItem('token') || ''; 
    const endpoint= this.url +'/marcar-alta/'+id
    // Configura los encabezados con el token
    const headers = new HttpHeaders({'Authorization': `${token}`});
    return this.http.put<any>(endpoint,{},{ headers: headers })
  }

  eliminar_persona(id:any): Observable<any> {
    const token = localStorage.getItem('token') || ''; 
    const endpoint= this.url +'/eliminar/'+id    

    // Configura los encabezados con el token
    const headers = new HttpHeaders({'Authorization': `${token}`});    
    return this.http.delete<any>(endpoint,{ headers: headers})
  }

  actualizarPassword_persona(id:any,data:any): Observable<any> {
    const token = localStorage.getItem('token') || ''; 
    const endpoint= this.url +'actualizarPassword_cliente_admin/'+id

    // Configura los encabezados con el token
    const headers = new HttpHeaders({'Authorization': `${token}` });
    return this.http.put<any>(endpoint,data,{ headers: headers})
  }

  exportarPersonas(): Observable<Blob> {
  const token = localStorage.getItem('token') || ''; 
  const endpoint = this.url + '/exportar';

  // Configura los encabezados con el token
  const headers = new HttpHeaders({Authorization: `${token}` });
  return this.http.get(endpoint, {headers,responseType: 'blob'});
  }
  importarPersonas(archivo: File): Observable<any> {

    const token = localStorage.getItem('token') || ''; 
    const formData = new FormData();
    const endpoint= this.url +'/importar'
    formData.append('archivo', archivo); 
    
    // Configura los encabezados con el token
    const headers = new HttpHeaders({'Authorization': `${token}`});
    return this.http.post(endpoint , formData, {headers});
  }
}


