import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Marker as MarkerData } from '../../models/marker';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.html',
  styleUrls: ['./marker.css']
})
export class Marker {
  @Input() markerData!: MarkerData;
  @Output() markerClick = new EventEmitter<MarkerData>();
  @Output() markerDelete = new EventEmitter<number>();

  onMarkerClick(): void {
    this.markerClick.emit(this.markerData);
  }

  onDeleteMarker(): void {
    this.markerDelete.emit(this.markerData.id);
  }
}