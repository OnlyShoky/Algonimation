import { Component, OnInit } from '@angular/core';
import { ThemesManagerService } from '../../services/themes-manager.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-darkmode-toggle',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './darkmode-toggle.component.html',
  styleUrl: './darkmode-toggle.component.scss'
})
export class DarkmodeToggleComponent implements OnInit {
isChecked= false;

constructor(private themesManagerService: ThemesManagerService) { }

ngOnInit(): void {
  this.isChecked = this.themesManagerService.getIsDarkMode() ;
}

onToggleChange() {
  console.log("onToggleChange: isDarkMode: ");
  this.themesManagerService.toggleDarkMode();
}
 


}
