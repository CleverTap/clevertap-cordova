import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import {HeaderComponent} from "./header/header.component";
import {ContentComponent} from "./content/content.component";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [AppComponent, HeaderComponent,ContentComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),CommonModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
