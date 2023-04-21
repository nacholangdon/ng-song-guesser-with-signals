import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Song } from '../models/song';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  private _http = inject(HttpClient);

  getSongs(): Observable<Song[]> {
    console.log('esto no deberia ejecutarse mas de una vez');
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    return this._http.get<Song[]>('http://137.184.76.157:3000/song/5', { headers });
  }

}
