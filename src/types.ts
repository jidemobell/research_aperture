export type ItemTone = 'exploration' | 'research' | 'prototype';

export interface Doc {
  title: string;
  body: string;
}

export interface ResearchItem {
  slug: string;
  title: string;
  tone: ItemTone;
  /** Reader-facing status, e.g. "Specification — no results". */
  status: string;
  problem: string;
  shape: string;
  why: string;
  open: string;
  tags: string[];
  docs: Doc[];
  link?: { label: string; href: string };
  /** Shown when there is deliberately no link to give. */
  unavailable?: string;
}
