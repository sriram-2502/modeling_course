---
title: "Transfer Functions and Block Diagrams"
study: exam-2
number: '13'
unit: "Mechanical systems and stability"
summary: "Translate force balances into integrator blocks and trace the signals to an output."
slides: /materials/lectures/lecture-13.pdf
notes: /materials/lectures/lecture-13-notes.pdf
activity: signal-flow
opening_questions:
  - 'How do you get from net force to displacement using a gain and two integrators?'
  - 'Where do the spring and damper signals feed back into the diagram?'
takeaways:
  - 'Start with the highest derivative. For the mass, scale net force by the inverse mass, then integrate to get velocity and position.'
  - 'Return spring and damper forces to the summing junction with the signs given by the force balance.'
  - 'With zero initial conditions, the reduced diagram and the ODE give the same force-to-position transfer function.'
---

## Build from the highest derivative

For $$m\ddot{x}+c\dot{x}+kx=f$$, use a summing point to combine $$f$$, $$-c\dot{x}$$, and $$-kx$$. A gain $$1/m$$ gives acceleration. Integrate once to obtain velocity and again to obtain displacement. Return position and velocity through the spring and damper gains.

In the first diagram, follow the top row left to right. The lower summing junction adds the spring and damper terms, and the upper junction subtracts their sum from the applied force. A filled dot copies a signal into a branch. The blocks marked $$1/s$$ integrate under zero initial conditions.

<noscript>
{% include example-diagram.html id='transfer-integrators' %}
</noscript>

{% include activity.html id=page.activity %}

## Read the diagram as algebra

<section class="worked-example" markdown="1">

### Worked example · Reduce the feedback loop

The three forward blocks multiply to $$G=1/(ms^2)$$. Since $$V=sX$$, the two feedback branches combine to $$cV+kX=(cs+k)X$$. That makes $$H=cs+k$$. The input to the forward block is therefore $$F-HX$$, the force shown at the minus summing junction.

$$
\begin{aligned}
X&=G(F-HX),\\
(1+GH)X&=GF,\\
\frac{X}{F}&=\frac{G}{1+GH}=\frac{1}{ms^2+cs+k}.
\end{aligned}
$$

{% include example-diagram.html id='transfer-reduced' %}

</section>

For the simulation's 1 kg mass, 2.4 N·s/m damper and 16 N/m spring, a sustained 1 N step settles at $$1/16=0.0625$$ m. Both routes give the same answer: at rest, spring force balances the applied force, and the zero-frequency transfer gain is $$1/k$$. [Run the reduced diagram with the 1 N step](?case=reduced#interactive-lab).

At the last stage of the activity, the original integrator model and the reduced block give the same displacement for the same input.
