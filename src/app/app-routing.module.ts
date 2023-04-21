import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'stimulation',
    pathMatch: 'full',
  },
  {
    path: 'stimulation',
    loadChildren: () =>
      import('./simulator/simulator.module').then((m) => m.SimulatorModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
