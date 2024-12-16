import { Routes,RouterModule } from '@angular/router';
import { DsaComponent } from './core/components/main/dsa/dsa.component';
import { TempExampleComponent } from './shared/components/temp-example/temp-example.component';
import { NotFoundComponent } from './core/components/main/not-found/not-found.component';
import { IntroComponent } from './core/components/main/intro/intro.component';
import { NgModule } from '@angular/core';
import { SimpleConstraintComponent } from './shared/constraints/simple-constraint/simple-constraint.component';
import { ChainConstraintComponent } from './shared/constraints/chain-constraint/chain-constraint.component';
import { FabrikConstraintComponent } from './shared/constraints/fabrik-constraint/fabrik-constraint.component';

export const routes: Routes = [
    { path: 'dsa/intro', component: IntroComponent },
    { path: 'dsa/:algorithm', component: DsaComponent },
    { path: 'constraint/simple-constraint', component: SimpleConstraintComponent },
    { path: 'constraint/chain-constraint', component: ChainConstraintComponent },
    { path: 'constraint/fabrik-constraint', component: FabrikConstraintComponent },
    { path: '404', component: NotFoundComponent },
    { path: 'example', component: TempExampleComponent },
    { path: '', redirectTo: '/dsa/intro', pathMatch: 'full' },
    { path: '**', redirectTo: '/404' },

];

// @NgModule({
//     imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
//     exports: [RouterModule]
//   })
//   export class AppRoutingModule {}