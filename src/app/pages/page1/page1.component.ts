import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select, State } from '@ngrx/store';
import * as fromRoot from '../../ngrx'
import * as themeAction from '../../ngrx/actions/theme'
import * as layoutAction from '../../ngrx/actions/count'

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.css']
})
export class Page1Component implements OnInit, OnDestroy {
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

  changeTheme(themeName: String) {
    this.store.dispatch(new themeAction.Change(themeName))
  }


}
