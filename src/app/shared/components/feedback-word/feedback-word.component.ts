import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationBuilder, AnimationFactory, AnimationPlayer, NoopAnimationPlayer, animate, style } from '@angular/animations';

@Component({
  selector: 'app-feedback-word',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-word.component.html',
  styleUrls: ['./feedback-word.component.scss']
})
export class FeedbackWordComponent implements OnInit {

  private readonly elRef = inject(ElementRef);
  private readonly builder = inject(AnimationBuilder);
  
  randomWord: string = 'Loading...';
  private player!: AnimationPlayer;

  ngOnInit(): void {
  }

  public startAnimation(word: string): void {
    this.randomWord = word;
    if (!this.player) {
      this.prepareAnimation();
    }
    this.playAnimation();
  }

  private prepareAnimation(): void {
    const animationFactory: AnimationFactory = this.builder.build([
      animate('1s ease-in-out', style({ transform: 'scale3d(1.5, 1.5, 1)', opacity: 0 }))
    ]);

    const svgElement = this.elRef.nativeElement.querySelector('svg');
    this.player = animationFactory.create(svgElement);
  }

  private playAnimation(): void {
    this.player.play();
    this.player.onDone(() => {
      this.player.reset();
    });
  }
}
