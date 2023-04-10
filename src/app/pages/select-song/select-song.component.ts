import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, interval, map, of, switchMap, tap } from 'rxjs';
import { SongsService } from 'src/app/core/services/songs.service';
import { Song } from 'src/app/core/models/song';

@Component({
  selector: 'app-select-song',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-song.component.html',
  styleUrls: ['./select-song.component.scss']
})
export class SelectSongComponent {

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

}
