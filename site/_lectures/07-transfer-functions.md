---
title: "Transfer Functions and Stability"
study: exam-1
number: '07'
unit: "Dynamic response and modeling foundations"
summary: "Derive an input-to-output transfer function and use its poles to interpret the response."
slides: /materials/lectures/lecture-07.pdf
notes: /materials/lectures/lecture-07-notes.pdf
activity: step-impulse
opening_questions:
  - 'How does measuring velocity instead of displacement change a force-to-output transfer function?'
  - 'What changes immediately when the same mass receives an ideal force impulse?'
takeaways:
  - 'A transfer function relates a chosen input and output with the initial conditions set to zero.'
  - 'For a proper rational transfer function, bounded-input bounded-output stability requires all poles of the reduced function to lie in the open left half-plane.'
  - 'A finite impulse area changes the mass’s momentum instantly. Its position stays continuous across the tap.'
---

## Pick the input and output first

A transfer function is the ratio of a chosen output transform to a chosen input transform when the system starts from rest. Once you know the block $$G(s)$$, you can use it with different inputs through $$Y(s)=G(s)U(s)$$.

{% include example-diagram.html id='transfer-outputs' %}

Take the Laplace transform of $$m\ddot{x}+c\dot{x}+kx=f$$ with zero initial displacement and velocity. Group the terms multiplying $$X(s)$$, then divide by the force input.

$$
\begin{aligned}
(ms^2+cs+k)X(s)&=F(s),\\
\frac{X(s)}{F(s)}&=\frac{1}{ms^2+cs+k},&
\frac{V(s)}{F(s)}&=\frac{s}{ms^2+cs+k}.
\end{aligned}
$$

The velocity block uses $$V(s)=sX(s)$$ because the initial position is zero. For the two outputs drawn here, the numerator changes while the denominator stays the same. [Trace how the spring and damper produce that denominator]({{ '/lectures/13-transfer-functions-and-diagrams/' | relative_url }}).

## Connect poles to modes

After reducing the rational expression, the roots of the denominator are its poles. A pole on the negative real axis gives a decaying exponential, and a conjugate pair with negative real parts gives decaying oscillation. For a proper rational transfer function, bounded-input bounded-output stability requires all poles to lie strictly in the open left half-plane. A canceled mode can still matter internally, so check the state model when internal stability is the question.

The push and tap below use fixed mass, stiffness, and damping. In [Second-Order Systems]({{ '/lectures/04-second-order-systems/#build-a-massspringdamper-model' | relative_url }}), change those parameters to see how the model’s poles move.

## Add the input

The type of input determines what you multiply the same block by. A force step of magnitude $$F_0$$ gives $$F(s)=F_0/s$$. An ideal impulse of area $$J$$ gives $$F(s)=J$$. In both cases, compute $$X(s)=[X(s)/F(s)]F(s)$$.

<section class="worked-example" markdown="1">

### Worked example · Check the final displacement

At rest, both acceleration and velocity are zero. The spring balances the applied force, so the final displacement is $$F_0/k$$. A 1 N push on a 16 N/m spring gives $$1/16=0.0625\,\mathrm{m}$$, or 62.5 mm.

</section>

An ideal impulse with area $$J$$ transfers momentum without an instantaneous change in position. Integrating the force balance across the tap gives $$m[v(0^+)-v(0^-)]=J$$. After the tap, the mass moves freely under the spring and damper forces. The transfer function’s impulse response $$h(t)$$ is the displacement per unit impulse area.

{% include activity.html id=page.activity %}

[See how the same impulse response builds up a response to any force history]({{ '/lectures/06-convolution/' | relative_url }}).
