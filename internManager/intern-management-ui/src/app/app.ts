import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Import Router tools
import { MatToolbarModule } from '@angular/material/toolbar'; // Import Toolbar
import { MatButtonModule } from '@angular/material/button'; // Import Buttons

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    MatToolbarModule, 
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'intern-management-ui';
}