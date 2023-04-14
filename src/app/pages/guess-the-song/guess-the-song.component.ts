import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BehaviorSubject, combineLatest, delay, filter, interval, map, Observable, startWith, switchMap, take, takeWhile, tap } from 'rxjs';

import { Song } from 'src/app/core/models/song';
import { AuthService } from 'src/app/core/services/auth.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { UsersService } from 'src/app/core/services/users.service';

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
  private readonly _userService = inject(UsersService);

  public attempts = 0;
  public playedGames = 0;
  public totalScore = 0;
  public isGameOver = false;

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
    map(songs => this._getSongOptions(songs, this.randomSongId, 5))
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

  public countdown_reversed$: Observable<number> = this._countdown$.pipe(
    takeWhile(() => !this.stopCondition$.getValue()),
    startWith(COUNTDOWN_SECONDS),
    map(seconds => COUNTDOWN_SECONDS - seconds)
  );

  public ngOnInit(): void {
    this.authState$.subscribe(res => {
      if (!res) {
        this._router.navigate(['/login']);
      }
    });
  }

  public onSubmit() {
    this.attempts++;
    const selectedSongId = this.songsForm.get('songChoice')?.value;
    if (Number(selectedSongId) === this.randomSongId) {
      console.log('isCorrect -> ', this.randomSongId);

      // Update playedGames and totalScore
      this.playedGames++;
      this.totalScore += this.attempts === 1 ? 5 : this.attempts === 2 ? 3 : 1;

      // Reset attempts and select another song
      this.attempts = 0;
      this.randomSongId = Math.floor(Math.random() * 8) + 1;
      this.lyrics$ = this._getLyrics(this.randomSongId);
      this.songs$ = this._songsService.getSongs().pipe(
        take(1),
        map(songs => this._getSongOptions(songs, this.randomSongId, 5))
      );
      this.stopCondition$.next(false);
    } else {
      console.log('incorrect => ', Number(selectedSongId), this.randomSongId);
    }

    if (this.attempts >= 3) {
      this.gameOver();
    }
  }

  private gameOver() {
    this.isGameOver = true;
    this.stopCondition$.next(true);

    // Send score object to UserService
    this._authService.authState$
      .pipe(
        take(1),
        filter(authState => !!authState),
        tap(authState => {
          const scoreObject = {
            email: authState.email,
            playedGames: this.playedGames,
            totalScore: this.totalScore
          };
          this._userService.updateUserScore(scoreObject);
        }),
        delay(3000)
      )
      .subscribe(() => {
        this._router.navigate(['/ranking']);
      });
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
