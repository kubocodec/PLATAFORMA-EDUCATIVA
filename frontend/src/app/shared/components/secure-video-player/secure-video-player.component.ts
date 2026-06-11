import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-secure-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-container shadow-4 border-round overflow-hidden" (contextmenu)="preventContextMenu($event)">
      <!-- Player for Local Files -->
      <video *ngIf="isLocalFile" 
             [src]="videoUrl" 
             controls 
             controlsList="nodownload" 
             class="w-full h-auto block"
             (contextmenu)="preventContextMenu($event)">
        Tu navegador no soporta el elemento de video.
      </video>

      <!-- Player for YouTube/Vimeo (iFrame) -->
      <iframe *ngIf="!isLocalFile && safeUrl" 
              [src]="safeUrl" 
              class="w-full h-30rem border-none block" 
              allowfullscreen
              (contextmenu)="preventContextMenu($event)">
      </iframe>
    </div>
  `,
  styles: [`
    .video-container {
      background: #000;
      position: relative;
    }
    
    /* Prevenir selección o arrastre */
    video, iframe {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      pointer-events: auto;
    }
  `]
})
export class SecureVideoPlayerComponent implements OnInit {
  @Input() videoUrl: string = '';
  @Input() isLocalFile: boolean = true;

  safeUrl: SafeResourceUrl | null = null;
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    if (!this.isLocalFile && this.videoUrl) {
      // Si es de youtube, sanitizar la URL para el iFrame
      let embedUrl = this.videoUrl;
      if (this.videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = this.videoUrl.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  }

  preventContextMenu(event: MouseEvent) {
    event.preventDefault(); // Desactiva el clic derecho
  }
}
