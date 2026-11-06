# The Mechanism

**Date:** November 2026

---

## The data production loop

Every outcome in a reciprocal system passes through the same pipe:

```
policy π_t  ──►  exposure e   ──►  behaviour (message, reply, ignore)
    ▲                                        │
    └──────────  updated model  ◄────────────┘
```

Read it as three facts:

1. **Outcomes exist only where exposure happened.** An ignored person and an unshown
   person are different states, but both look like "no reply" if you only store
   outcomes.
2. **The policy chooses exposure using past outcomes.** So exposure is not random and
   not independent of the thing being measured.
3. **The policy's choices change the population it will later see.** Messages change
   behaviour; behaviour changes labels; labels change the next policy.

Written in the smallest honest notation:

- `c(u,v)` — true compatibility between two users (latent, never observed)
- `e(u,v) ∈ {0,1}` — whether the system showed `v` to `u`
- `r(u,v)` — did `v` reply, observed **only when e = 1**

The estimator sees `{(u, v, r) : e(u,v) = 1}` and is asked for `c`. Everything below
follows from that restriction.

## Failure mode 1 — Proxy substitution

**What it is.** We want `c` (compatibility, or interest). We measure `r` (reply rate).
They are not the same quantity, and the gap is not noise — it is systematic.

**Why it matters here.** Reply rate is contaminated by at least three things that have
nothing to do with the pair's compatibility:

- **Inbox load.** A user receiving 300 messages a week replies to a smaller fraction
  than one receiving 3, at identical interest.
- **Message quality distribution.** The messages she receives were produced under the
  same ranking, so their quality is a property of the policy.
- **Effort asymmetry.** Who messages first is itself modelled.

**The misread.** "Low reply rate → low desirability." The correct reading is "low reply
rate → this person is either uninterested, overloaded, or badly allocated", and the log
cannot distinguish them.

**The general lesson.** A proxy is chosen for availability, not for meaning. When a
proxy is also an *input to the policy*, it stops measuring the target and starts
measuring the system's own intervention.

## Failure mode 2 — Selection and exposure bias

**What it is.** The data is missing not at random, and the missingness is a decision.

Formally the estimator is asked for `E[r | u, v]` but can only compute
`E[r | u, v, e = 1]`. These are equal only under ignorability — when exposure is
independent of the outcome given the features. It is not: **the policy chose exposure
because it predicted a good outcome.** That is the policy's entire purpose.

So the selection rule is correlated with the label by construction. This is the textbook
definition of a biased sample, arranged deliberately.

**Its two visible symptoms.**

- **Position bias** — a candidate shown in rank 1 is clicked more than the same candidate
  in rank 20. The log records the click, not the position, unless you decided to record
  it.
- **Cold-start burial** — a new user with no history scores low, is shown rarely, and
  therefore never accumulates the history that would raise their score. The absence of
  evidence is treated as evidence of absence.

**The misread.** "We showed our best candidates and they performed best." You showed
them *because* the model expected them to perform; the observed performance is the
model grading its own homework.

**The fix that exists.** If exposure propensities are logged — the probability with which
each pair was shown — inverse propensity weighting can correct the estimate. This is why
the exposure columns matter more than the outcome columns, and why they are the first
thing everyone forgets to record.

## Failure mode 3 — The feedback loop

**What it is.** The model is not a passive observer. Deploying it changes the data that
will train its successor. This is "performative prediction": predictions alter the
distribution they predict.

**Three consequences, each worse than the last.**

1. **Entrenchment.** Early estimates become permanent. Whoever was ranked highly stays
   ranked highly because they keep being shown; whoever was buried stays buried because
   there is no data to contradict the burial.
2. **Homogenisation.** If everyone is shown the same top-k, everyone's attention
   concentrates there, and the system manufactures the popularity it then reports.
3. **Drift that looks like stability.** The model's accuracy can *improve* while the
   ecosystem degrades, because it is getting better at predicting outcomes under a policy
   that is becoming more extreme.

**The diagnostic.** Exposure concentration over time — a Gini coefficient on impressions.
A ranking system with no exploration should show it rising monotonically. That is a
measurable signature of a loop, and it is absent from any single-snapshot dataset.

**Why accuracy cannot see this.** Accuracy is computed on outcomes that exist. The people
the policy stopped showing have no outcomes, so their degradation is invisible to every
metric computed from the log.

## Failure mode 4 — From signal to judgement

**What it is.** The same behavioural feature can support a defensible policy or an
indefensible one, and the maths does not tell you which you have built.

| Policy | Signal | Reading |
|---|---|---|
| Demote accounts that message everyone identically | Low message diversity | Spam / bot. Defensible: harm to others |
| Demote accounts with a low reply rate | Few replies | Either a bot, or someone buried under a load they did not choose |
| Warn other users about an account | Low reply rate | Surfaces a judgement about a person to strangers |

The first is fraud detection. The second is ambiguous. The third is punishment with
extra steps. All three could be implemented with the same feature and the same model.

**The discriminating question.** I think there is a usable test, and it is the one thing
in this document I would most want to be argued with about:

> **Counterfactual stability.** Would this behaviour persist if the person had been
> allocated differently?

If the behaviour survives a change in exposure, it is plausibly a property of the
account. If it vanishes under a different allocation, it was manufactured by the system
and punishing it is punishing your own artefact. This is not observable in real data
without an experiment. In a simulator it is a direct measurement.

That question also gives the audit something concrete to report: not "this policy is
unfair", but "for this cohort, the behaviour driving the demotion does not survive a
counterfactual reallocation."

## The worked trace

The originating observation, passed through all four:

| Stage | What happens |
|---|---|
| Policy | The ranker predicts who will get replies, so it shows the already-popular |
| Exposure | Our user is shown to relatively few people, in low positions |
| Behaviour | She receives a small, low-quality, high-effort inbox and replies rarely |
| Proxy | Reply rate is recorded as a measure of *her* |
| Loop | The low rate lowers her predicted score; next round she is shown less |
| Judgement | The product surfaces a warning about her to other users |

At no point in that chain did anyone make an obviously wrong decision. Each step is
locally reasonable. The error is in the composite — and it is **invisible in any dataset
that records only the last column.**

## What honest evaluation would require

Ranked by strength, and by cost:

1. **Known exposure propensities.** Log the probability of showing each pair, per policy
   version. Enables correction; costs a column.
2. **Deliberate exploration.** Show a small random fraction so unshown pairs occasionally
   produce data. Enables correction without assuming propensities; costs some short-term
   quality.
3. **A specified generative process.** Generate the world, keep the truth, measure
   recovery. Enables *counterfactuals*; costs realism, and buys the ability to check the
   answer.

This thread uses (3) to demonstrate the failure of (nothing), and the correction of (1).
Real deployment would need (1) and (2). That gap is worth stating plainly rather than
glossing: a simulation proves the mechanism exists, not that it dominates in any
particular real system.

## The claim this study tests

> **C1.** An estimator trained on reciprocal interactions without exposure correction
> recovers the ranking policy's allocation bias rather than users' latent preferences,
> and its recovery error is signed — it will systematically *penalise* users whose true
> desirability is high but whose reply rate is depressed by load.
>
> **C2.** Applying that estimator as the ranking policy increases exposure concentration
> monotonically over rounds, independent of any change in the underlying population.

Both are falsifiable and both are measurable in doc 02's process. C1 is the one that
matters; C2 is the one that generalises.
