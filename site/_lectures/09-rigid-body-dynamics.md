---
title: "Rigid-Body Dynamics"
study: exam-2
number: '09'
unit: "Mechanical systems and stability"
summary: "Apply force, moment, and energy balances to derive equations of motion."
slides: /materials/lectures/lecture-09.pdf
notes: /materials/lectures/lecture-09-notes.pdf
activity: moment-example
opening_questions:
  - 'As a pinned rod swings, how does the moment arm of its weight change?'
  - 'How can the rod be moving fastest when its angular acceleration is zero?'
takeaways:
  - 'Start with a free-body diagram. Mark the positive directions, the point for taking moments, and the lines of action.'
  - 'The pin reactions pass through the pivot and contribute zero moment about it. Gravity’s moment is the weight times its signed perpendicular lever arm.'
  - 'At the downward crossing of the frictionless rod, the gravity moment vanishes and the angular speed reaches its maximum.'
---

## Start with a free-body diagram

Choose a system boundary and positive directions. Account for applied forces, weight, reactions, and friction. For planar rigid-body motion, apply $$\sum\mathbf{F}=m\mathbf{a}_G$$ to the center of mass and $$\sum M_G=I_G\alpha$$ about it. For rotation about a fixed axis, the moment of inertia about that axis can be found with $$I_O=I_G+md^2$$.

{% include activity.html id=page.activity %}

{% include activity.html id='pinned-rod' anchor='rod-motion' %}

## Energy and friction

For a particle or rigid body, work changes kinetic energy. With conservative forces represented by potential energy, work by the remaining forces changes the sum of kinetic and potential energy. Static friction supplies the force required to avoid slip until its limiting magnitude is reached. During sliding, kinetic friction opposes the relative velocity.

<section class="worked-example" markdown="1">

## Pendulum example

{% include example-diagram.html id='pendulum' %}

For a point mass on a massless link, moment balance about the pivot gives $$m\ell^2\ddot{\theta}=-mg\ell\sin\theta$$. Near the downward equilibrium, $$\sin\theta\approx\theta$$ for $$\theta$$ in radians, so $$\ddot{\theta}+(g/\ell)\theta\approx0$$. The small-angle frequency $$\sqrt{g/\ell}$$ follows from the linearized model.

</section>

Compare the small- and large-angle motion of a lightly damped point pendulum in [Phase Portraits and Stability]({{ '/lectures/15-phase-portraits-and-stability/#pendulum-example' | relative_url }}).
