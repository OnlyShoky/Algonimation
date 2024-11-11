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
import { DarkmodeToggleComponent } from '../../../../shared/components/darkmode-toggle/darkmode-toggle.component';
import { DsaComponent } from '../dsa/dsa.component';
import { RouterOutlet,RouterLink } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { AlgorithmService } from '../../../../shared/services/algorithm.service';

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
    DarkmodeToggleComponent,
    DsaComponent,
    RouterOutlet,
    FooterComponent,
    RouterLink,
    CommonModule
  ],
})
export class NavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  algoNames : string[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

    constructor(algorithmService: AlgorithmService) {
      
      this.algoNames = algorithmService.getAllAlgorithmNames();
      console.log(this.algoNames);
     }
}
