import { Injectable } from '@angular/core';

import { map, Observable, of } from 'rxjs';

import { Song } from '../models/song';
import { SONG_MOCK } from '../../../mocks/song-mock';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  getSongs(): Observable<Song[]> {
    return of(SONG_MOCK);
  }

  getLyrics(songId: number): Observable<string[]> {
    return of(SONG_MOCK).pipe(
      map(songs => songs.find(song => song.songId === songId)),
      map(song => song?.lyrics ?? [])
    );
  }
}
