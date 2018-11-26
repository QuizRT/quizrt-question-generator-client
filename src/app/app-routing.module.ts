import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GeneratorComponent } from './generator/generator.component';
import { CheckerComponent } from './checker/checker.component';

const routes: Routes = [
  {
    path : '',
    component : HomeComponent
    },
    {
      path : 'checker',
      component : CheckerComponent
    },
    {
      path : 'generator',
      component : GeneratorComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
