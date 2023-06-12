import { AfterViewInit, Component, ElementRef, ViewChild,OnDestroy} from '@angular/core';
import { LngLat, Map, Marker } from "mapbox-gl";

interface MarkerAndColor{
  color:string;
  marker:Marker;
}

interface PlainMarker{
  color:string;
  lngLat:number[];
}
@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit {

  @ViewChild('map')
  public divMap?: ElementRef;

  public markers:MarkerAndColor[]=[];
  public map?: Map;
  public currentLngLat:LngLat = new LngLat(-103.64052026520027, 19.98917473097869);

  ngAfterViewInit(): void {
    if(!this.divMap)return;

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 14 // starting zoom
      });
      this.readToLocalStorange();
      this.map.on('click',({lngLat})=>{
        const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
        this.addMarker(lngLat,color);
      })
      // const markerHtml=document.createElement('div');
      // markerHtml.textContent ='Pueblo A';
      // const marker = new Marker({
      //   //color:'red',
      //   element:markerHtml

      // }).setLngLat(this.currentLngLat).addTo(this.map);
  }

  createMarker(){
    if(!this.map)return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const LngLat = this.map.getCenter();
    this.addMarker(LngLat,color);
  }
  addMarker(lngLat:LngLat,color:string){
    if(!this.map)return;
    const marker = new Marker({
      color,
      draggable:true
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({color,marker});
    this.saveToLocalStorange();

    marker.on('dragend',()=> this.saveToLocalStorange())
  }

  deleteMarker(index:number){
    this.markers[index].marker.remove();
    this.markers.splice(index,1);
    this.saveToLocalStorange();
  }

  flyTo(marker:Marker){
    this.map?.flyTo({
      zoom:14,
      center:marker.getLngLat()
    })
  }

  saveToLocalStorange(){
    const plainMarker:PlainMarker[] = this.markers.map(({color,marker}) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers',JSON.stringify(plainMarker));
  }

  readToLocalStorange(){
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers:PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach( ({color,lngLat}) => {
      const [lng, lat]=lngLat;
      const coords = new LngLat(lng,lat);
      this.addMarker(coords,color);
    })
  }
}
