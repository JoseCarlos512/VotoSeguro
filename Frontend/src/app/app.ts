import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
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

interface Party {
  id: string;
  name: string;
  ideology: string;
  slogan: string;
  color: string;
  leader: string;
  founded: number;
}

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
  runningFor: string;
  bio: string;
  priorities: string[];
  experience: string[];
  runningMate: string;
  senators: Senator[];
  initials: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
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
export class App {
  protected readonly electionYear = 2026;

  protected readonly parties: Party[] = [
    {
      id: 'renova',
      name: 'Renovacion Ciudadana',
      ideology: 'Centro reformista',
      slogan: 'Gestion que se siente en cada barrio.',
      color: '#007C9D',
      leader: 'Valeria Sosa',
      founded: 2008,
    },
    {
      id: 'verde',
      name: 'Pacto Verde Nacional',
      ideology: 'Progresista y ambiental',
      slogan: 'Crecimiento limpio, futuro seguro.',
      color: '#2F855A',
      leader: 'Tomas Echevarria',
      founded: 2012,
    },
    {
      id: 'alianza',
      name: 'Alianza por el Trabajo',
      ideology: 'Socialdemocrata',
      slogan: 'Trabajo digno, desarrollo real.',
      color: '#C05621',
      leader: 'Marcela Quiroz',
      founded: 1995,
    },
    {
      id: 'futuro',
      name: 'Futuro y Libertad',
      ideology: 'Liberal moderno',
      slogan: 'Innovacion con libertad y reglas claras.',
      color: '#6B46C1',
      leader: 'Diego Montalvo',
      founded: 2016,
    },
  ];

  protected readonly candidates: Candidate[] = [
    {
      id: 'cand-1',
      name: 'Sofia Carrasco',
      partyId: 'renova',
      runningFor: 'Presidencia',
      bio: 'Ex ministra de desarrollo social, lidera un plan de seguridad barrial y digitalizacion de servicios publicos.',
      priorities: ['Seguridad ciudadana', 'Gobierno digital', 'Obras locales'],
      experience: ['Ex Ministra de Desarrollo Social', 'Alcaldesa de Santa Lucia', 'Directora de ONG Vecinal'],
      runningMate: 'Andres Huaman',
      senators: [
        {
          name: 'Lucia Paredes',
          region: 'Costa Norte',
          focus: ['Seguridad comunitaria', 'Prevencion juvenil'],
          term: '2018-2026',
        },
        {
          name: 'Martin Ibarra',
          region: 'Centro',
          focus: ['Modernizacion del Estado', 'Transparencia'],
          term: '2020-2026',
        },
      ],
      initials: 'SC',
    },
    {
      id: 'cand-2',
      name: 'Gabriel Rojas',
      partyId: 'verde',
      runningFor: 'Presidencia',
      bio: 'Economista ambiental, impulsa una transicion energetica justa con empleo verde para las regiones.',
      priorities: ['Transicion energetica', 'Empleo verde', 'Agua segura'],
      experience: ['Director de Fondo Climatico', 'Profesor universitario', 'Consultor en energia limpia'],
      runningMate: 'Elena Cortes',
      senators: [
        {
          name: 'Paula Rojas',
          region: 'Selva Alta',
          focus: ['Proteccion de cuencas', 'Economia forestal'],
          term: '2019-2026',
        },
        {
          name: 'Hector Salinas',
          region: 'Altiplano',
          focus: ['Agricultura sostenible', 'Riego tecnificado'],
          term: '2022-2026',
        },
      ],
      initials: 'GR',
    },
    {
      id: 'cand-3',
      name: 'Mariana Ponce',
      partyId: 'alianza',
      runningFor: 'Presidencia',
      bio: 'Abogada laboralista, propone un pacto productivo con formacion tecnica y salud primaria.',
      priorities: ['Empleo formal', 'Salud primaria', 'Educacion tecnica'],
      experience: ['Congresista 2 periodos', 'Negociadora de reforma laboral', 'Defensora publica'],
      runningMate: 'Jorge Lazo',
      senators: [
        {
          name: 'Rocio Zegarra',
          region: 'Litoral',
          focus: ['Industria pesquera', 'Formacion dual'],
          term: '2017-2026',
        },
        {
          name: 'Esteban Quispe',
          region: 'Sierra Sur',
          focus: ['Salud comunitaria', 'Infraestructura vial'],
          term: '2021-2026',
        },
      ],
      initials: 'MP',
    },
    {
      id: 'cand-4',
      name: 'Ricardo Almeida',
      partyId: 'futuro',
      runningFor: 'Presidencia',
      bio: 'Empresario tecnologico, enfocado en inversion privada, talento digital y regulacion simple.',
      priorities: ['Inversion productiva', 'Talento digital', 'Reforma regulatoria'],
      experience: ['CEO de startup regional', 'Presidente de gremio empresarial', 'Mentor de emprendimientos'],
      runningMate: 'Camila Soto',
      senators: [
        {
          name: 'Carolina Lujan',
          region: 'Metropolitana',
          focus: ['Innovacion publica', 'Datos abiertos'],
          term: '2020-2026',
        },
        {
          name: 'Bruno Medina',
          region: 'Norte Chico',
          focus: ['Infraestructura logistica', 'Competitividad'],
          term: '2018-2026',
        },
      ],
      initials: 'RA',
    },
  ];

  protected readonly searchTerm = signal('');
  protected readonly partyFilter = signal('');
  protected readonly senatorFilter = signal('');
  protected readonly selectedCandidateId = signal(this.candidates[0]?.id ?? '');
  protected readonly confirmVote = signal(false);

  protected readonly partyOptions = computed(() =>
    this.parties.map((party) => ({
      id: party.id,
      name: party.name,
    }))
  );

  protected readonly senatorOptions = computed(() => {
    const names = new Set<string>();
    this.candidates.forEach((candidate) => {
      candidate.senators.forEach((senator) => names.add(senator.name));
    });
    return Array.from(names).sort();
  });

  protected readonly filteredCandidates = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const party = this.partyFilter();
    const senator = this.senatorFilter();

    return this.candidates.filter((candidate) => {
      const partyInfo = this.partyById(candidate.partyId);
      const matchesTerm =
        !term ||
        candidate.name.toLowerCase().includes(term) ||
        candidate.bio.toLowerCase().includes(term) ||
        partyInfo?.name.toLowerCase().includes(term);

      const matchesParty = !party || candidate.partyId === party;
      const matchesSenator =
        !senator || candidate.senators.some((member) => member.name === senator);

      return matchesTerm && matchesParty && matchesSenator;
    });
  });

  protected readonly selectedCandidate = computed(() =>
    this.candidates.find((candidate) => candidate.id === this.selectedCandidateId())
  );

  protected partyById(partyId: string): Party | undefined {
    return this.parties.find((party) => party.id === partyId);
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
}
