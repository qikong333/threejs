import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Demo1Component } from './demo/demo1/demo1.component';
import { LayerComponent } from './component/layer/layer.component';
import { HomeComponent } from './page/home/home.component';
import { CanvaComponent } from './page/canva/canva.component';
import { Demo2Component } from './demo/demo2/demo2.component';

@NgModule({
  declarations: [
    AppComponent,
    Demo1Component,
    LayerComponent,
    HomeComponent,
    CanvaComponent,
    Demo2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
