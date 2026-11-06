# Neural Rhythm Generation

**Status:** Prototype. Pipeline built; model small and not benchmarked.
**Not:** a published model, a state-of-the-art claim, or a finished feature.

---

## What this is

An exploratory generative-music experiment: build a royalty-free MIDI groove pipeline,
normalise the patterns into a training set, train a small model, and use it to produce
genre-true rhythms for a learner-focused jazz backing app.

The interesting half is not the network. It is the dataset.

## The pipeline

```
royalty-free MIDI grooves
        │  collect + license-check
        ▼
   normalisation  (tempo, meter, quantisation, instrument mapping)
        ▼
   training set   (fixed-length pattern windows)
        ▼
   small model    (sequence generation over symbolic tokens)
        ▼
   generated grooves ──► jazz backing app (learner accompaniment)
```

Each arrow is a decision that constrains what the model can produce:

- **Normalisation** decides what "the same groove at a different tempo" means. Get it
  wrong and the model learns the recording, not the rhythm.
- **Windowing** decides what a "groove" is — one bar, four bars, a phrase. The model can
  only generate what the window shape allows.
- **Instrument mapping** decides whether the output is playable by a real backing band
  or just plausible as data.

## Why symbolic rather than audio

MIDI is a small-data problem. A modest model over symbolic tokens can produce usable
output from a corpus that would be hopeless for audio, and the result is editable — a
generated pattern can be corrected, transposed and re-arranged by a musician.

The trade-off: the output is rhythm and harmony, not timbre. For an accompaniment app
that is the right trade, but it means "sounds good" is partly a property of whatever
synthesiser renders it.

## What has been measured

> **TODO (Jide):** state the model family and parameter count.
> **TODO (Jide):** state the size of the training corpus (number of patterns, source).
> **TODO (Jide):** state how output was judged — by ear, by rating, by a comparison
> against held-out patterns.

Honest position today: **"genre-true" is currently a by-ear judgement.** There is no
baseline comparison — no test of whether the model beats sampling existing grooves, which
is the first bar any generative model should clear.

That comparison is cheap and it is the obvious next step.

## What is unresolved

- **The trivial baseline.** Does the model outperform resampling the corpus? Without this,
  "it generates new grooves" is not yet a claim about quality.
- **Evaluation that is not vibes.** Some proxy for musicality — a classifier trained to
  distinguish generated from real, or a small listening panel — is needed before any
  quality claim.
- **Licensing durability.** "Royalty-free" is a property of the source, and it needs to
  survive both training and redistribution of the output.
- **Repetition.** Sequence models collapse to the mode. Whether that is audible as
  sameness across a set is unknown.

## The honest summary

A complete pipeline from corpus to a generated artefact, integrated into a downstream
application. The network is deliberately small; the work is in the data preparation and
in the integration. It is a prototype, and it has not been evaluated against a baseline.
