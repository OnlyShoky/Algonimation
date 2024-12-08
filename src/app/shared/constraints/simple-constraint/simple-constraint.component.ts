import { Component, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, Inject, HostListener, } from '@angular/core';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemesManagerService } from '../../services/themes-manager.service';

@Component({
  selector: 'app-simple-constraint',
  standalone: true,
  imports: [CodeBlockComponent],
  templateUrl: './simple-constraint.component.html',
  styleUrl: './simple-constraint.component.scss'
})
export class SimpleConstraintComponent implements AfterViewInit {

  public themeColors: { primary: string; accent: string; secondary: string; warn: string } | undefined = { primary: '#A8D5BA', accent: '#69F0AE', secondary: '#FEFFA7', warn: '#FF5252' };

  // Subscription array to store all subscriptions for cleanup
  private subscriptions: Subscription[] = [];


  // To store the width and height of the board
  boardWidth: number = 400;
  boardHeight: number = 400;

  //Mouse position
  mouseX = 0;
  mouseY = 0;

  animationFrameId: any;

  ball: { x: number; y: number } = { x: this.boardWidth / 2, y: this.boardHeight / 2 };


  @ViewChild('visualContainer', { static: false }) visualContainer!: ElementRef<HTMLDivElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private themesManagerService: ThemesManagerService) { }



  // Method to update the size of the board

  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  startAnimation(): void {

    const animate = () => {
      this.drawSimpleConstraint1();
      this.drawSimpleConstraint2();

      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId))
      this.startAnimation();

    this.subscriptions.push(
      this.themesManagerService.currentTheme$.subscribe(() => {
        this.themeColors = this.themesManagerService.getThemeColorsRGBA(1);

      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // Constrain ball's position to the allowed distance
  private constrainDistance(point: { x: number; y: number }, anchor: { x: number; y: number }, maxDistance: number): { x: number; y: number } {
    const dx = point.x - anchor.x;
    const dy = point.y - anchor.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDistance) {
      const ratio = maxDistance / distance;
      return {
        x: anchor.x + dx * ratio,
        y: anchor.y + dy * ratio,
      };
    }

    return point;
  }

  drawSimpleConstraint1(): void {
    // Get the reference to the container

    // Create a canvas dynamically
    const canvas = document.getElementById('simpleConstraintCanvas1') as HTMLCanvasElement;
    if (!canvas) return;

    canvas.width = this.boardWidth;
    canvas.height = this.boardHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    const length = 100; // Maximum distance constraint
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const ball = { x: center.x, y: center.y };


    const rect = canvas.getBoundingClientRect();

    const mousePos = {
      x: this.mouseX - rect.left,
      y: this.mouseY - rect.top,
    };

    // Constrain the ball's movement
    const constrainedPos = this.constrainDistance(mousePos, center, length);
    ball.x = constrainedPos.x;
    ball.y = constrainedPos.y

    // Draw function to render the circle and ball
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circle boundary
    context.beginPath();
    context.arc(center.x, center.y, length, 0, Math.PI * 2);
    if (this.themeColors)
      context.strokeStyle = this.themeColors.accent;
    context.lineWidth = 2;
    context.stroke();

    // Draw ball
    context.beginPath();
    context.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
    if (this.themeColors)
      context.fillStyle = this.themeColors.accent;
    context.fill();


  }


  drawSimpleConstraint2(): void {
    // Get the reference to the container

    // Create a canvas dynamically
    const canvas = document.getElementById('simpleConstraintCanvas2') as HTMLCanvasElement;
    if (!canvas) return;

    canvas.width = this.boardWidth;
    canvas.height = this.boardHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    const length = 100; // Maximum distance constraint


    const rect = canvas.getBoundingClientRect();

    const mousePos = {
      x: this.mouseX - rect.left,
      y: this.mouseY - rect.top,
    };


    const center = mousePos;
    this.ball = this.constrainDistance(this.ball, mousePos, length);



    // Draw function to render the circle and ball
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circle boundary
    context.beginPath();
    context.arc(center.x, center.y, length, 0, Math.PI * 2);
    if (this.themeColors)
      context.strokeStyle = this.themeColors.accent; context.lineWidth = 2;
    context.stroke();

    // Draw ball
    context.beginPath();
    context.arc(this.ball.x, this.ball.y, 8, 0, Math.PI * 2);
    if (this.themeColors)
      context.fillStyle = this.themeColors.accent; context.fill();
    context.fill();


  }



}

