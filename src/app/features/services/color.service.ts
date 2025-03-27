import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ColorResponseT, ColorT } from '../model/color';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  #_httpClient = inject(HttpClient);

  private apiUrl =
    'https://color-palette-and-image-search-api.onrender.com/color/api/closest-colors';

  post(req: ColorT): Observable<ColorResponseT[]> {
    return this.#_httpClient
      .post<ColorResponseT[]>(this.apiUrl, {
        target_color: req.target_color,
        top_n: req.top_n,
      })
      .pipe();
  }
}
