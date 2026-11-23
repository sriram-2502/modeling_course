---
title: "Dampers and State Space"
study: exam-2
number: '12'
unit: "Mechanical systems and stability"
summary: "Use force laws and state equations to distinguish storage, dissipation, and measured outputs."
slides: /materials/lectures/lecture-12.pdf
notes: /materials/lectures/lecture-12-notes.pdf
activity: viscous-damper
opening_questions:
  - 'When a mass is moving, how can you tell whether the damper adds energy or takes it away?'
  - 'If the applied force jumps, can acceleration jump even while position and velocity stay continuous?'
takeaways:
  - 'A viscous damper opposes relative velocity and dissipates power at a rate proportional to the square of that velocity.'
  - 'The position and velocity outputs select states directly. The acceleration equation also depends directly on the applied force.'
  - 'The eigenvalues govern free motion. The full forced response also depends on the input history.'
---

## Where energy goes

{% include example-diagram.html id='mass-spring-damper' %}

An ideal viscous damper produces force proportional to relative velocity. For a damper connected to ground, $$F_d=-cv$$. Its power acting on the mass is $$-cv^2$$, so it dissipates mechanical energy when $$c>0$$. A spring stores energy and can return it to the mass.

<section class="worked-example" markdown="1">

### Worked example · Find the force and power

For a damper of 2 N·s/m and a cart moving right at 1 m/s, the damper force on the cart is $$F_d=-2\,\mathrm{N}$$. Its power on the cart is $$F_dv=-2\,\mathrm{W}$$, so the damper removes mechanical energy at 2 W.

</section>

First isolate the damper by removing the spring. Compare a cart that coasts from an initial speed with one that is pushed from rest. The animation follows the position, while the plots show speed and the rate of energy loss.

{% include activity.html id=page.activity %}

In [Second-Order Systems]({{ '/lectures/04-second-order-systems/#build-a-massspringdamper-model' | relative_url }}), use damping coefficient mode to hold mass and stiffness fixed while you find the critical damping threshold.

## Model and measurement

For position $$x$$ and velocity $$v$$, $$\dot{x}=v$$ and $$\dot{v}=(f-cv-kx)/m$$. A position or velocity output selects one state directly. An acceleration output uses coefficients $$-k/m$$ and $$-c/m$$ on the states and has a direct feedthrough term $$f/m$$.

## Compare free and forced response

The state equations accommodate either an initial displacement or a time-varying force. The homogeneous motion depends on the eigenvalues. The forced motion also depends on the input.
