import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Route {
  id: number;
  name: string;
  icon: string;
  distance: string;
  duration: string;
  coordinates: [number, number][];
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class Map implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  public isLoading = true;
  public selectedRoute: Route | null = null;

  private map: any;
  private L: any;
  private currentRouteLayer: any = null;
  private currentBorderLayer: any = null;
  private routeMarkers: any[] = [];
  private waypointMarkers: any[] = [];

  // Rotas com coordenadas detalhadas seguindo as ruas de Ouro Branco
  public routes: Route[] = [
    {
      id: 1,
      name: "Panibom (Minas Pão)",
      icon: "🍞",
      distance: "300m",
      duration: "5 min",
      coordinates: [
        // === PONTO INICIAL - CASA ===
        [-20.518407898650988, -43.693849453085896], // 🏠 Casa - ponto de partida

        // === SEGUNDO PONTO REAL ===
        [-20.51828243006344, -43.692388569554076], // 📍 Ponto 2 - esquina importante

        // === TERCEIRO PONTO REAL ===
        [-20.51755351528285, -43.692382190150006], // 📍 Ponto 3 - meio do caminho

        // === PONTO FINAL - PADARIA ===
        [-20.51693214256583, -43.692599089888354] // 🍞 Padaria do João - chegada!
      ]
    },
    {
      id: 2,
      name: "Supermercado Rotor (Centro)",
      icon: "🛒",
      distance: "1.0km",
      duration: "15 min",
      coordinates: [
        [-20.518407898650988, -43.693849453085896],

        [-20.518290560618258, -43.69236143992186],

        [-20.520308410463894, -43.691951772555605],

        [-20.5202942003467, -43.691724179574344],

        [-20.523583807316864, -43.69135244437001],

        [-20.523725905386318, -43.69103381419467],

        [-20.523896422882448, -43.69076070261716],

        [-20.52415219877043, -43.69054069606861],

        [-20.524450603413648, -43.69034344881795]
      ]
    },
    {
      id: 3,
      name: "Drogaria Vale do Aço",
      icon: "💊",
      distance: "400m",
      duration: "7 min",
      coordinates: [

        [-20.518407898650988, -43.693849453085896],

        [-20.51834984538751, -43.693504882105195],

        [-20.518278149037172, -43.69236934818089],

        [-20.5203274564811, -43.69194192810825],

        [-20.520309532628215, -43.6922226218873]
      ]
    },
    {
      id: 4,
      name: "Banco Itaú",
      icon: "🏦",
      distance: "900m",
      duration: "14 min",
      coordinates: [
        // === PONTO INICIAL - CASA ===
        [-20.518407898650988, -43.693849453085896],

        [-20.51834984538751, -43.693504882105195],

        [-20.518278149037172, -43.69236934818089],

        [-20.5203274564811, -43.69194192810825],

        [-20.52035732962225, -43.69222262187894],

        [-20.521474578721918, -43.6919929633335],

        [-20.522567921622443, -43.69200572214059],

        [-20.522998087165817, -43.69210141320163],

        [-20.523541766886837, -43.692356589364394],

        [-20.524198959575795, -43.69282228586144]
      ]
    },
    {
      id: 5,
      name: "Posto Shell",
      icon: "⛽",
      distance: "650m",
      duration: "10 min",
      coordinates: [
        [-20.518407898650988, -43.693849453085896],

        [-20.51834984538751, -43.693504882105195],

        [-20.518278149037172, -43.69236934818089],

        [-20.5203274564811, -43.69194192810825],

        [-20.52035732962225, -43.69222262187894],

        [-20.520252994528114, -43.692716059732206],

        [-20.520274309709144, -43.69307262206951],

        [-20.520103788177856, -43.69365677738806],

        [-20.519653950482216, -43.6954480264553],

        [-20.519568689394802, -43.69545181967166]
      ]
    },
    {
      id: 6,
      name: "Igreja Matriz de Santo Antônio",
      icon: "⛪",
      distance: "500m",
      duration: "8 min",
      coordinates: [
        [-20.518407898650988, -43.693849453085896],

        [-20.51834984538751, -43.693504882105195],

        [-20.518278149037172, -43.69236934818089],

        [-20.5203274564811, -43.69194192810825],

        [-20.520281908851732, -43.69173983484294],

        [-20.520594301790258, -43.691695628342536],

        [-20.520959386705712, -43.69164740306937],

        [-20.520966914220583, -43.691824229070974]
      ]
    },

    {
      id: 7,
      name: "Loterias Caixa",
      icon: "🎰",
      distance: "700m",
      duration: "11 min",
      coordinates: [
        [-20.518407898650988, -43.693849453085896],

        [-20.51834984538751, -43.693504882105195],

        [-20.518278149037172, -43.69236934818089],

        [-20.5203274564811, -43.69194192810825],

        [-20.52035732962225, -43.69222262187894],

        [-20.521474578721918, -43.6919929633335],

        [-20.522567921622443, -43.69200572214059],

        [-20.52274849418966, -43.691996986587846]
      ]
    }

  ];
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('🚗 SISTEMA DE ROTAS DETALHADAS INICIADO');
  }

  ngOnDestroy(): void {
    this.cleanupMap();
  }

  ngAfterViewInit(): void {
    console.log('🗺️ CARREGANDO MAPA COM ROTAS DETALHADAS...');
    setTimeout(() => {
      this.loadNavigationMap();
    }, 500);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  showRoute(route: Route): void {
    console.log(`🛣️ MOSTRANDO ROTA DETALHADA PARA: ${route.name} com ${route.coordinates.length} pontos`);
    this.selectedRoute = route;
    this.clearRoute();
    this.drawDetailedRoute(route);
  }

  clearRoute(): void {
    // Limpar camadas de rota
    if (this.currentRouteLayer && this.map) {
      this.map.removeLayer(this.currentRouteLayer);
      this.currentRouteLayer = null;
    }

    if (this.currentBorderLayer && this.map) {
      this.map.removeLayer(this.currentBorderLayer);
      this.currentBorderLayer = null;
    }

    // Limpar marcadores de rota
    this.routeMarkers.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    this.routeMarkers = [];

    // Limpar waypoints
    this.waypointMarkers.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    this.waypointMarkers = [];

    this.selectedRoute = null;
  }

  private cleanupMap(): void {
    if (this.map) {
      try {
        this.map.off();
        this.map.remove();
        this.map = null;
      } catch (error) {
        console.warn('Erro ao limpar mapa:', error);
      }
    }
  }

  private async loadNavigationMap(): Promise<void> {
    try {
      console.log('⚡ CARREGANDO LEAFLET...');

      if (!this.mapContainer?.nativeElement) {
        console.error('❌ Container do mapa não encontrado');
        this.isLoading = false;
        return;
      }

      const leafletModule = await import('leaflet');
      this.L = leafletModule.default || leafletModule;

      this.mapContainer.nativeElement.innerHTML = '';

      const center: [number, number] = [-20.5186, -43.6939];

      this.map = this.L.map(this.mapContainer.nativeElement, {
        center: center,
        zoom: 16, // Zoom alto para ver detalhes das ruas
        zoomControl: true,
        attributionControl: false,
        preferCanvas: true
      });

      console.log('🌙 CARREGANDO MAPA ESCURO...');

      // Usar Jawg Dark como no código original, com fallback
      try {
        const jawgToken = 'HDPO4HNZsWsgQvbaguorg2VbrTi9eF8r1F2sHBaroZYWREVtCSrnB8MGBiwHwPE0';

        this.L.tileLayer(`https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`, {
          maxZoom: 18,
          attribution: ''
        }).addTo(this.map);
      } catch (error) {
        console.warn('⚠️ Fallback para OpenStreetMap');

        this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: ''
        }).addTo(this.map);
      }

      this.map.whenReady(() => {
        console.log('🗺️ Mapa pronto!');

        setTimeout(() => {
          try {
            this.addHomeMarker();
            this.addDestinationMarkers();
            this.isLoading = false;
            console.log('✅ MAPA COM ROTAS DETALHADAS CARREGADO!');
          } catch (error) {
            console.error('❌ Erro ao adicionar marcadores:', error);
            this.isLoading = false;
          }
        }, 500);
      });

    } catch (error) {
      console.error('❌ Erro ao carregar mapa:', error);
      this.isLoading = false;
    }
  }

  private addHomeMarker(): void {
    if (!this.L || !this.map) return;

    console.log('🏠 ADICIONANDO MARCADOR DE CASA...');

    try {
      const homeIcon = this.L.divIcon({
        html: `<div style="
          background:rgb(156, 156, 156);
          border: 3px solid #fff;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        ">🏠</div>`,
        className: 'home-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      this.L.marker([-20.5186, -43.6939], { icon: homeIcon })
        .addTo(this.map)
        .bindPopup('<strong>🏠 MINHA CASA</strong><br>Ponto de partida<br>Rua das Flores, 123');

      console.log('✅ Marcador de casa adicionado');

    } catch (error) {
      console.error('❌ Erro ao adicionar marcador de casa:', error);
    }
  }

  private addDestinationMarkers(): void {
    if (!this.L || !this.map) return;

    console.log('📍 ADICIONANDO DESTINOS...');

    try {
      this.routes.forEach(route => {
        // Pegar o último ponto das coordenadas (destino final)
        const lastCoord = route.coordinates[route.coordinates.length - 1];

        const destIcon = this.L.divIcon({
          html: `<div style="
            background: #000000;
            border: 3px solid #fff;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.4);
          ">${route.icon}</div>`,
          className: 'dest-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        this.L.marker(lastCoord, { icon: destIcon })
          .addTo(this.map)
          .bindPopup(`<strong>${route.icon} ${route.name}</strong><br>📍 ${route.distance} • ⏱️ ${route.duration}<br><small>${route.coordinates.length} pontos na rota</small>`);
      });

      console.log('✅ Destinos adicionados');

    } catch (error) {
      console.error('❌ Erro ao adicionar destinos:', error);
    }
  }

  private drawDetailedRoute(route: Route): void {
    if (!this.L || !this.map) return;

    console.log(`🎨 DESENHANDO ROTA DETALHADA com ${route.coordinates.length} pontos...`);

    try {
      // IMPORTANTE: Usar TODAS as coordenadas da rota
      const allCoordinates = route.coordinates;

      console.log('📍 Coordenadas da rota:', allCoordinates);

      // Borda da rota (linha mais grossa e escura)
      this.currentBorderLayer = this.L.polyline(allCoordinates, {
        color: '#1e40af',
        weight: 8,
        opacity: 0.7,
        smoothFactor: 0.5, // Menos suavização para manter os pontos
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.map);

      // Linha principal da rota (azul brilhante)
      this.currentRouteLayer = this.L.polyline(allCoordinates, {
        color: '#3b82f6',
        weight: 5,
        opacity: 0.9,
        smoothFactor: 0.5, // Menos suavização para seguir todos os pontos
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.map);

      // Adicionar pontos intermediários (waypoints) para mostrar o caminho
      this.addDetailedWaypoints(allCoordinates);

      // Ajustar zoom para mostrar toda a rota
      const bounds = this.L.latLngBounds(allCoordinates);
      this.map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 17
      });

      // Adicionar marcadores de início e fim
      this.addRouteMarkers(route);

      // Animar a rota
      this.animateDetailedRoute();

      console.log(`✅ ROTA DETALHADA DESENHADA seguindo ${allCoordinates.length} pontos nas ruas!`);

    } catch (error) {
      console.error('❌ Erro ao desenhar rota detalhada:', error);
    }
  }

  private addDetailedWaypoints(coordinates: [number, number][]): void {
    if (!this.L || !this.map) return;

    console.log(`🔵 Adicionando waypoints para ${coordinates.length} pontos`);

    // Mostrar waypoints a cada 4-5 pontos para não poluir o mapa
    const waypointInterval = Math.max(4, Math.floor(coordinates.length / 10));

    coordinates.forEach((coord, index) => {
      // Pular o primeiro e último ponto (já têm marcadores A e B)
      if (index > 0 && index < coordinates.length - 1 && index % waypointInterval === 0) {
        const waypointIcon = this.L.circleMarker(coord, {
          radius: 3,
          fillColor: '#ffffff',
          color: '#3b82f6',
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(this.map);

        // Popup com informações do waypoint
        waypointIcon.bindPopup(`<small>📍 Ponto ${index} de ${coordinates.length}</small>`);

        this.waypointMarkers.push(waypointIcon);
      }
    });

    console.log(`✅ ${this.waypointMarkers.length} waypoints adicionados`);
  }

  private animateDetailedRoute(): void {
    if (!this.currentRouteLayer) return;

    console.log('✨ Animando rota detalhada...');

    // Efeito visual de "desenhar" a linha
    try {
      const pathElement = this.currentRouteLayer.getElement();

      if (pathElement) {
        const totalLength = pathElement.getTotalLength();

        if (totalLength > 0) {
          // Configurar animação de desenho
          pathElement.style.strokeDasharray = `${totalLength} ${totalLength}`;
          pathElement.style.strokeDashoffset = totalLength;
          pathElement.style.transition = 'stroke-dashoffset 3s ease-out';

          // Iniciar animação após um pequeno delay
          setTimeout(() => {
            pathElement.style.strokeDashoffset = '0';
          }, 200);
        }
      }
    } catch (error) {
      console.warn('⚠️ Animação não suportada neste navegador:', error);
    }
  }

  private addRouteMarkers(route: Route): void {
    if (!this.L || !this.map) return;

    try {
      // Não adicionar marcadores A e B
      // Apenas manter os waypoints que já mostram o caminho

      console.log('✅ Rota desenhada sem marcadores A/B');

    } catch (error) {
      console.error('❌ Erro ao processar marcadores de rota:', error);
    }
  }
}
