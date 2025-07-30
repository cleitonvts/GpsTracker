import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Marker } from '../models/marker';

@Injectable({
  providedIn: 'root'
})
export class Map {
  private markersSubject = new BehaviorSubject<Marker[]>([]);
  public markers$ = this.markersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Método para buscar dados do PostgreSQL (implementar quando conectar com backend)
  getMarkersFromDatabase(): Observable<Marker[]> {
    // Por enquanto, retorna dados mockados
    const mockData: Marker[] = [
      {
        id: 1,
        lat: -23.5505,
        lng: -46.6333,
        title: 'São Paulo',
        description: 'Centro de São Paulo'
      },
      {
        id: 2,
        lat: -22.9068,
        lng: -43.1729,
        title: 'Rio de Janeiro',
        description: 'Cristo Redentor'
      }
    ];

    this.markersSubject.next(mockData);
    return this.markers$;
  }

  // Método para adicionar um novo marcador
  addMarker(marker: Marker): void {
    const currentMarkers = this.markersSubject.value;
    this.markersSubject.next([...currentMarkers, marker]);
  }

  // Método para remover um marcador
  removeMarker(id: number): void {
    const currentMarkers = this.markersSubject.value;
    const filteredMarkers = currentMarkers.filter(marker => marker.id !== id);
    this.markersSubject.next(filteredMarkers);
  }

  // Método para atualizar um marcador
  updateMarker(updatedMarker: Marker): void {
    const currentMarkers = this.markersSubject.value;
    const markerIndex = currentMarkers.findIndex(marker => marker.id === updatedMarker.id);

    if (markerIndex !== -1) {
      currentMarkers[markerIndex] = updatedMarker;
      this.markersSubject.next([...currentMarkers]);
    }
  }
}