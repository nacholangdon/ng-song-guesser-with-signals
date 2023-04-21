import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { BehaviorSubject, combineLatest, delay, filter, interval, map, Observable, of, shareReplay, Subject, switchMap, take, takeUntil, takeWhile, tap, timer } from 'rxjs';

import { Song } from 'src/app/core/models/song';
import { Constants } from 'src/app/core/models/constant';

import { AuthService } from 'src/app/core/services/auth.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { UsersService } from 'src/app/core/services/users.service';

import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { FeedbackWordComponent } from 'src/app/shared/components/feedback-word/feedback-word.component';

@Component({
  selector: 'app-guess-the-song',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule, FeedbackWordComponent],
  templateUrl: './guess-the-song.component.html',
  styleUrls: ['./guess-the-song.component.scss']
})
export class GuessTheSongComponent {

  private readonly _router = inject(Router);
  private readonly _fb = inject(FormBuilder);
  private readonly _document = inject(DOCUMENT);
  private readonly _authService = inject(AuthService);
  private readonly _songsService = inject(SongsService);
  private readonly _userService = inject(UsersService);

  @ViewChild(FeedbackWordComponent) randomWordComponent!: FeedbackWordComponent;

  public attempts = 0;
  public playedGames = 1;
  public totalScore = 0;
  public isGameOver = false;

  public teamCode = '';
  public randomSongPosId = Math.floor(Math.random() * Constants.SONGS_OPTIONS);
  public correctSong!: Song;
  public showFeedback = false;
  public showForm = true;

  private _songCorrect$ = new Subject<void>();
  private _resetTimer$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private _stopCondition$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public authState$ = this._authService.authState$;

  private _songs$: Observable<Song[]> = this._songsService.getSongs().pipe(
    map(songs => this._getSongOptions(songs, 0, Constants.SONGS_OPTIONS)),
    shareReplay()
  );

  private _lyrics$: Observable<string[]> = this._songs$.pipe(
    switchMap(songs => {
      this.correctSong = songs[this.randomSongPosId];
      return of(songs[this.randomSongPosId].lyrics || []);
    }),
  );

  private _timer$: Observable<number> = this._resetTimer$.pipe(
    switchMap(() => timer(0, Constants.COUNTDOWN_INTERVAL)),
    map(num => Constants.COUNTDOWN_SECONDS - num),
    tap(timeLeft => {
      if (timeLeft === 0) {
        this._gameOver();
      }
    })
  );

  private _currentPhrase$: Observable<string> = interval(Constants.PHRASE_INTERVAL).pipe(
    takeWhile(() => !this._stopCondition$.getValue()),
    switchMap(() => this._lyrics$),
    map(lyricsArray => lyricsArray[Math.floor(Math.random() * lyricsArray.length)])
  );

  public vm$ = combineLatest([
    this._authService.authState$,
    this._authService.isLoggedIn$,
    this._authService.selectedTeam$,
    this._songs$,
    this._timer$,
    this._currentPhrase$
  ]).pipe(map(([authState, isLoggedIn, selectedTeam, songs, timer, currentPhrase]) => ({ authState, isLoggedIn, selectedTeam, songs, timer, currentPhrase })));

  public songsForm = this._fb.group({
    songChoice: [null],
  });

  public ngOnInit(): void {
    this.authState$.subscribe(res => {
      if (!res) {
        this._router.navigate(['/login']);
      }
    });
  }

  public onSubmit(selectedOptionId: number) {
    this.attempts++;
    //console.log(selectedOptionId, this.correctSong.id)
    if (Number(selectedOptionId) === this.correctSong.id) {
      // console.log('isCorrect -> ', this.randomSongPosId);

      // Update playedGames and totalScore
      this.playedGames++;
      this.totalScore += this.attempts === 1 ? 5 : this.attempts === 2 ? 3 : 1;
      // feedback message
      // console.log('FEEDBACK MESSAGE: totalScore => ', this.totalScore)
      this.setFeedback('Correct!');
      // Reset attempts and select another song
      this.attempts = 0;
      this.showForm = false;
      timer(1000).subscribe(_ => {
        this.randomSongPosId = Math.floor(Math.random() * Constants.SONGS_OPTIONS);
        this._stopCondition$.next(false);
        this._songCorrect$.next();
        this._resetCountdown();
        this.songsForm.reset();
        this.showForm = true;
      });
    } else {
      this._toggleClass('form.bg-white.shadow-md.rounded', 'shake-error', Constants.COUNTDOWN_INTERVAL);
      // console.log('incorrect => ', Number(selectedOptionId), this.randomSongPosId);
      if (this.attempts === 2) {
        this.setFeedback('Last Chance!');
      }
    }

    if (this.attempts >= 3) {
      this.setFeedback('Game Over!');
      this._gameOver();
    }
  }

  private setFeedback(word: string) {
    this.showFeedback = true;
    timer(0).subscribe(_ => {
      this.randomWordComponent.startAnimation(word);
    });
    timer(1000).subscribe(_ => {
      this.showFeedback = false;
    })
  }

  private _resetCountdown() {
    this._resetTimer$.next(true);
    // Had to use document to be clean :/
    this._toggleClass('#countdown svg', 'active', Constants.COUNTDOWN_INTERVAL / 2);
  }

  private _toggleClass(selector: string, className: string, interval: number): void {
    const el = this._document.querySelector(selector);
    el?.classList.toggle(className);
    setTimeout(() => {
      el?.classList.toggle(className);
    }, interval);
  }

  private _gameOver() {
    this.isGameOver = true;
    this._stopCondition$.next(true);

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

  private _getSongOptions(songs: Song[], songPosId: number, listLength: number): Song[] {
    const filteredSongs = songs.filter((song, i) => i !== songPosId);
    const shuffledSongs = filteredSongs.sort(() => Math.random() - 0.5);
    const randomChoices = shuffledSongs.slice(0, listLength - 1);

    this.correctSong = songs[songPosId];
    if (this.correctSong) {
      randomChoices.push(this.correctSong);
    }

    // Shuffle the random choices array again to mix the correct song
    const finalChoices = randomChoices.sort(() => Math.random() - 0.5);

    return finalChoices;
  }

}
