import { AfterViewInit, Component, ElementRef, ViewChild,OnDestroy} from '@angular/core';
import { LngLat, Map } from "mapbox-gl";
@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit,OnDestroy {

  @ViewChild('map')
  public divMap?: ElementRef;

  public zoom:number = 10;
  public map?: Map;
  public currentLngLat:LngLat = new LngLat(-103.64052026520027, 19.98917473097869);

  ngAfterViewInit(): void {
    if(!this.divMap)return;

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      });
      this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners(){
    if(!this.map) return;
    this.map.on('zoom',(en)=>{
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend',(en)=>{
      if(this.map!.getZoom() < 18 ) return;
      this.map!.zoomTo(18);
    });

    this.map.on('move',()=>{
      this.currentLngLat= this.map!.getCenter()
    })
  }

  zoomIn(){
    this.map?.zoomIn();
  }

  zoomOut(){
    this.map?.zoomOut();
  }

  zoomChange(value:string){
    this.zoom=Number(value);
    this.map?.zoomTo(this.zoom);
  }
}
