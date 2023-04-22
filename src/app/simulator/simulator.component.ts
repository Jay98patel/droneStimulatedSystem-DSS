import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-sidebar-v2';
@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss'],
})
export class SimulatorComponent implements OnInit {
  map: L.Map;
  sidebar: L.Control.Sidebar;
  droneForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.generateMap();
    this.generateSideBar();
    this.droneForm = this.fb.group({
      paths: this.fb.array([this.createPath()]),
    });
  }

  generateMap() {
    const maxBoundsViscocity = 1.0;
    this.map = L.map('map', {
      maxBoundsViscosity: maxBoundsViscocity,
    }).setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
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

  toggleSidebar() {
    this.sidebar.close();

    const paths = this.droneForm.value.paths;
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const latlng = L.latLng(path.latitude, path.longitude);
      L.polyline([latlng], { color: 'red' }).addTo(this.map);
    }
  }

  Show() {
    this.map.addControl(this.sidebar);
  }

  get paths(): FormArray {
    return this.droneForm.get('paths') as FormArray;
  }

  addPath(): void {
    this.paths.push(this.createPath());
  }

  simulate() {
    const path = this.droneForm.get('paths') as FormArray;
    const latitudes = path.controls.map(
      (control: any) => control.get('latitude').value
    );
    const longitudes = path.controls.map(
      (control: any) => control.get('longitude').value
    );
    console.log(latitudes, longitudes);
  }

  createPath(): FormGroup {
    return this.fb.group({
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
    });
  }
}
