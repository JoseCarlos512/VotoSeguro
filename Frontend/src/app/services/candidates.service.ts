import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Candidate } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private readonly apiUrl = 'http://localhost:5245/api/jne/candidatos';
  private loaded = false;

  readonly candidates = signal<Candidate[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  load(): void {
    if (this.loaded || this.loading()) {
      return;
    }

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
          this.loaded = true;
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
}
