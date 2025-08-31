import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss'
})
export class CarouselComponent implements OnInit, AfterViewInit {
  public currentSlide = 0;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  private initializeCarousel(): void {
    // Aguardar um pouco para o DOM estar pronto
    setTimeout(() => {
      const carouselElement = document.getElementById('carouselExampleCaptions');
      if (carouselElement) {
        // Adicionar evento para detectar mudança de slide
        carouselElement.addEventListener('slid.bs.carousel', (event: any) => {
          this.currentSlide = event.to;
        });
      }
    }, 100);
  }

  public isActiveSlide(slideIndex: number): boolean {
    return this.currentSlide === slideIndex;
  }
}
