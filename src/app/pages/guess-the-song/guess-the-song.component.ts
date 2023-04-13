import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { map, Observable } from 'rxjs';

import { SongsService } from '../../core/services/songs.service';
<<<<<<< Updated upstream
import { ActivatedRoute } from '@angular/router';
=======
import { ButtonComponent } from '../../shared/components/button/button.component';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
>>>>>>> Stashed changes

@Component({
  selector: 'app-guess-the-song',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guess-the-song.component.html',
  styleUrls: ['./guess-the-song.component.scss']
})
export class GuessTheSongComponent {

  private readonly _fb = inject(FormBuilder);
  private readonly _route = inject(ActivatedRoute);
  private readonly _songsService = inject(SongsService);
<<<<<<< Updated upstream

  public lyrics$: Observable<string[]> = this._getLyrics(+this._route.snapshot.queryParams['songId']);
=======
  private readonly _authService = inject(SocialAuthService);

  public randomSongId = Math.floor(Math.random() * 8) + 1;
  public lyrics$: Observable<string[]> = this._getLyrics(this.randomSongId);
  public stopCondition$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public authState$ = this._authService.authState;

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

  onSubmit() {
    const selectedSongId = this.songsForm.get('songChoice')?.value;
    if (Number(selectedSongId) === this.randomSongId) {
      console.log('isCorrect -> ', this.randomSongId);
      this.stopCondition$.next(true);
    } else {
      console.log('incorrect => ', Number(selectedSongId), this.randomSongId)
    }
  }
>>>>>>> Stashed changes

  private _getLyrics(songId: number): Observable<string[]> {
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

  public signOut(): void {
    this._authService.signOut();
  }

  public refreshGoogleToken(): void {
    this._authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
}
