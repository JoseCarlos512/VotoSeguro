import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CandidatesService } from '../../services/candidates.service';
import { Party } from '../../models';

@Component({
  selector: 'app-party-list',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './party-list.component.html',
  styleUrl: './party-list.component.scss',
})
export class PartyListComponent implements OnInit {
  protected readonly searchTerm = signal('');

  constructor(
    protected readonly candidatesService: CandidatesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.candidatesService.load();
  }

  protected readonly parties = computed<Party[]>(() => {
    const map = new Map<string, Party>();

    this.candidatesService.candidates().forEach((candidate) => {
      const existing = map.get(candidate.partyId);
      if (existing) {
        existing.candidateCount += 1;
        existing.senatorCount += candidate.senators?.length ?? 0;
      } else {
        map.set(candidate.partyId, {
          id: candidate.partyId,
          name: candidate.partyName || this.titleFromSlug(candidate.partyId),
          color: this.colorFromString(candidate.partyId),
          candidateCount: 1,
          senatorCount: candidate.senators?.length ?? 0,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  protected readonly filteredParties = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.parties();
    }

    return this.parties().filter((party) => party.name.toLowerCase().includes(term));
  });

  protected openParty(partyId: string): void {
    this.router.navigate(['/partido', partyId]);
  }

  private colorFromString(value: string): string {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = value.charCodeAt(index) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 55%, 45%)`;
  }

  private titleFromSlug(slug: string): string {
    return slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
