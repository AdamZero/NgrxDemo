import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';


import * as fromRoot from '../../ngrx';
import * as themeAction from '../../ngrx/actions/theme'
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.css']
})
export class Page2Component implements OnInit, OnDestroy {
  theme$: Observable<String>
  themeSub$: Subscription
  theme
  constructor(private store: Store<fromRoot.State>) {
    this.theme$ = this.store.pipe(select(fromRoot.getTheme))
  }
  ngOnInit() {
    this.themeSub$ = this.theme$.subscribe((res: any) => {
      console.log(res)
    })
  }

  ngOnDestroy() {
    this.themeSub$.unsubscribe()
  }




}
