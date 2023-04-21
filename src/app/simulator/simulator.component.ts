import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-sidebar-v2';
@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss'],
})
export class SimulatorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.generateMap();
  }

  generateMap() {
    const maxBoundsViscocity = 1.0;
    const map = L.map('map', {
      maxBoundsViscosity: maxBoundsViscocity,
    }).setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(map);

    map.fitWorld();
    map.setMaxBounds(L.latLngBounds([-90, -180], [90, 180]));
    L.popup;
  }
}
