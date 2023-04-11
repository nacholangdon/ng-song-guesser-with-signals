import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Observable, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { Song } from 'src/app/core/models/song';
import { SongsService } from 'src/app/core/services/songs.service';

@Component({
  selector: 'app-select-song',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-song.component.html',
  styleUrls: ['./select-song.component.scss']
})
export class SelectSongComponent {

  private readonly _router = inject(Router);
  private readonly _songsService = inject(SongsService);

  searchSong = new FormControl('');

  public songs$: Observable<Song[]> = this.searchSong.valueChanges.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((term) => term ? this.getSongs(term) : of([]))
  );

  getSongs(name: string): Observable<Song[]> {
    return this._songsService.getSongs().pipe(
      map((response: Song[]) => response.filter((song: Song) => song.title.toLowerCase().includes(name.toLowerCase()))
    ));
  }

  selectSong(songId: number) {
    this._router.navigate(['/guess-the-song'], { queryParams: { songId } });
  }

}
