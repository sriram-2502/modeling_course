---
title: "Laplace Transforms"
study: exam-1
number: '05'
unit: "Dynamic response and modeling foundations"
summary: "Carry initial conditions into an algebraic equation in s and recover the time response."
slides: /materials/lectures/lecture-05.pdf
notes: /materials/lectures/lecture-05-notes.pdf
activity: laplace-example
opening_questions:
  - 'How does the cart’s initial speed enter the Laplace transform of its force balance?'
  - 'What can you check in a recovered time response before plotting it?'
takeaways:
  - 'Carry initial conditions into the unilateral transform when transforming derivatives.'
  - 'Solve for the transformed variable, then use partial fractions or known transform pairs to recover the response.'
  - 'Check that the solution starts at the given value and, for a stable constant-input case, approaches the equilibrium.'
---

## Transform the equation and the initial conditions

The unilateral Laplace transform weights $$x(t)$$ by $$e^{-st}$$ and integrates from $$0$$ to $$\infty$$. For derivatives, the initial conditions enter as

$$
\begin{aligned}
\mathcal{L}\{\dot{x}\} &= sX-x(0),\\
\mathcal{L}\{\ddot{x}\} &= s^2X-sx(0)-\dot{x}(0).
\end{aligned}
$$

These initial-condition terms distinguish the full response from a transfer-function calculation.

Useful pairs include $$\mathcal{L}\{1\}=1/s$$, $$\mathcal{L}\{e^{-at}\}=1/(s+a)$$, and $$\mathcal{L}\{\sin(\omega t)\}=\omega/(s^2+\omega^2)$$. A delay of $$T$$ with a causal switch multiplies the transform by $$e^{-sT}$$.

## Solve and invert

<section class="worked-example" markdown="1">

### Worked example · Recover the time response

For $$\dot{x}+2x=4$$ and $$x(0)=1$$, the transform gives $$(s+2)X=4/s+1$$. Decompose $$X=2/s-1/(s+2)$$ and invert to get $$x(t)=2-e^{-2t}$$. The initial value and equilibrium verify the signs.

</section>

Distinct poles give sums of exponentials. A repeated factor $$1/(s+a)^2$$ gives $$te^{-at}$$. For a conjugate pair, complete the square and split the numerator so it matches shifted sine and cosine transforms.

{% include activity.html id=page.activity %}

{% include activity.html id='damper-cart' anchor='damper-cart-motion' %}
