---
title: "Introduction to Feedback Control"
study: final-exam
number: '24'
unit: "System representations and feedback"
summary: "Use a feedback diagram to explain how a controller changes a system’s response."
slides: /materials/lectures/lecture-24.pdf
lab: feedback
opening_questions:
  - 'Where does the tracking error come from in a negative-feedback loop?'
  - 'If you increase proportional gain on the mass–spring–damper system, what happens to tracking error and to the oscillation you see?'
takeaways:
  - 'Negative feedback subtracts the measured output from the reference. The controller turns that error into a plant input.'
  - 'Proportional gain changes the closed-loop poles. In the mass–spring–damper example, it adds to the stiffness term and reduces steady tracking error for a position step.'
  - 'Integral action can remove steady error when the loop remains stable. Derivative action responds to the rate of change and can amplify measurement noise.'
---

## Trace the loop

{% include example-diagram.html id='feedback' %}

A reference describes the desired output. A sensor measures the actual output, and the error is the reference minus the measurement. A controller uses this error to choose the plant input. Disturbances can enter the plant even when the reference is fixed.

## Close the equations

For unity negative feedback, plant $$G(s)$$, and controller $$C(s)$$, the reference-to-output transfer function is

$$
\frac{C(s)G(s)}{1+C(s)G(s)}.
$$

The characteristic equation after algebraic reduction shows how feedback can change the poles. For $$G(s)=1/(ms^2+cs+k)$$ and $$C(s)=K_p$$, the closed-loop denominator becomes $$ms^2+cs+k+K_p$$.

<section class="worked-example" markdown="1">

### Worked example · Find the steady tracking error

At rest, the spring force $$kx$$ balances the controller force $$K_p(r-x)$$. If both stiffness and proportional gain are 16 N/m, a 1 m command settles at $$x=K_pr/(k+K_p)=0.5\,\mathrm m$$. The remaining 0.5 m error keeps the controller pushing against the spring.

</section>

{% include lab.html id=page.lab %}

**Trace a disturbance.** Keep the command fixed and apply an additional positive steady force $$d$$ to the mass. After transients settle, $$kx=K_p(r-x)+d$$. The change in equilibrium position is $$d/(k+K_p)$$. Compare this disturbance response with the reference response above: the denominator is shared, but the two inputs enter at different places.

## What the three actions do

Proportional action responds to the current error. Integral action accumulates error and can remove steady error under appropriate stable conditions. Derivative action reacts to the rate of change and can be sensitive to measurement noise. Compare performance and stability before treating a higher gain as an improvement.
