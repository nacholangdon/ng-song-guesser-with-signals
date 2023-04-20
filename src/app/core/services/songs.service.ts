import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of, take, tap } from 'rxjs';

import { Song } from '../models/song';
import { SONG_MOCK } from '../../../mocks/song-mock';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  constructor(private http: HttpClient) {}


  getSongs(): Observable<Song[]> {
    const headers = new HttpHeaders().append('appKey', 'YOUR_APP_KEY');
    return this.http.get<Song[]>('http://137.184.76.157:3000/song/10', { headers });
  }

  getLyrics(songId: number): Observable<string[]> {
    return this.getSongs().pipe(
      map(songs => songs.find(song => song.id === songId)),
      map(song => song?.lyrics ?? [])
    );
  }
  
}
