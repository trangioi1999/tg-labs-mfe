export interface Experiment {
  slug: string;
  title: string;
  summary: string;
  status: 'live' | 'planned';
}

export const EXPERIMENTS: readonly Experiment[] = [
  { slug: 'signals-lab', title: 'Signals Lab', summary: 'Watch signal, computed and effect react to each other in real time.', status: 'live' },
  { slug: 'federation-inspector', title: 'Federation Inspector', summary: 'Visualise the import map and shared dependencies of the running Shell.', status: 'planned' },
  { slug: 'rxjs-marbles', title: 'RxJS Marbles', summary: 'Interactive marble diagrams for common operators.', status: 'planned' },
];
