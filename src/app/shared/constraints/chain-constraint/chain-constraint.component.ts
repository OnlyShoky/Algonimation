import { Component, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, Inject, HostListener, } from '@angular/core';
import { CodeBlockComponent } from '../../components/code-block/code-block.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemesManagerService } from '../../services/themes-manager.service';
import { AlgorithmService } from '../../services/algorithm.service';
import { Algorithm } from '../../models/algorithm';

@Component({
  selector: 'app-chain-constraint',
  standalone: true,
  imports: [CodeBlockComponent, CommonModule],
  templateUrl: './chain-constraint.component.html',
  styleUrl: './chain-constraint.component.scss'
})
export class ChainConstraintComponent implements AfterViewInit {

  public themeColors: { primary: string; accent: string; secondary: string; warn: string } | undefined = { primary: '#A8D5BA', accent: '#69F0AE', secondary: '#FEFFA7', warn: '#FF5252' };

  // Subscription array to store all subscriptions for cleanup
  private subscriptions: Subscription[] = [];


  // To store the width and height of the board
  boardWidth: number = 400;
  boardHeight: number = 400;

  chainLength = 10; // Number of joints 
  jointLength = 30; // Distance between each joint

  //Set up the drawable elements (the chain, joints, and circles)
  joints: { x: number; y: number; size: number }[] = [];
  circles = [];

  //Mouse position
  mouseX = 0;
  mouseY = 0;

  animationFrameId: any;

  ball: { x: number; y: number } = { x: this.boardWidth / 2, y: this.boardHeight / 2 };


  @ViewChild('visualContainer', { static: false }) visualContainer!: ElementRef<HTMLDivElement>;
  algorithm: Algorithm = { name: '', category: '', description: '', code: { cpp: '', python: '', javascript: '' }, deltaLine: { cpp: 0, python: 0, javascript: 0 } };

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private themesManagerService: ThemesManagerService,  private algorithmService: AlgorithmService) { }

  initializeChain(): void {
    const startX = this.boardWidth / 2;
    const startY = this.boardHeight / 2;

    for (let i = 0; i < this.chainLength; i++) {
      this.joints.push({
        x: startX - i * this.jointLength,
        y: startY,
        size: 10,
      });
    }
  }

  // Method to update the size of the board

  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  loadAlgorithmContent(algorithmName: string) {
    // Load the content for the specific algorithm, like bubble sort, etc.
    this.algorithm = this.algorithmService.getAlgorithmByName(algorithmName) || {
      name: '',
      category: '',
      description: '',
      code: { cpp: '', python: '', javascript: '' },
      deltaLine: { cpp: 0, python: 0, javascript: 0 },
    };
  }

  startAnimation(): void {

    const animate = () => {
      this.drawSimpleConstraint1();

      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }


  ngAfterViewInit(): void {
    this.initializeChain();
    
    if (isPlatformBrowser(this.platformId)){
      this.loadAlgorithmContent("chain-constraint");
      this.startAnimation();


    }



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

    const head = this.joints[0];

    const rect = canvas.getBoundingClientRect();

    const mousePos = {
      x: this.mouseX - rect.left,
      y: this.mouseY - rect.top,
    };

    head.x = mousePos.x; // Move head towards the limited angle
    head.y = mousePos.y;

    for(let i =1; i<this.joints.length; i++) {
      const joint = this.joints[i];
      const prevJoint = this.joints[i-1];

      const constrainedPos = this.constrainDistance(joint, prevJoint, this.jointLength);
      this.joints[i].x = constrainedPos.x;
      this.joints[i].y = constrainedPos.y;
    }
    
  
    // Draw function to render the circle and ball
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake body
    context.beginPath();
    context.fillStyle = "black"; // Snake body color
    context.strokeStyle = "black"; // Snake outline
    if (this.themeColors){
      context.fillStyle = this.themeColors.accent; // Snake body color
      context.strokeStyle = this.themeColors.accent; // Snake outline
    }
    context.lineWidth = 5;

    

    context.beginPath();

    // Draw right half
    for (let i = 0; i < this.joints.length; i++) {

      const joint = this.joints[i];
      const x = joint.x;
      const y = joint.y;
      context.lineTo(x, y);

    }
    context.stroke();
    context.closePath();


    for (let i = 0; i < this.joints.length; i++) {
      context.beginPath();

      context.arc(this.joints[i].x, this.joints[i].y, this.joints[i].size, 0, Math.PI * 2);
      context.stroke();
      context.fill();

      context.closePath();



    }



  }

}

