import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ColorService } from '../../services/color.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-color-select',
  imports: [],
  template: ` <p>color-select works!</p> `,
  styles: ``,
})
export class ColorSelectComponent implements OnInit, OnDestroy {
  #_cs = inject(ColorService);
  #_bus = new Subscription();
  ngOnInit(): void {
    this.#_bus.add(
      this.#_cs.post({ target_color: '#f34740', top_n: 5 }).subscribe((res) => {
        console.log(res);
      })
    );
  }
  ngOnDestroy(): void {
    this.#_bus.unsubscribe();
  }
}
