import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('staticMapContainer', { static: false }) staticMapContainer!: ElementRef;

  private staticMap: any;
  private L: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('🏠 HOME - OURO BRANCO MG CENTRALIZADO');
  }

  ngAfterViewInit(): void {
    console.log('🗺️ CENTRALIZANDO OURO BRANCO-MG NO MAPA...');
    this.loadCenteredMap();
  }

  ngOnDestroy(): void {
    if (this.staticMap) {
      this.staticMap.off();
      this.staticMap.remove();
    }
  }

  onLocalizarClick(): void {
    this.router.navigate(['/map']);
  }

  private async loadCenteredMap(): Promise<void> {
    try {
      console.log('🎯 CARREGANDO MAPA CENTRADO EM OURO BRANCO...');

      const leafletModule = await import('leaflet');
      this.L = leafletModule.default || leafletModule;

      if (!this.staticMapContainer) {
        console.error('❌ Container do mapa estático não encontrado');
        return;
      }

      // Coordenadas ajustadas para centralizar o nome da cidade no topo
      const ouroBrancoAdjusted: [number, number] = [-20.5269, -43.6966];

      this.staticMap = this.L.map(this.staticMapContainer.nativeElement, {
        center: ouroBrancoAdjusted,
        zoom: 14.5,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false,
        preferCanvas: true,
        renderer: this.L.canvas(),
        fadeAnimation: false,
        zoomAnimation: false,
        markerZoomAnimation: false
      });

      // STADIA Stamen Toner Lite
      console.log('🗺️ CARREGANDO STADIA - STAMEN TONER LITE...');
      this.L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, ' +
                     '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>, ' +
                     '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(this.staticMap);

      setTimeout(() => {
        if (this.staticMap) {
          this.staticMap.invalidateSize();
          console.log('📍 MAPA CENTRALIZADO - NOME DA CIDADE NO TOPO');
        }
      }, 1000);

      console.log('✅ OURO BRANCO-MG CENTRALIZADO COM ZOOM ALTO!');

    } catch (error) {
      console.error('❌ Erro carregando mapa centralizado:', error);
    }
  }
}
