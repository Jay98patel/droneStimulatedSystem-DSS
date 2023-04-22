import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-sidebar-v2';
import { Coordinates } from './models/model.interfaces';
@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss'],
})
export class SimulatorComponent implements OnInit {
  map: L.Map;
  sidebar: L.Control.Sidebar;
  coordinatesValues: Coordinates;
  currentIndex = 0;
  marker: any;
  polyline: any;
  timerId: any;
  droneIcon = L.divIcon({
    html: '<i class="fas fa-paper-plane fa-2x"></i>',
    className: 'drone-icon',
    iconSize: [32, 32],
  });

  constructor() {}

  ngOnInit(): void {
    this.generateMap();
    this.generateSideBar();
  }

  generateMap() {
    const maxBoundsViscocity = 1.0;
    this.map = L.map('map', {
      maxBoundsViscosity: maxBoundsViscocity,
    }).setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Jay Patel',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);

    this.map.fitWorld();
    this.map.setMaxBounds(L.latLngBounds([-90, -180], [90, 180]));
  }

  generateSideBar() {
    this.sidebar = L.control.sidebar({
      autopan: true,
      closeButton: true,
      container: 'sidebar',
      position: 'left',
    });
    this.map.addControl(this.sidebar);
  }

  getCoordinates(coordinateValue: Coordinates) {
    const pathLatLngs: L.LatLng[] = [];
    this.coordinatesValues = coordinateValue;
    const startLatLong = L.latLng(
      coordinateValue.latitudes[0],
      coordinateValue.longitudes[0]
    );

    this.map.setView(startLatLong, 25);
    const droneMarker = L.marker(startLatLong, { icon: this.droneIcon }).addTo(
      this.map
    );
      
    const pathOptions = {
      color: '#3388ff',
      weight: 3,
    };

    for (let i = 0; i < this.coordinatesValues.latitudes.length; i++) {
      const lat = this.coordinatesValues.latitudes[i];
      const lng = this.coordinatesValues.longitudes[i];
      const latLng = L.latLng(lat, lng);
      pathLatLngs.push(latLng);
    }
    const pathPolyline = L.polyline(pathLatLngs, pathOptions).addTo(this.map);

    this.timerId = setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex >= this.coordinatesValues.latitudes.length) {
        clearInterval(this.timerId);
        return;
      }
      const newCord = pathLatLngs[this.currentIndex];
      droneMarker.setLatLng(newCord);
      pathPolyline.addLatLng(newCord);

      this.map.panTo(newCord);
    }, 1000);
  }

  toggleSidebar() {
    this.sidebar.close();
    if (this.coordinatesValues) {
      for (let i = 0; i < this.coordinatesValues.latitudes.length; i++) {
        const path = {
          latitude: this.coordinatesValues.latitudes[i],
          longitude: this.coordinatesValues.longitudes[i],
        };
        const latlng = L.latLng(path.latitude, path.longitude);
        L.polyline([latlng], { color: 'red' }).addTo(this.map);
      }
    }
  }

  Show() {
    this.map.addControl(this.sidebar);
  }
}
