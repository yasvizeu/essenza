import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';
import { Cardcorporal } from './shared/cardcorporal/cardcorporal';
import { Cardfacial } from './shared/cardfacial/cardfacial';
import { Cardmassagem } from './shared/cardmassagem/cardmassagem';
import { Detalhamento } from './components/detalhamento/detalhamento';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, Home, Cardcorporal, Cardfacial,Cardmassagem , Detalhamento],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('essenza-Tela-de-Tratamento');
}
