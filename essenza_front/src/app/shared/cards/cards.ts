import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cards.html',
  styleUrl: './cards.scss'
})
export class CardsComponent {

}
