import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BehaviorSubject, combineLatest, interval, map, Observable, startWith, switchMap, take, takeWhile } from 'rxjs';

import { Song } from 'src/app/core/models/song';
import { AuthService } from 'src/app/core/services/auth.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

const PHRASE_INTERVAL = 5000;
const COUNTDOWN_INTERVAL = 1000;
const COUNTDOWN_SECONDS = 30;

@Component({
  selector: 'app-guess-the-song',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './guess-the-song.component.html',
  styleUrls: ['./guess-the-song.component.scss']
})
export class GuessTheSongComponent {

  private readonly _router = inject(Router);
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _songsService = inject(SongsService);

  public teamCode = '';
  public randomSongId = Math.floor(Math.random() * 8) + 1;
  public lyrics$: Observable<string[]> = this._getLyrics(this.randomSongId);
  public stopCondition$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public authState$ = this._authService.authState$;

  public vm$ = combineLatest([
    this._authService.authState$,
    this._authService.isLoggedIn$,
    this._authService.selectedTeam$
  ]).pipe(map(([authState, isLoggedIn, selectedTeam]) => ({ authState, isLoggedIn, selectedTeam })));

  public songsForm = this._fb.group({
    songChoice: [null],
  });

  public songs$: Observable<Song[]> = this._songsService.getSongs().pipe(
    take(1),
    map(songs => this._getSongOptions(songs, this.randomSongId, 3))
  );

  public currentPhrase$: Observable<string> = interval(PHRASE_INTERVAL).pipe(
    takeWhile(() => !this.stopCondition$.getValue()),
    startWith(0),
    switchMap(() => this.lyrics$),
    map(lyricsArray => lyricsArray[Math.floor(Math.random() * lyricsArray.length)])
  );

  private _countdown$: Observable<number> = interval(COUNTDOWN_INTERVAL).pipe(
    takeWhile(() => !this.stopCondition$.getValue()),
    take(COUNTDOWN_SECONDS)
  );

  private _countdown_reversed$: Observable<number> = this._countdown$.pipe(
    takeWhile(() => !this.stopCondition$.getValue()),
    map(seconds => COUNTDOWN_SECONDS - seconds)
  );

  private _countdown_percentage$: Observable<number> = this._countdown$.pipe(
    map((elapsedTime) => ((elapsedTime + 1) / 30) * 100)
  );

  public vm_countdown$ = combineLatest([
    this._countdown$,
    this._countdown_reversed$,
    this._countdown_percentage$,
  ]).pipe(map(([_, countdown_numeric_reversed, countdown_percentage]) => ({ _, countdown_numeric_reversed, countdown_percentage })));

  public ngOnInit(): void {
    this.authState$.subscribe(res => {
      if (!res) {
        this._router.navigate(['/login']);
      }
    });
  }

  public onSubmit() {
    const selectedSongId = this.songsForm.get('songChoice')?.value;
    if (Number(selectedSongId) === this.randomSongId) {
      console.log('isCorrect -> ', this.randomSongId);
      this.stopCondition$.next(true);
    } else {
      console.log('incorrect => ', Number(selectedSongId), this.randomSongId);
    }
  }

  private _getLyrics(songId: number): Observable<string[]> {
    return this._songsService.getLyrics(songId).pipe(
      map((lyrics: string[]) => this._shuffleArray(lyrics))
    );
  }

  private _getSongOptions(songs: Song[], songId: number, listLength: number): Song[] {
    const filteredSongs = songs.filter((song) => song.songId !== songId);
    const shuffledSongs = filteredSongs.sort(() => Math.random() - 0.5);
    const randomChoices = shuffledSongs.slice(0, listLength - 1);

    const correctSong = songs.find((song) => song.songId === songId);
    if (correctSong) {
      randomChoices.push(correctSong);
    }

    // Shuffle the random choices array again to mix the correct song
    const finalChoices = randomChoices.sort(() => Math.random() - 0.5);

    return finalChoices;
  }

  private _shuffleArray(arr: string[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr;
  };

}
