import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

interface Senator {
  name: string;
  region: string;
  focus: string[];
  term: string;
}

interface Candidate {
  id: string;
  name: string;
  partyId: string;
  partyName: string;
  runningFor: string;
  bio: string;
  priorities: string[];
  experience: string[];
  runningMate: string;
  senators: Senator[];
  vicepresidentes: Senator[];
  initials: string;
}

interface Party {
  id: string;
  name: string;
  color: string;
  candidateCount: number;
  senatorCount: number;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly apiUrl = 'http://localhost:5245/api/jne/candidatos';

  protected readonly electionYear = 2026;
  protected readonly candidates = signal<Candidate[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly searchTerm = signal('');
  protected readonly partyFilter = signal('');
  protected readonly senatorFilter = signal('');
  protected readonly selectedCandidateId = signal('');
  protected readonly confirmVote = signal(false);

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  protected readonly parties = computed<Party[]>(() => {
    const map = new Map<string, Party>();

    this.candidates().forEach((candidate) => {
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

  protected readonly partyOptions = computed(() =>
    this.parties().map((party) => ({
      id: party.id,
      name: party.name,
    }))
  );

  protected readonly senatorOptions = computed(() => {
    const names = new Set<string>();
    this.candidates().forEach((candidate) => {
      candidate.senators?.forEach((senator) => names.add(senator.name));
    });
    return Array.from(names).sort();
  });

  protected readonly filteredCandidates = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const party = this.partyFilter();
    const senator = this.senatorFilter();

    return this.candidates().filter((candidate) => {
      const partyName = candidate.partyName || '';
      const matchesTerm =
        !term ||
        candidate.name.toLowerCase().includes(term) ||
        candidate.bio?.toLowerCase().includes(term) ||
        partyName.toLowerCase().includes(term);

      const matchesParty = !party || candidate.partyId === party;
      const matchesSenator =
        !senator || candidate.senators?.some((member) => member.name === senator);

      return matchesTerm && matchesParty && matchesSenator;
    });
  });

  protected readonly selectedCandidate = computed(() =>
    this.candidates().find((candidate) => candidate.id === this.selectedCandidateId())
  );

  protected partyById(partyId: string): Party | undefined {
    return this.parties().find((party) => party.id === partyId);
  }

  protected selectCandidate(candidateId: string): void {
    this.selectedCandidateId.set(candidateId);
    this.confirmVote.set(false);
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.partyFilter.set('');
    this.senatorFilter.set('');
  }

  private loadCandidates(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<Candidate[]>(this.apiUrl, {
        params: {
          idProcesoElectoral: '124',
          strUbiDepartamento: '',
        },
      })
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : [];
          this.candidates.set(list);
          if (list.length > 0 && !this.selectedCandidateId()) {
            this.selectedCandidateId.set(list[0].id);
          }
        },
        error: () => {
          this.error.set('No se pudo cargar la informacion desde el backend.');
          this.candidates.set([]);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
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
