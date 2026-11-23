---
title: "Math Review"
study: exam-1
number: '02'
unit: "Dynamic response and modeling foundations"
summary: "Review integration, vector operations, and complex numbers used in dynamic modeling."
slides: /materials/lectures/lecture-02.pdf
notes: /materials/lectures/lecture-02-notes.pdf
opening_questions:
  - 'If you know a cart’s velocity over time, what else do you need to find its position?'
  - 'How can a complex exponential describe a real oscillation?'
takeaways:
  - 'A derivative gives the instantaneous rate. Integrate the rate to find the change and add the initial value to recover the state.'
  - 'Use the dot product for work and the cross product of moment arm and force for torque.'
  - 'In a complex exponential, the real part of the exponent’s coefficient sets the envelope and the imaginary part sets the angular frequency.'
---

## Integration and derivatives

A derivative describes an instantaneous rate. Integration accumulates that rate, so the change in a quantity between two times is the integral of its rate over that interval. The integration constant sets the initial position.

<section class="worked-example" markdown="1">

### Worked example · From velocity to position

A cart starts at 2 m and travels at 3 m/s for 2 s. Integrating the velocity gives a change of 6 m. Adding that change to the initial position gives a final position of 8 m.

</section>

Use substitution when an integrand contains a function and its derivative. Use integration by parts when differentiating one factor simplifies a product. For definite integrals, also transform the limits if you change variables.

## Vectors and fields

The dot product gives the component of one vector along another direction, scaled by the vector lengths. Work is the line integral of force dotted with displacement. The cross product gives a perpendicular vector and is used in the moment $$\mathbf{M}=\mathbf{r}\times\mathbf{F}$$. A scalar triple product gives signed volume. Its sign changes when two vectors are exchanged.

The gradient points in the direction of steepest increase of a scalar field. Divergence describes local net outflow, and curl describes local circulation. The divergence theorem relates flux through a closed surface to the volume integral of divergence. Stokes’ theorem relates circulation around an oriented boundary to the surface integral of curl.

**Connect the math to a machine.** A horizontal 10 N force applied 0.20 m above a shaft has a 2 N·m moment magnitude. Sliding its line of action through the shaft makes the moment zero even though the force magnitude stays 10 N. [Watch the moment arm change on a pinned rod]({{ '/lectures/09-rigid-body-dynamics/#rod-motion' | relative_url }}).

## Complex numbers

Write a complex number as $$a+jb$$ or in magnitude–phase form. Its magnitude is $$\sqrt{a^2+b^2}$$, and its phase is $$\operatorname{atan2}(b,a)$$. Multiplication adds phases and multiplies magnitudes. Euler’s formula turns a complex exponential into sine and cosine, which is how conjugate roots lead to a real oscillatory response.


Imagine the complex point $$z=e^{(-1+2j)t}$$. Its distance from the origin is $$e^{-t}$$ while its angle increases by 2 rad each second. Its horizontal projection is the real displacement $$e^{-t}\cos(2t)$$. When you see a complex root later, sketch the shrinking radius and then project the rotating point onto a line.
