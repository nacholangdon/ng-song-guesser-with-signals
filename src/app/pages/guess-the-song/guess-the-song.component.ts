import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongsService } from '../../core/services/songs.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-guess-the-song',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-the-song.component.html',
  styleUrls: ['./guess-the-song.component.scss']
})
export class GuessTheSongComponent {
  private readonly _songsService = inject(SongsService);
  
  public lyrics$: Observable<string[]> = this.getLyrics(Math.floor(Math.random() * 3) + 1); // TODO: get lyric from real songId


  getLyrics(songId: number): Observable<string[]> {
    console.log(songId)
    return this._songsService.getLyrics(songId).pipe(
      map((lyrics: string[]) => this._shuffleArray(lyrics))
    );
  }

  private _shuffleArray(arr: string[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr;
  };
}
