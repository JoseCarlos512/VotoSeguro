import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voting-guide',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './voting-guide.component.html',
  styleUrl: './voting-guide.component.scss',
})
export class VotingGuideComponent {
  constructor(private readonly router: Router) {}

  protected goBack(): void {
    this.router.navigate(['/']);
  }
}
