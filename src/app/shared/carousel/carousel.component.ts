import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // << ADICIONE ESTA LINHA
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  imports: [
    CommonModule,
    NgbCarouselModule]
})
export class CarouselComponent {
  images = [
    { src: 'https://www.clinicahumanita.com.br/wp-content/uploads/2022/07/vaidade-01-800x267.png', alt: 'Essenza' },
  ];

  showNavigationArrows = true;
  showNavigationIndicators = true;
  interval = 10000;
  pauseOnHover = true;
  wrap = true;
  keyboard = true;

  constructor() { }

}

