import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface NewsItem {
  id?: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  date: string;
  instagramUrl?: string;
  twitterUrl?: string;
  
}
@Component({
  selector: 'app-dashboard-inicio',
  templateUrl: './dashboard-inicio.component.html',
  styleUrl: './dashboard-inicio.component.scss'
})
export class DashboardInicioComponent  implements OnInit {
  adminMode: boolean = false;
  news: NewsItem[] = [];
  anioActual:any
  mailContacto:String ="contacto@devops.com";
  showVideo = false;
  
  // Form data for new news
  newNews: NewsItem = {
    title: '',
    description: '',
    image: '',
    alt: '',
    date: '',
    instagramUrl: '',
    twitterUrl: ''
  };

  // Social media handles
  socialMedia = {
    instagram: '@devops',
    twitter: '@devops'
  };

  constructor(private router: Router) {
    this.anioActual=new Date().getFullYear()
    
   }

   
   openVideo(ev?: Event) {
  ev?.preventDefault();
  this.showVideo = true;
}

closeVideo() {
  this.showVideo = false;
}
  ngOnInit(): void {
    this.clearSession()
    this.loadNews();
      // Revisa si ya se mostró antes
    const alreadyPlayed = localStorage.getItem('videoPlayed');
    if (!alreadyPlayed) {
      this.showVideo = true;                 // abre modal
      localStorage.setItem('videoPlayed', 'true');  // guarda flag
    }
  }
  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('_id');
  }

  toggleAdmin(): void {
    this.adminMode = !this.adminMode;
  }
ingresarAdmin() {
  this.router.navigate(['/authentication', 'login'], {
      queryParams: { redirectUrl: '/' } // opcional
    });
}
  loadNews(): void {
    // Datos de ejemplo - en producción vendría de un servicio
    this.news = [
      {
        id: 1,
        title: "Sueño púrpura en el prado",
        description: "Un árbol solitario domina un campo cubierto de flores violetas y rosadas bajo un cielo magenta etéreo. Bandadas de aves cruzan el horizonte, creando una escena onírica y calmante con una paleta monocroma de morados.",
        image: "../../../assets/actividades/actividad2.jpg",
        alt: "Sueño púrpura en el prado",
        date: "17 Oct 2025"
      },
      {
        id: 2,
        title: "Espejo del atardecer",
        description: "Un árbol solitario se refleja con simetría perfecta sobre agua inmóvil, mientras nubes rosa y azul pastel se estiran en el cielo de ocaso dorado, creando una escena serena y vibrante",
        image: "../../../assets/actividades/actividad3.jpg",
        alt: "Espejo del atardecer",
        date: "13 Jul 2025"
      },
      {
        id: 3,
        title: "Reflejo violeta",
        description: "Un árbol de copa púrpura se eleva frente a un estanque cristalino que duplica su silueta perfecta; detrás, suaves colinas floridas y un cielo limpio añaden calma y armonía a la escena.",
        image: "../../../assets/actividades/actividad1.jpg",
        alt: "Reunion de Vecinos",
        date: "Reflejo violeta"
      },
    ];
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newNews.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  publishNews(): void {
    if (this.newNews.title && this.newNews.description) {
      const newsItem: NewsItem = {
        ...this.newNews,
        id: this.news.length + 1,
        date: new Date().toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        alt: this.newNews.title
      };
      
      this.news.unshift(newsItem);
      this.resetForm();
      this.toggleAdmin();
    }
  }

  resetForm(): void {
    this.newNews = {
      title: '',
      description: '',
      image: '',
      alt: '',
      date: '',
      instagramUrl: '',
      twitterUrl: ''
    };
  }

  saveSocialMedia(): void {
    // Aquí se guardarían los cambios en el backend
    console.log('Social media updated:', this.socialMedia);
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  onImageError(event: any): void {
    event.target.src = 'https://placehold.co/600x400/cccccc/999999?text=Imagen+no+disponible';
  }
}
