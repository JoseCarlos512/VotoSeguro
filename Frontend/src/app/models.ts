export interface Senator {
  name: string;
  region: string;
  focus: string[];
  term: string;
}

export interface Candidate {
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

export interface Party {
  id: string;
  name: string;
  color: string;
  candidateCount: number;
  senatorCount: number;
}
