import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterOutlet,RouterLink } from '@angular/router';
import { AlgorithmService } from '../../../../shared/services/algorithm.service';
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    CommonModule,
    FooterComponent
],
})
export class NavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  algoNamesDSA : string[] = [];
  algoNamesConstraint : string[] = [];


  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

    constructor(algorithmService: AlgorithmService) {
      
      this.algoNamesDSA = algorithmService.getAlgorithmNamesByCategory("DSA");
      this.algoNamesConstraint = algorithmService.getAlgorithmNamesByCategory("constraint");

     }
}
