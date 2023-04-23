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
  @Output() droneStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  droneForm: FormGroup[] = [];
  buttonName: string = 'Pause';
  isDronePause: boolean = false;
  noOfDrones: number[] = [1];
  coordinateForm: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildFormForDrone(0);
  }

  buildFormForDrone(index: number) {
    if (!this.droneForm[index]) {
      this.droneForm[index] = this.fb.group({
        paths: this.fb.array([
          this.createPath(), // TODO
          this.createPath(), // TODO
          this.createPath(), // TODO
          this.createPath(), // TODO
          this.createPath(), // TODO
          this.createPath(), // TODO
        ]),
      });
    }
    //temp
    this.patchValues();
  }

  //development purpose
  patchValues() {
    let arr = [
      [40.6851, -73.94136],
      [40.68576, -73.94149],
      [40.68649, -73.94165],
      [40.68679, -73.94185],
      [40.68699, -73.94205],
      [40.6851, -73.94136],
    ];
    const pathsControl = this.droneForm[0].get('paths') as FormArray;
    for (let i = 0; i < pathsControl.length; i++) {
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
    };
    this.coordinates.emit(coordinates);
  }
}
