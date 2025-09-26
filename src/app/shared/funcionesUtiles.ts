import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


const Utils = {
 formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0-11
    const day = String(date.getDate()).padStart(2, '0');
    const YYYYMMDD = `${year}-${month}-${day}`;
    return YYYYMMDD;
  },
 formatDateToMMDDYYYY(dateString: string): string {
    console.log("formatDateToMMDDYYYY",dateString)
    const [year, month, day] = dateString.split('-');
    console.log("year, month, day",year, month, day)
    return `${month}/${day}/${year}`;
  },

formatearFecha(input: string | Date | null): string {
  if (!input) return '';

  let d: Date;
  if (input instanceof Date) {
    // normalizo a UTC para no “mover” el día
    d = new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getDate()));
  } else {
    const s = String(input).trim();
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); // yyyy-MM-dd (con o sin 'T...')
    d = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : new Date(s);
  }

  const fmt = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const parts = fmt.formatToParts(d);
  const dd = parts.find(p => p.type === 'day')!.value;
  const mm = parts.find(p => p.type === 'month')!.value;
  const yy = parts.find(p => p.type === 'year')!.value;
  return `${dd}-${mm}-${yy}`;
},

    formatearFechaHora(fechaISO: string): string {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false  // usa formato 24 horas
      });
    },

    normalizarHora(valor: string): string {
      if (!valor) return '';

      const partes = valor.split(':');

      let hora = partes[0]?.padStart(2, '0') || '00';

      let minutosCrudo = partes[1] ?? '';
      let minutos = '00';

      if (minutosCrudo.length === 1) {
        // Si escribe "07:3", lo interpretamos como "07:30"
        minutos = minutosCrudo + '0';
      } else if (minutosCrudo.length === 2) {
        minutos = minutosCrudo;
      } else {
        minutos = '00';
      }

      return `${hora}:${minutos}`;
    },
  //Validador para Mayúsculas
   hasUppercaseValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const hasUppercase = /[A-Z]/.test(control.value);
      return hasUppercase ? null : { 'noUppercase': { value: control.value } };
    };
  },

  //Validador para Minúsculas
   hasLowercaseValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const hasLowercase = /[a-z]/.test(control.value);
      return hasLowercase ? null : { 'noLowercase': { value: control.value } };
    };
  },

  //Validador para Caracteres Especiales solo(!@#$%&*()+)
   hasSpecialCharValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const hasSpecialChar = /[!@#$%&*()+]/.test(control.value);
      return hasSpecialChar ? null : { 'noSpecialChar': { value: control.value } };
    };
  },
 // Validador para dni empiece diferente de 0 y que sean numeros
  dniValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // Expresión regular para verificar que el valor sea solo números y no empiece con cero
    const isValid = /^[1-9][0-9]*$/.test(control.value);
    return isValid ? null : { 'invalidDNI': { value: control.value } };
  }
},
   //Validador para solo numeros
   onlyNumbersValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // Expresión regular para verificar que el valor sea solo números
      const isValid = /^[0-9]+$/.test(control.value);
      return isValid ? null : { 'invalidNumber': { value: control.value } };
    };
  },
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null; // No se puede verificar si no hay un padre
      }
  
      const password = control.parent.get('password');
      const repetirPassword = control;
  
      if (!password || !repetirPassword) {
        return null; // Retorna null si no se puede acceder a los controles
      }
  
      if (password.value !== repetirPassword.value) {
        return { noPasswordMatch: true }; // Retorna error si no coinciden
      }
  
      return null; // Retorna null si las contraseñas coinciden
    };
  },

   getPasswordError(control: AbstractControl | null, minLength: number, maxLength: number): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `La contraseña es requerida`;
    }
    if (control.hasError('minlength')) {
      return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      return `La contraseña no puede tener más de ${maxLength} caracteres`;
    }
    if (control.hasError('noUppercase')) {
      return `La contraseña debe contener al menos una letra mayúscula`;
    }
    if (control.hasError('noLowercase')) {
      return `La contraseña debe contener al menos una letra minúscula`;
    }
    if (control.hasError('noSpecialChar')) {
      return `La contraseña debe contener al menos un carácter especial: !@#$%&*()+`;
    }
    return null;
  },
   getPasswordRepeatError(control: AbstractControl | null, minLength: number, maxLength: number): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `La contraseña es requerida`;
    }    
    if (control.hasError('minlength')) {
      return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      return `La contraseña no puede tener más de ${maxLength} caracteres`;
    }
    if (control.hasError('noUppercase')) {
      return `La contraseña debe contener al menos una letra mayúscula`;
    }
    if (control.hasError('noLowercase')) {
      return `La contraseña debe contener al menos una letra minúscula`;
    }
    if (control.hasError('noSpecialChar')) {
      return `La contraseña debe contener al menos un carácter especial: !@#$%&*()+`;
    }
    if (control.hasError('noPasswordMatch')) {
      return 'No coinciden las contraseñas';
    }
    return null;
  },

   getPhoneError(control: AbstractControl | null, minLength: number, maxLength: number): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `La teléfono es requerido`;
    }
    if (control.hasError('minlength')) {
      return `El teléfono debe tener al menos ${minLength} números`;
    }
    if (control.hasError('maxlength')) {
      return `El teléfono no puede tener más de ${maxLength} números`;
    }
    if (control.hasError('invalidNumber')) {
      return `El teléfono debe contener solo números`;
    }
    return null;
  },

  getNameError(control: AbstractControl | null, minLength: number, maxLength: number): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `El nombre es requerido`;
    }
    if (control.hasError('minlength')) {
      return `El nombre debe tener al menos ${minLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      return `El nombre no puede tener más de ${maxLength} caracteres`;
    }
    return null;
  },

  getSurnameError(control: AbstractControl | null, minLength: number, maxLength: number): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `El apellido es requerido`;
    }
    if (control.hasError('minlength')) {
      return `El apellido debe tener al menos ${minLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      return `El apellido no puede tener más de ${maxLength} caracteres`;
    }
    return null;
  },
  getEmailError(control: AbstractControl | null, minLength: number, maxLength: number): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `El correo electrónico es requerido`;
    }
    if (control.hasError('minlength')) {
      return `El correo electrónico debe tener al menos ${minLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      return `El correo electrónico no puede tener más de ${maxLength} caracteres`;
    }
    if (control.hasError('email')) {
      return `No es un formato valido para un correo electrónico `;
    }
    return null;
  },
  getDniError(control: AbstractControl | null, minLength: number, maxLength: number): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `El DNI es requerido`;
    }
    if (control.hasError('minlength')) {
      return `El DNI debe tener al menos ${minLength} números`;
    }
    if (control.hasError('maxlength')) {
      return `El DNI no puede tener más de ${maxLength} números`;
    }
    if (control.hasError('invalidDni')) {
      return `El DNI debe comenzar diferente de 0`;
    }
    if (control.hasError('invalidNumber')) {
      return `El DNI debe contener solo números`;
    }
    return null;
  },
  fechaNacimientoError(control: AbstractControl | null): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `La fecha de nacimiento es requerida`;
    }
    return null;
  },
  paisError(control: AbstractControl | null): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `El país es requerido`;
    }
    return null;
  },
  generoError(control: AbstractControl | null): string | null {
    if (!control) {
      return null; // Devuelve null si el control es null
    }
    if (control.hasError('required')) {
      return `El género es requerido`;
    }
    return null;
  },


    calcularEdad(fechaNacimiento: string | Date): number {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = nacimiento.getMonth();
    const diaNacimiento = nacimiento.getDate();

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }

    return edad;
  }

 




};


// Exportar todas las funciones como un objeto
export default Utils;