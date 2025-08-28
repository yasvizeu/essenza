import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Cardcorporal } from './shared/cardcorporal/cardcorporal';
import { Cardfacial } from './shared/cardfacial/cardfacial';
import { Cardmassagem } from './shared/cardmassagem/cardmassagem';
import {Detalhamento} from './components/detalhamento/detalhamento';



export const routes: Routes = [
    {
        path: "home", component: Home
    },
    {
        path: "cardcorporal", component: Cardcorporal
    },
    {
       path:"cardfacial", component: Cardfacial
    },
    {
        path:"cardmassagem", component: Cardmassagem
    },
    {
        path:"detalhes/:id", component: Detalhamento
    },
];
