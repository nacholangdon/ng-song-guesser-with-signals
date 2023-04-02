import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SONG_MOCK } from '../../../mocks/song-mock';
import { Song } from '../models/song';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  getSongs(): Observable<Song[]> {
    return of(SONG_MOCK);
  }
}
