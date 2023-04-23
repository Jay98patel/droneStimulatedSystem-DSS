import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-sidebar-v2';
import { Coordinates, DroneValue } from './models/model.interfaces';
@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss'],
})
export class SimulatorComponent implements OnInit {
  map: L.Map;
  sidebar: L.Control.Sidebar;
  pathPolyline: L.Polyline[] = [];
  droneMarker: L.Marker[] = [];
  pathLatLngs: L.LatLng[][] = [];

  coordinatesValues: Coordinates;
  selectedDrone: number = 1;
  currentIndex: number[] = [];
  marker: any;
  polyline: any;
  paused = false;

  pathOptions = {
    color: '#3388ff',
    weight: 3,
  };

  droneIcon = L.divIcon({
    html: '<img src="../../assets/drone.png" alt="T">',
    className: 'drone-icon',
    iconSize: [32, 32],
  });

  constructor() {}

  ngOnInit(): void {
    this.generateMap();
    this.generateSideBar();
    this.pathLatLngs.push([]);
  }

  generateMap() {
    const maxBoundsViscocity = 1.0;
    this.map = L.map('map', {
      maxBoundsViscosity: maxBoundsViscocity,
    }).setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Jay Patel',
      maxZoom: 18,
      minZoom: 2,
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
    this.selectedDrone = coordinateValue.selectedDrone;
    this.currentIndex.push(0);
    this.coordinatesValues = coordinateValue;
    const startLatLong = L.latLng(
      coordinateValue.latitudes[0],
      coordinateValue.longitudes[0]
    );

    this.map.setView(startLatLong, 25);

    this.droneMarker[this.selectedDrone] = L.marker(startLatLong, {
      icon: this.droneIcon,
    }).addTo(this.map);

    for (let i = 0; i < this.coordinatesValues.latitudes.length; i++) {
      const lat = this.coordinatesValues.latitudes[i];
      const lng = this.coordinatesValues.longitudes[i];
      const latLng = L.latLng(lat, lng);
      this.pathLatLngs[this.selectedDrone].push(latLng);
    }
    this.pathPolyline[this.selectedDrone] = L.polyline(
      this.pathLatLngs[this.selectedDrone],
      this.pathOptions
    ).addTo(this.map);
    this.moveMarker();
  }

  moveMarker() {
    const animate = () => {
      if (!this.paused) {
        const latlng =
          this.pathLatLngs[this.selectedDrone][
            this.currentIndex[this.selectedDrone]
          ];
        this.droneMarker[this.selectedDrone].setLatLng(latlng);
        this.pathPolyline[this.selectedDrone].addLatLng(latlng);
        this.map.flyTo(latlng, 17, {
          duration: 0.5,
          easeLinearity: 20,
          noMoveStart: true,
          animate: true,
        });

        this.map.panTo(latlng, { animate: true });
        this.currentIndex[this.selectedDrone]++;
        if (
          this.currentIndex[this.selectedDrone] <
          this.pathLatLngs[this.selectedDrone].length
        ) {
          setTimeout(animate, 1000);
        }
      }
    };
    animate();
  }

  setMapView(latLng: DroneValue) {
    if (latLng.latitude && latLng.longitude) {
      const startLatLong = L.latLng(latLng.latitude, latLng.longitude);
      this.droneMarker[this.selectedDrone] = L.marker(startLatLong, {
        icon: this.droneIcon,
      }).addTo(this.map);
      this.map.setView(startLatLong, 25);
    }
  }

  jumpToTime(e: DroneValue) {
    this.paused = false;
    const startLatLong = L.latLng(e.latitude, e.longitude);
    this.droneMarker[this.selectedDrone] = L.marker(startLatLong, {
      icon: this.droneIcon,
    }).addTo(this.map);
    this.droneMarker[this.selectedDrone].setLatLng(startLatLong);
    this.map.setView(startLatLong, 18);
  }

  pauseOrResumeDrone(isPause: boolean) {
    this.paused = !this.paused;
    !isPause && this.moveMarker();
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

  hide() {
    this.sidebar.remove();
  }
}
