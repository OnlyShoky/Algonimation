import { Routes } from '@angular/router';
import { DsaComponent } from './core/components/main/dsa/dsa.component';
import { TempExampleComponent } from './shared/components/temp-example/temp-example.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dsa/sorting', pathMatch: 'full' },
    { path: 'dsa/:algorithm', component: DsaComponent },
    { path: 'example', component: TempExampleComponent },
];

