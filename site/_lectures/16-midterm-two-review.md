---
title: "Exam 2 Review"
permalink: /lectures/16-exam-2-review/
legacy_lecture: /lectures/16-midterm-two-review/
study: exam-2
number: '16'
unit: "Mechanical systems and stability"
summary: "Practice converting mechanical models into state equations, block diagrams, and transfer functions."
slides: /materials/lectures/lecture-16.pdf
notes: /materials/lectures/lecture-16-notes.pdf
opening_questions:
  - 'On a two-mass free-body diagram, how can you catch a wrong sign on a spring or damper force?'
  - 'Starting from a mechanical ODE, how would you check that your block diagram and transfer function describe the same system?'
takeaways:
  - 'Use separate free-body diagrams, shared sign conventions, and explicit relative displacements and velocities.'
  - 'Choose states from the dynamics, write the measured output, and set initial conditions to zero when deriving a transfer function.'
  - 'Check a stability claim by matching the eigenvalues, the shape of the phase portrait, and the time response near the same equilibrium.'
---

## Test yourself
{: #practice}

Try each problem on paper before opening the hint or solution.

### Predict a force pair

The wheel moves upward while the body is momentarily stationary. Both springs are at equilibrium length. Which way does the suspension damper push the body?

<details markdown="1"><summary>Hint</summary>

Sketch the two attachment velocities. The damper resists their relative motion.

</details>

<details markdown="1"><summary>Check the reasoning</summary>

It pushes the body upward and the wheel downward. Adding the two mass balances cancels this internal force. [Revisit the lecture example]({{ '/lectures/14-coupled-systems/#follow-one-force-onto-both-bodies' | relative_url }}).

</details>

### Change the states

For $$m\ddot x+c\dot x+kx=F$$ use position and momentum $$p=m\dot x$$ as states. What is the speed output?

<details markdown="1"><summary>Hint</summary>

Start with the definitions of speed and rate of momentum.

</details>

<details markdown="1"><summary>Check the reasoning</summary>

The state equations are $$\dot x=p/m$$ and $$\dot p=F-kx-cp/m$$. A speed sensor measures $$y=p/m$$. Changing the state coordinates preserves the physical poles. [Revisit the lecture example]({{ '/lectures/11-springs-and-state-space/#from-an-ode-to-state-equations' | relative_url }}).

</details>

### Diagnose a feedback sign

A plant $$1/(s+2)$$ feeds its output through gain $$K$$ to a negative summing input. A classmate writes the pole as $$K-2$$. Check the sign and find the stable gain range.

<details markdown="1"><summary>Hint</summary>

Call the external input $$r$$. Write one equation at the summer before reducing the loop.

</details>

<details markdown="1"><summary>Check the reasoning</summary>

From $$(s+2)Y=R-KY$$, the denominator is $$s+2+K$$. Its pole is $$-(2+K)$$ and decay requires $$K>-2$$. [Revisit the lecture example]({{ '/lectures/13-transfer-functions-and-diagrams/#read-the-diagram-as-algebra' | relative_url }}).

</details>


## Mechanical modeling checks

Draw separate free-body diagrams. Keep spring forces tied to relative displacement and damper forces tied to relative velocity. Where rotating components are linked to translating components, apply the kinematic constraint before eliminating unknown forces or torques.

## Change the system representation

Choose states that determine future behavior with the input. Write the output equation after the state equations. For block diagrams, start with the highest derivative and integrate to recover the states. For a transfer function, select one input and one output and impose zero initial conditions.

<section class="worked-example" markdown="1">

### Worked example · Check the same model two ways

For a 1 kg cart with a 2 N·s/m damper and no spring, the velocity equation is $$\dot v=F-2v$$. Its state eigenvalue is $$-2\,\mathrm{s}^{-1}$$. Transforming from rest gives $$V/F=1/(s+2)$$, with a pole at the same location. Both predict that free velocity decays with a time constant of 0.5 s.

</section>

## Explain stability

Find the equilibrium and linearize when the model is nonlinear. Use eigenvalues and phase portraits together to explain how small perturbations move. Compare the result with the time response and check whether the stated equilibrium and initial conditions match the problem.
