import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coordinates, DroneValue } from '../../models/model.interfaces';

@Component({
  selector: 'app-coordinate-form',
  templateUrl: './coordinate-form.component.html',
  styleUrls: ['./coordinate-form.component.scss'],
})
export class CoordinateFormComponent implements OnInit {
  @Output() coordinates: EventEmitter<Coordinates> =
    new EventEmitter<Coordinates>();
  @Output() droneStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setMapViewOnDroneChanges: EventEmitter<DroneValue> =
    new EventEmitter<DroneValue>();
  @Output() coordinateAtTime: EventEmitter<DroneValue> =
    new EventEmitter<DroneValue>();

  droneForm: FormGroup[] = [];
  buttonName: string = 'Pause';
  isDronePause: boolean = false;
  noOfDrones: number[] = [1];
  coordinateForm: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildFormForDrone(0);
    // this.patchValues()
  }

  buildFormForDrone(index: number) {
    if (!this.droneForm[index]) {
      this.droneForm[index] = this.fb.group({
        paths: this.fb.array([this.createPath()]),
      });
    }
  }

  jumbToTime(e: any) {
    const value = +e.target.value + 1;
    const coordinatesAtTime = this.paths.value[value - 1];
    console.log(coordinatesAtTime, value);
    this.coordinateAtTime.emit(coordinatesAtTime);
  }

  patchValues() {
    let arr = [
      [18.5204, 73.8567],
      [19.076, 72.8777],
      [23.0225, 72.5714],
    ];
    const pathsControl = this.droneForm[0].get('paths') as FormArray;
    for (let i = 0; i < pathsControl.length; i++) {
      this.paths.push(this.createPath());
      pathsControl.at(i).patchValue({
        latitude: arr[i][0],
        longitude: arr[i][1],
      });
    }
  }

  increaseDecreaseDrone(operation: string) {
    const lengthOfDrone = this.noOfDrones.length;
    if (operation == 'increase') {
      this.noOfDrones.push(lengthOfDrone);
    } else {
      this.noOfDrones.pop();
    }
    this.buildFormForDrone(this.noOfDrones.length - 1);
    const latLng: DroneValue =
      this.droneForm[this.noOfDrones.length - 1].value.paths[0];
    this.setMapViewOnDroneChanges.emit(latLng);
  }

  createPath(): FormGroup {
    let validators = [Validators.required, Validators.pattern('^[0-9]+$')];
    return this.fb.group({
      latitude: ['', [...validators]],
      longitude: ['', [...validators]],
    });
  }

  isResumeOrPause() {
    this.isDronePause = !this.isDronePause;
    this.buttonName = this.isDronePause ? 'Resume' : 'Pause';
    this.droneStatus.emit(this.isDronePause);
  }

  get paths(): FormArray {
    return this.droneForm[this.noOfDrones.length - 1].get('paths') as FormArray;
  }

  addPath(): void {
    this.paths.push(this.createPath());
    console.log(this.paths.length)
  }

  removeCoordinate(i: number) {
    this.paths.removeAt(i);
  }

  simulate() {
    const path = this.droneForm[this.noOfDrones.length - 1].get(
      'paths'
    ) as FormArray;
    const latitudes = path.controls.map(
      (control: any) => control.get('latitude').value
    );
    const longitudes = path.controls.map(
      (control: any) => control.get('longitude').value
    );
    const coordinates: Coordinates = {
      latitudes: latitudes,
      longitudes: longitudes,
      selectedDrone: this.noOfDrones.length - 1,
    };
    this.coordinates.emit(coordinates);
  }
}
