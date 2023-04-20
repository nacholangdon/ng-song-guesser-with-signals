import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { Song } from '../models/song';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  private _http = inject(HttpClient);

  getSongs(): Observable<Song[]> {
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    return this._http.get<Song[]>('http://137.184.76.157:3000/song/5', { headers });
  }

  getLyrics(songPosId: number): Observable<string[]> {
    return this.getSongs().pipe(
      map(songs => songs[songPosId]),
      map(song => song?.lyrics ?? [])
    );
  }

}
