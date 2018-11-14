import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { AppComponent } from "../app.component";
import { Page1Component } from "../pages/page1/page1.component";
import { Page2Component } from "../pages/page2/page2.component";
import { Page3Component } from "../pages/page3/page3.component";


const appRouters = [
  {
    path: '', component: AppComponent, children: [
      { path: 'page1', component: Page1Component },
      { path: 'page2', component: Page2Component },
      { path: 'page3', component: Page3Component },
      { path: '**', redirectTo: 'page1', pathMatch: 'full' }
    ]
  }
]
@NgModule({
  imports: [
    RouterModule.forRoot(appRouters)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouter {

}
