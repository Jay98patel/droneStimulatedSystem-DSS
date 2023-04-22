import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coordinates } from '../../models/model.interfaces';

@Component({
  selector: 'app-coordinate-form',
  templateUrl: './coordinate-form.component.html',
  styleUrls: ['./coordinate-form.component.scss'],
})
export class CoordinateFormComponent implements OnInit {
  @Output() coordinates: EventEmitter<Coordinates> =
    new EventEmitter<Coordinates>();

  droneForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.droneForm = this.fb.group({
      paths: this.fb.array([this.createPath()]),
    });
  }

  createPath(): FormGroup {
    let validators = [Validators.required, Validators.pattern('^[0-9]+$')];
    return this.fb.group({
      latitude: ['', [...validators]],
      longitude: ['', [...validators]],
    });
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
    const coordinates: Coordinates = {
      latitudes: latitudes,
      longitudes: longitudes,
    };
    console.log(this.droneForm.valid, coordinates);
    this.coordinates.emit(coordinates);
  }
}
