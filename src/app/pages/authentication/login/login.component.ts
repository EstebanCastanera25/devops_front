import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AdminService } from 'src/app/services/admin.service';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class AppSideLoginComponent implements OnInit {
  errorMsg: string | null = null;

  public usuario: any = {};
  public token: string = '';

  private isBrowser = false;
  loading = false;

  // si querés inputs habilitados, dejá isEnabled = false
  isEnabled = false;

  userLogin = new UntypedFormGroup({
    usuario: new UntypedFormControl(
      { value: '', disabled: this.isEnabled },
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)]
    ),
    contrasenia: new UntypedFormControl(
      { value: '', disabled: this.isEnabled },
      [Validators.required, Validators.minLength(6), Validators.maxLength(50)]
    ),
    // podrías agregar recuerdame si lo usás en la UI:
    // recuerdame: new UntypedFormControl(false)
  });

  constructor(
    private adminService: AdminService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.token = this.adminService.getToken?.() || '';
    }
  }

  ngOnInit(): void {
    // Si ya hay token, redirigí (ajustá la ruta a tu home si hace falta)
    if (this.token) {
      this.router.navigate(['/']);
    }
  }

  // Getters útiles para template (mat-error, clases, etc.)
  get f() {
    return this.userLogin.controls;
  }
  get usuarioCtrl() {
    return this.userLogin.get('usuario');
  }
  get contraseniaCtrl() {
    return this.userLogin.get('contrasenia');
  }

  login(): void {
    if (this.userLogin.invalid) {
      this.userLogin.markAllAsTouched();
      return;
    }

    const payload = {
      usuario: this.usuarioCtrl?.value,
      password: this.contraseniaCtrl?.value,
    };

    this.loading = true;
    this.errorMsg = null; 

    this.adminService
      .loginAdmin(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (resp: any) => {
          // Ajustá estos nombres a lo que devuelve tu backend
          this.usuario = resp?.data;
          console.log("this.usuario ",this.usuario )
          console.log("resp.token ",resp )
          console.log("this.isBrowser",this.isBrowser)
          if (this.isBrowser) {
            if (resp?.data?.token) localStorage.setItem('token', resp.data?.token);
            if (resp?.data?._id) localStorage.setItem('_id', resp.data._id);
          }

          // Redirige al dashboard (o a donde corresponda)
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error de login:', err.error.message);
           this.errorMsg =  err.error.message || 'No se pudo iniciar sesión. Verificá usuario y contraseña.';
        },
      });
  }
}