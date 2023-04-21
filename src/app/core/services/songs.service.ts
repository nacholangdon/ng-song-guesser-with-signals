import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Song } from '../models/song';
import { Constants } from '../models/constant';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  private _http = inject(HttpClient);

  getSongs(): Observable<Song[]> {
    console.log('esto no deberia ejecutarse mas de una vez');
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    return this._http.get<Song[]>(`${Constants.API_URL}/song/${Constants.SONGS_OPTIONS}`, { headers });
  }

}
