import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CandidatesService } from '../../services/candidates.service';
import { Candidate } from '../../models';

@Component({
  selector: 'app-party-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './party-detail.component.html',
  styleUrl: './party-detail.component.scss',
})
export class PartyDetailComponent implements OnInit, OnDestroy {
  private readonly partyId = signal('');
  private routeSub?: Subscription;

  protected readonly candidate = computed<Candidate | undefined>(() => {
    const partyId = this.partyId();
    if (!partyId) {
      return undefined;
    }
    return this.candidatesService
      .candidates()
      .find((item) => item.partyId === partyId);
  });

  constructor(
    protected readonly candidatesService: CandidatesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.candidatesService.load();
    this.partyId.set(this.route.snapshot.paramMap.get('partyId') ?? '');
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.partyId.set(params.get('partyId') ?? '');
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  protected goBack(): void {
    this.router.navigate(['/']);
  }
}
