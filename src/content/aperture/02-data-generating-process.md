# Data-Generating Process

**Date:** November 2026
**Status:** Specification. **Frozen before the estimator exists.**
**Version:** DGP v1

---

## Why this document comes first

If I write the simulator and the estimator together, I will build a world that my method
already solves and then report success. That is the failure mode this document exists to
prevent.

So: the process below is specified, frozen and committed **before** any estimation code
is written. Changes after freezing require an entry in `decisions.md` and a full re-run —
because a parameter chosen after seeing results is a parameter chosen to fit them.

## Design constraint: what the model must be able to show

The process must produce, without being told to:

1. **Concentrated attention** — a ranking policy that reinforces itself.
2. **A load effect** — reply probability falling as a user's inbox grows, so that reply
   rate is *not* a clean measure of desirability.
3. **Selection** — outcomes existing only for shown pairs.
4. **A clean ablation** — a single parameter that, when set to zero, removes the bias.
   Without this I cannot tell a finding from a bug.

Point 4 is the most important and the easiest to forget. The evidence is not "the naive
method failed"; it is "**the naive method failed, and stopped failing when I switched the
mechanism off.**"

## Entities

Symmetric population, `N` users. No gender, no demographics, no geography, no profiles,
no text.

> Deliberate: the object of study is *allocation*, not people. A symmetric population
> makes it structurally impossible to produce a claim about a real group, which is both
> an ethical constraint and a modelling simplification I am happy to pay for.

Each user `i` has three latent traits, drawn once and never observed by the estimator:

| Trait | Symbol | Distribution | Meaning |
|---|---|---|---|
| Desirability | `d_i` | `N(0, 1)` | How much others want to engage with them |
| Selectivity | `s_i` | `N(0, 1)` | Their threshold for engaging at all |
| Activity | `a_i` | `Poisson(3)` | Messages they attempt per round, capped at `k` |

Pair-level affinity:

```
A(i, j) = α · (d_i + d_j) / 2 + σ_pair · ε_ij        ε_ij ~ N(0, 1)
```

Pair noise matters: without it, ranking is trivially solvable and the estimator has
nothing to be wrong about.

## Dynamics — one round

```
for each round t in 1..R:
    for each active viewer i:
        candidates = π_t(i)                    # top-k from policy, or random in warm-up
        log every (i, candidate, position, propensity, policy_version)
        for each shown candidate j (in order, subject to a_i budget):
            if σ(κ · (A(i,j) − s_i)) > U:      # i decides to message j
                messages_j += 1                # j's load increments
                L_j = messages_j[this round]   # load is observed
                if σ(λ · (A(i,j) − t_j) − γ · log(1 + L_j)) > U:
                    reply                        # observed, and only for shown pairs
    update estimators from the round's log
    π_{t+1} = policy fitted on all data so far
```

Three details carry the whole argument:

- **`γ · log(1 + L_j)`** — reply probability falls with inbox load, *for a fixed pair
  affinity*. A desirable user who is flooded replies less often than a less desirable
  user with a quiet inbox. This is the confounding term.
- **`L_j` is a function of exposure**, and exposure is chosen by the policy. So the
  confounder is created by the system being measured.
- **The estimator only ever sees rows where a message and a reply exist.** Unshown pairs
  produce nothing.

## Parameters

| Symbol | Meaning | v1 default | Swept |
|---|---|---|---|
| `N` | users | 2,000 | 500, 5,000 |
| `R` | rounds | 30 | 10, 100 |
| `k` | candidates shown per viewer per round | 10 | — |
| `α` | desirability weight in affinity | 1.0 | — |
| `σ_pair` | pair noise | 1.0 | — |
| `κ` | selectivity sharpness | 1.0 | — |
| `λ` | reply sharpness | 1.0 | — |
| **`γ`** | **load penalty on reply** | **0.5** | **0.0 (ablation)**, 0.25, 1.0 |
| `t_j` | reply threshold | 0.0 | — |
| `B` | attention budget: replies per round | 20 | — |
| `ε` | exploration rate | 0.10 | 0.0, 0.05, 0.30 |
| `R0` | warm-up rounds with uniform random exposure | 3 | 0, 3, 10 |

`γ = 0` is the **ablation control**. It is not a variant of the experiment; it is the
experiment's validity check. Every result is reported next to it.

## What the log records

The point of the schema is that **exposure columns matter more than outcome columns**,
because they are the ones that make correction possible and the ones everyone forgets.

Per impression:

| Field | Type | Why |
|---|---|---|
| `round` | int | Ordering; loop dynamics |
| `viewer_id` | id | Pair identity |
| `candidate_id` | id | Pair identity |
| `position` | int | Position bias; not recoverable later |
| `propensity` | float | Probability this pair was shown. Enables correction |
| `policy_version` | str | Mixing policies across rounds invalidates aggregation |
| `exposure_type` | enum | `exploit` / `exploration` — separates the two regimes |
| `messaged` | bool | Behaviour 1 |
| `replied` | bool | Behaviour 2 — **null when not shown, which is the whole problem** |

