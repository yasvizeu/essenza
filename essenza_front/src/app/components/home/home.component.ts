import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardsComponent } from '../../shared/cards/cards';
import { CarouselComponent } from '../../shared/carousel/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CardsComponent, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
