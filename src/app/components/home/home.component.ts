import { Component } from '@angular/core';
import { CarouselComponent } from '../../shared/carousel/carousel.component';
import { CardsComponent } from "../../shared/cards/cards.component";

@Component({
  selector: 'app-home',
  imports: [CarouselComponent, CardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
