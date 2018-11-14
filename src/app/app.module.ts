import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Page1Component } from './pages/page1/page1.component';
import { Page2Component } from './pages/page2/page2.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './ngrx';
import { AppRouter } from './router';
import { Page3Component } from './pages/page3/page3.component';
@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    Page2Component,
    Page3Component,
  ],
  imports: [
    AppRouter,
    BrowserModule,
    StoreModule.forRoot(reducers, { metaReducers })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
