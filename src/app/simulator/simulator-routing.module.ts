import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulatorComponent } from './simulator.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'worldMap',
    pathMatch: 'full',
  },
  {
    path: 'worldMap',
    component: SimulatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulatorRoutingModule {}
