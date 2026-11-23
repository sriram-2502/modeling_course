---
title: "First-Order Systems"
study: exam-1
number: '03'
unit: "Dynamic response and modeling foundations"
summary: "Use equilibria, time constants, phase lines, and linearization to predict first-order motion."
slides: /materials/lectures/lecture-03.pdf
notes: /materials/lectures/lecture-03-notes.pdf
lab: first-order
opening_questions:
  - 'Two systems settle at the same value. What determines which one gets there faster?'
  - 'How could you tell from a phase line whether a small disturbance will grow or fade?'
takeaways:
  - 'Find the equilibrium by setting the state derivative to zero for the fixed input.'
  - 'A stable first-order system completes about 63% of its change toward equilibrium in one time constant.'
  - 'Near an equilibrium of a scalar nonlinear system, a negative local slope attracts and a positive slope repels. A zero slope calls for another check.'
---

## Solve the constant-input model

For $$\dot{x}+ax=b$$ with constant $$b$$ and $$a>0$$, the equilibrium is $$x_e=b/a$$. Subtracting $$x_e$$ gives $$\frac{d}{dt}(x-x_e)=-a(x-x_e)$$. The response is

$$
x(t)=x_e+\bigl(x(0)-x_e\bigr)e^{-at}.
$$

The first term is the steady value and the exponential term is the transient.

The time constant $$\tau=1/a$$ is the time it takes the error to fall to $$1/e$$ of its initial value. One time constant therefore completes about 63% of the change to equilibrium. Larger $$\tau$$ means a slower response.

{% include lab.html id=page.lab %}

### Read a time constant from a measurement

Set the final value to one and start at zero. A measurement of 0.632 at 2 s suggests $$\tau=2$$ s. Check a second point: at 1 s the model predicts $$1-e^{-1/2}\approx0.393$$. Open the [two-second time-constant case](?case=slow#interactive-lab) and compare the numerical readout. If you repeated the measurement on a thermometer with a nonzero initial temperature, first subtract the initial reading and divide by the total rise.

## Phase lines and local linearization

For $$\dot{x}=f(x)$$, an equilibrium satisfies $$f(x_e)=0$$. Draw arrows to the right where $$f$$ is positive and to the left where $$f$$ is negative. Arrows pointing in on both sides indicate local attraction.

With $$\delta x=x-x_e$$, the linearization is $$\frac{d}{dt}\delta x\approx f'(x_e)\delta x$$. A negative derivative gives local asymptotic stability and a positive derivative gives instability. If the derivative is zero, inspect the nonlinear terms or the phase line.

<section class="worked-example" markdown="1">

### Worked example · Classify three equilibria

For $$\dot{x}=x-x^3$$, factor $$x(1-x^2)=0$$ to get equilibria at $$-1$$, $$0$$, and $$+1$$. The slope $$f'(x)=1-3x^2$$ is negative at $$\pm1$$ and positive at zero. Small disturbances decay near $$\pm1$$ and grow near zero.

</section>

[First-order practice examples (PDF)]({{ '/materials/lectures/examples-first-order.pdf' | relative_url }}) · [Linearization practice examples (PDF)]({{ '/materials/lectures/examples-linearization.pdf' | relative_url }})
