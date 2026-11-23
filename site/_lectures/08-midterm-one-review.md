---
title: "Exam 1 Review"
permalink: /lectures/08-exam-1-review/
legacy_lecture: /lectures/08-midterm-one-review/
study: exam-1
number: '08'
unit: "Dynamic response and modeling foundations"
summary: "Practice moving between ODEs, equilibria, Laplace transforms, and time responses."
slides: /materials/lectures/lecture-08.pdf
notes: /materials/lectures/lecture-08-notes.pdf
opening_questions:
  - 'Before solving a first-order equation, can you predict the initial direction and final value of the response?'
  - 'If you are given a measured force history and an impulse response, which solution method uses both directly?'
takeaways:
  - 'Write down the input, output, units, and initial conditions before choosing a method.'
  - 'Use equilibria and characteristic roots to predict the response. Use Laplace transforms for forced equations and convolution when the impulse response is given.'
  - 'Check the initial value, initial slope, and expected long-time behavior against the original equation.'
---

## Test yourself
{: #practice}

Try each problem on paper before opening the hint or solution.

### Predict the direction

A sensor starts above its steady reading. Sketch its stable first-order response to a constant input. Could it cross the steady value?

<details markdown="1"><summary>Hint</summary>

Write the error as $$e=x-x_e$$.

</details>

<details markdown="1"><summary>Check the reasoning</summary>

The error obeys $$\dot e=-e/\tau$$. Its sign stays positive, so the reading falls monotonically toward equilibrium. [Revisit the lecture example]({{ '/lectures/03-first-order-systems/#solve-the-constant-input-model' | relative_url }}).

</details>

### Calculate a response

A resting cart has $$\dot v+2v=u$$. A unit step is applied. Find the impulse response and use it to obtain the velocity at 1 s.

<details markdown="1"><summary>Hint</summary>

Take $$V/U$$ with zero initial velocity. Integrate the impulse response over the past second.

</details>

<details markdown="1"><summary>Check the reasoning</summary>

The impulse response is $$h(t)=e^{-2t}$$ for $$t\geq0$$. Its integral gives $$v(1)=(1-e^{-2})/2\approx0.432$$ in the chosen velocity units. [Revisit the lecture example]({{ '/lectures/06-convolution/#two-taps' | relative_url }}).

</details>

### Diagnose a damping claim

A classmate says a 1 kg cart with $$k=9$$ N/m and $$c=4$$ N·s/m must be overdamped because the damping coefficient exceeds one. What do the roots say?

<details markdown="1"><summary>Hint</summary>

Use $$c^2-4mk$$ or compute the dimensionless damping ratio.

</details>

<details markdown="1"><summary>Check the reasoning</summary>

The discriminant is $$16-36=-20$$. The poles are $$-2\pm j\sqrt5$$ per second and the motion is underdamped. The critical coefficient is 6 N·s/m. [Revisit the lecture example]({{ '/lectures/04-second-order-systems/#from-an-ode-to-its-roots' | relative_url }}).

</details>


## A modeling and analysis sequence

State the input, response, initial conditions, and units. For a first-order model, solve for its equilibrium and compare the initial state to that equilibrium. For a second-order model, derive the characteristic equation and classify its roots before solving for constants.

## Choose a solution route

Use the direct ODE method for free response or simple constant inputs. Use Laplace transforms when a forced input or initial conditions make the time-domain algebra less convenient. Use convolution when the impulse response and input history are known. Derive a transfer function under zero initial conditions, then apply the input separately.

## Check your result

<section class="worked-example" markdown="1">

### Worked example · Check a first-order response

For $$\dot{x}+3x=6$$ with $$x(0)=0$$, the equilibrium is $$2$$ and the time constant is $$1/3\,\mathrm{s}$$. Predict the sign of the initial slope before solving. The solution $$x(t)=2(1-e^{-3t})$$ begins at zero, has initial slope $$6$$, and approaches $$2$$.

</section>

For a nonlinear model, locate equilibria first and only then linearize about the equilibrium of interest.
