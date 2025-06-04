import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AllProducts } from './components/all-products/all-products';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, AllProducts],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'shoping-cart';
}
