import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../ngrx/index';
import * as countActions from '../../ngrx/actions/count';
import { map } from 'rxjs/operators'
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-page3',
  templateUrl: './page3.component.html',
  styleUrls: ['./page3.component.css']
})
export class Page3Component implements OnInit {
  countSub$: Subscription;
  count$: Observable<number>;
  constructor(private store: Store<fromRoot.State>, route: ActivatedRoute) {
    this.countSub$ = route.params.pipe(map(params => new countActions.CountAdd())).subscribe(store)
    this.count$ = this.store.pipe(select(fromRoot.getCount))
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.countSub$.unsubscribe()
  }

}
