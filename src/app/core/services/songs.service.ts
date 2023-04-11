import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { SONG_MOCK } from '../../../mocks/song-mock';
import { Song } from '../models/song';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  getSongs(): Observable<Song[]> {
    return of(SONG_MOCK);
  }

  getLyrics(songId: number): Observable<string[]> {
    return of(SONG_MOCK).pipe(
      map(songs => {
        return songs.find(song => song.songId === songId)
      }),
      map(song => song?.lyrics ?? [])
    );
  }
}
