---
title: "Phase Portraits and Stability"
study: exam-2
number: '15'
unit: "Mechanical systems and stability"
summary: "Relate equilibria, linearization, eigenvalues, and the geometry of trajectories."
slides: /materials/lectures/lecture-15.pdf
notes: /materials/lectures/lecture-15-notes.pdf
activity: pendulum
opening_questions:
  - 'A pendulum is at rest in either the hanging or upright position. What happens after a small nudge in each case?'
  - 'What can an angle–velocity plot reveal that a sketch of the pendulum’s path through space cannot?'
takeaways:
  - 'A phase portrait shows states and their direction of change. A pendulum state contains both angle and angular velocity.'
  - 'Linearize about the equilibrium of interest. Eigenvalues describe nearby motion, and large disturbances can expose nonlinear behavior.'
  - 'The upright pendulum has a growing direction. With positive damping, small disturbances decay about the hanging equilibrium.'
---

## Find the equilibria first

For $$\dot{z}=f(z,u)$$ with fixed input $$\bar{u}$$, an equilibrium $$z_e$$ satisfies $$f(z_e,\bar{u})=0$$. The Jacobian $$A$$ at that point maps small displacements in state to first-order changes in the dynamics. The linearized system describes nearby motion. Large perturbations can expose nonlinear behavior absent from the linear model.

At the hanging equilibrium of a damped simple pendulum, use angular displacement $$\theta$$ and angular velocity $$\omega$$. The local acceleration is $$\dot\omega\approx-(g/\ell)\theta-b\omega$$ with $$b>0$$. Around the upright position the gravity term reverses sign. A small positive angle with zero initial speed then accelerates farther away. Inspect the arrows on the horizontal axis first.

## Read the phase portrait

Each point represents a full state. The vector field gives the initial direction of motion, and the trajectory follows those directions through time. For two real eigenvalues, the eigendirections describe straight trajectories of a linear model. A saddle has one growing and one decaying direction. A stable focus spirals inward as time advances.

<section class="worked-example" markdown="1">

## Pendulum example

{% include example-diagram.html id='pendulum' %}

The states are angle and angular velocity. The downward and upright equilibria have zero angular velocity but different local dynamics. Near the upright equilibrium, gravity amplifies small departures in an unforced pendulum. Near the downward equilibrium it restores the angle. Positive damping turns small oscillations about the downward equilibrium into decaying motion.

</section>

{% include activity.html id=page.activity %}

[Try the vehicle recovery replay in Keeping a Vehicle Stable]({{ '/projects/03-lateral-stability/' | relative_url }}) to compare a physical X–Y path with a phase portrait.
