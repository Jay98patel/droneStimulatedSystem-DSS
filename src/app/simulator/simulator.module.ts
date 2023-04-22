import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimulatorRoutingModule } from './simulator-routing.module';
import { SimulatorComponent } from './simulator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CoordinateFormComponent } from './components/coordinate-form/coordinate-form.component';

@NgModule({
  declarations: [SimulatorComponent, CoordinateFormComponent],
  imports: [
    CommonModule,
    SimulatorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class SimulatorModule {}
