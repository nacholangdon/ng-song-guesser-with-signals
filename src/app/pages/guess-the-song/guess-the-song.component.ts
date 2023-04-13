import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BehaviorSubject, interval, map, Observable, startWith, switchMap, take, takeWhile } from 'rxjs';

import { Song } from 'src/app/core/models/song';
import { AuthService } from 'src/app/core/services/auth.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

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
  private readonly _route = inject(ActivatedRoute);
  private readonly _authService = inject(AuthService);
  private readonly _songsService = inject(SongsService);

  public teamCode = this._route.snapshot.queryParams['teamCode'];
  public randomSongId = Math.floor(Math.random() * 8) + 1;
  public lyrics$: Observable<string[]> = this._getLyrics(this.randomSongId);
  public stopCondition$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public authState$ = this._authService.authState$;
  public isLoggedIn$ = this._authService.isLoggedIn$;

  public songsForm = this._fb.group({
    songChoice: [null],
  });

  public songs$: Observable<Song[]> = this._songsService.getSongs().pipe(
    take(1),
    map(songs => this._getSongOptions(songs, this.randomSongId, 3))
  );

  public currentPhrase$: Observable<string> = interval(5000).pipe(
    takeWhile(() => !this.stopCondition$.getValue()),
    startWith(0),
    switchMap(() => this.lyrics$),
    map(lyricsArray => lyricsArray[Math.floor(Math.random() * lyricsArray.length)])
  );

  public countdown$: Observable<number> = interval(1000).pipe(
    takeWhile(() => !this.stopCondition$.getValue()),
    take(30),
    map((elapsedTime) => ((elapsedTime + 1) / 30) * 100)
  );

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
      console.log('incorrect => ', Number(selectedSongId), this.randomSongId)
    }
  }

  public signOut(): void {
    this._authService.signOut();
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
