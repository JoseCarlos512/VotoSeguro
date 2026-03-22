import { Routes } from '@angular/router';
import { PartyListComponent } from './pages/party-list/party-list.component';
import { PartyDetailComponent } from './pages/party-detail/party-detail.component';
import { VotingGuideComponent } from './pages/voting-guide/voting-guide.component';

export const routes: Routes = [
  { path: '', component: PartyListComponent },
  { path: 'guia', component: VotingGuideComponent },
  { path: 'partido/:partyId', component: PartyDetailComponent },
  { path: '**', redirectTo: '' },
];