Per user per round: `messages_received`, `messages_sent`, `replies_sent`, `load`.

Available to the **estimator** (the "observable features"): `messages_received`,
`reply_rate`, `is_new`. **Never** `d_i`, `s_i`, `A(i,j)`, `γ`, `L_j`.

That last line is the integrity boundary of the whole study. If the estimator touches a
latent, the recovery measurement is meaningless.

## The estimator's task

Given the log, produce a score per user that orders them by `d_i`. Then two checks:

1. **Recovery** — Spearman `ρ` between estimated score and true `d_i`. Rank correlation,
   because only the ordering matters for ranking.
2. **Signed error** — mean error in the top decile of true `d_i`. This is where the
   prediction lives: the bias should not be symmetric. It should *penalise the top*,
   because the top is where load is highest.

Four estimator variants, in this order:

| Variant | Uses | Tests |
|---|---|---|
| **E0** naive | `reply_rate` + `messages_received` | The heuristic a real system would ship |
| **E1** + propensity weighting | E0 + `1/propensity` | Does fixing *selection* alone work? |
| **E2** + load conditioning | E0 + load as covariate | Does fixing *confounding* alone work? |
| **E3** both | E1 + E2 | The honest method |

E1 and E2 are separated deliberately. They address two different problems, and the
interesting result is that **neither alone is sufficient** — selection and confounding are
not the same bug, and a single correction is a single blind spot.

## Pre-registered predictions

Written before the code runs. Wrong predictions are findings, not embarrassments.

| # | Prediction | If false |
|---|---|---|
| **P0** | At `γ = 0`, E0 recovers `d` well (`ρ > 0.80`) | The DGP is broken or the ablation is not isolating the mechanism |
| **P1** | At `γ = 0.5`, E0's `ρ` collapses (`< 0.30`) | The load effect is too weak — raise `γ`, document the change, re-run |
| **P2** | E0's error is **signed**: top-decile `d` systematically underestimated | The proxy failure is symmetric noise, which is a different (weaker) claim |
| **P3** | E1 alone: `ρ` improves but stays `< 0.60` | Selection was the only real problem and I was wrong about confounding |
| **P4** | E2 alone: `ρ` improves but stays `< 0.60` | Confounding was the only real problem |
| **P5** | E3: `ρ > 0.75` | The two corrections do not compose — the most interesting possible outcome, and the one I would least expect |
| **P6** | Impression Gini rises monotonically over rounds at `ε = 0`, and flattens as `ε` increases | There is no feedback loop in this process, so C2 is vacuous |
| **P7** | Users demoted by E0 do not exhibit the demoting behaviour under counterfactual random reallocation | The behaviour *is* a property of the account, and demotion is defensible |

P5 and P7 are the ones I would actually be excited to be wrong about. P5 failing would
mean there is a third mechanism I have not named. P7 failing would mean the ethical
argument in doc 01 is weaker than I think.

## Falsification conditions

The study is falsified — and reported as such — if:

1. **P0 fails.** `γ = 0` still produces bias. Then the DGP does something I do not
   understand, and no later result can be trusted. Stop; redesign; document.
2. **P1 fails and cannot be recovered by raising `γ` within a plausible range.** Then the
   mechanism does not dominate, and "exposure bias matters here" is not supported.
3. **P6 fails.** No loop → doc 01's failure mode 3 is not present in this process, and
   only failure mode 2 (selection) survives.

A negative result is a result. What is not acceptable is adjusting the DGP until the
prediction comes true without saying so — which is why changes go in `decisions.md` with
the re-run that followed.

## Deliberately excluded

And why each exclusion does not undermine the claim:

| Excluded | Why it is safe to drop |
|---|---|
| Photos, profile text, message content | The claim is about *allocation dynamics*, which operate identically on any affinity signal |
| Demographics, gender, geography | Keeps every claim structural rather than about a group. A symmetric population cannot produce a demographic finding |
| Harassment, safety, reporting flows | Real and important, but a different study with different ethics |
| Real users, real services, scraped data | Non-negotiable. No consent, and none of the claims require it |
| Multi-app behaviour, life events, churn | Out of scope for v1; noted in open questions |

**The residual threat to validity, stated plainly:** this models a mechanism, not a
population. It can establish that a correction is *necessary* in a system of this shape.
It cannot establish how large the effect is in any particular real product, because that
depends on that product's parameters — which is precisely what the exposure log would
tell you.

## Implementation notes (no code yet)

- Everything is deterministic under a seeded RNG. `seed` is a parameter and is logged.
- The log is append-only; the estimator reads it as data, never as live state.
- Truth (`d_i`, `A(i,j)`) is written to a separate file the estimator process does not
  read. Enforced by path, not by discipline.
- The audit report (doc 05) consumes the same log.
