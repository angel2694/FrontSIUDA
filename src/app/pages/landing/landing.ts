import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  currentIndex = 0;

  slides = ['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg'];

  titles = [
    'Gestión eficiente de recursos',
    'Control y transparencia',
    'Innovación en logística'
  ];

  descriptions = [
    'Optimiza tus procesos de abastecimiento',
    'Supervisión completa de adquisiciones',
    'Modernizamos la gestión pública'
  ];

  modalOpen = false;

  form = { nombre: '', correo: '', mensaje: '' };

  constructor(private sanitizer: DomSanitizer) {}

  getSlideStyle(img: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${img})`);
  }

  ngOnInit() {
    setInterval(() => this.nextSlide(), 15000);

    window.addEventListener('scroll', () => {
      document.querySelectorAll('.fade-in').forEach((el: any) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
          el.classList.add('show');
        }
      });
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  openModal() { this.modalOpen = true; }
  closeModal() { this.modalOpen = false; }

  enviar() {
    alert('Mensaje enviado correctamente');
    this.closeModal();
  }
}
