export interface Marker {
  id: number;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type?: string;
}