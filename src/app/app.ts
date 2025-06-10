import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AllProducts } from './components/all-products/all-products';
import { Header } from './layout/header/header';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'shoping-cart';
}
