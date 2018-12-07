import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; //added for wikidata service
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GeneratorComponent } from './generator/generator.component';
import { HomeComponent } from './home/home.component';
import { CheckerComponent } from './checker/checker.component';
import { BackComponent } from './back/back.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule , MatProgressSpinnerModule, MatSnackBarModule } from '@angular/material';
import { from } from 'rxjs';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    GeneratorComponent,
    HomeComponent,
    CheckerComponent,
    BackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
