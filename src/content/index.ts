import type { ResearchItem } from '../types';

import apertureContext from './aperture/00-context-and-motivation.md?raw';
import apertureMechanism from './aperture/01-the-mechanism.md?raw';
import apertureDgp from './aperture/02-data-generating-process.md?raw';
import neural from './neural-rhythm-generation.md?raw';

// Curation note: these are the only two items that publish. Nothing else from the
// ideabox corpus appears here, by design — the drafts, strategy and personal folders
// are not public, and no material describing an application under IP review appears
// anywhere in this repository.
//
// The aperture docs are a copy of ideabox/research-aperture/, minus the trailing
// "## Next" block (which names local code paths and belongs to the working wiki, not
// to a reader).

export const items: ResearchItem[] = [
  {
    slug: 'when-the-model-learns-the-policy',
    title: 'When the Model Learns the Policy',
    tone: 'research',
    status: 'Specification — data-generating process frozen, no results',
    problem:
      'A ranking system learns from outcomes it produced itself. It chooses who to show, the showing creates the interaction, and the interaction becomes the label — so the model ends up treating its own allocation as a fact about people.',
    shape:
      'A specified simulation with known latent preferences, then a comparison of four estimators, to see which one recovers preference and which one merely recovers the policy’s bias.',
    why:
      'It separates two failures that are usually conflated — selection bias and confounding by inbox load — and predicts that neither correction works alone.',
    open:
      'Realism. The study can establish that a correction is necessary in a system of this shape; it cannot say how large the effect is in any particular product.',
    tags: ['Machine Learning', 'Recommenders', 'Exposure Bias', 'Simulation'],
    docs: [
      { title: 'Context and motivation', body: apertureContext },
      { title: 'The mechanism', body: apertureMechanism },
      { title: 'Data-generating process', body: apertureDgp },
    ],
    unavailable: 'No code yet — the simulator is specified and not built.',
  },
  {
    slug: 'neural-rhythm-generation',
    title: 'Neural Rhythm Generation',
    tone: 'prototype',
    status: 'Pipeline built — model small, not benchmarked',
    problem:
      'A learner-focused jazz backing app needs rhythm that sounds genre-true, and royalty-free groove data is harder to assemble than it is to find examples of.',
    shape:
      'A MIDI pipeline that normalises royalty-free patterns into a training set, then a small sequence model that generates new grooves for the backing app.',
    why:
      'Symbolic music is a small-data problem: a modest model can produce editable, playable output from a corpus that would be hopeless for audio. The hard part is the dataset, not the network.',
    open:
      'No baseline comparison and no formal evaluation. “Genre-true” is currently a by-ear judgement, and beating a resampling baseline is the obvious next test.',
    tags: ['Python', 'MIDI', 'Machine Learning', 'Music Generation'],
    docs: [{ title: 'Neural Rhythm Generation', body: neural }],
    unavailable: 'No public code repository yet.',
  },
];

export const itemsBySlug: Record<string, ResearchItem> = Object.fromEntries(
  items.map((item) => [item.slug, item]),
);
