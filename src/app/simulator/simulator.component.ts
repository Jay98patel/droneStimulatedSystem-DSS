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
    this.coordinatesValues = coordinateValue;
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
