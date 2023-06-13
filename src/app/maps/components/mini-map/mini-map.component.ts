import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from "mapbox-gl";
@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit{
  @Input()
  lngLat?:[number,number]

  @ViewChild('map')
  public divMap?: ElementRef;

  public map?: Map;

  ngAfterViewInit(): void {
    if(!this.divMap?.nativeElement) throw "Map div no found";
    if(! this.lngLat) throw "LngLat can't be null";
    const [lng,lat]=this.lngLat;
    const currentLngLat =new LngLat(lng,lat);

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: currentLngLat, // starting position [lng, lat]
      zoom: 14, // starting zoom
      interactive:false
      });

    const marker = new Marker({
      color:'red',
    }).setLngLat(currentLngLat).addTo(this.map);
  }
}
