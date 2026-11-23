---
title: "Coupled Systems and the Quarter-Car Model"
study: exam-2
number: '14'
unit: "Mechanical systems and stability"
summary: "Connect relative spring and damper forces to a two-mass dynamic model."
slides: /materials/lectures/lecture-14.pdf
notes: /materials/lectures/lecture-14-notes.pdf
activity: quarter-car
opening_questions:
  - 'When the wheel moves up over a bump, which forces act between the wheel and body?'
  - 'Would you choose the same suspension settings for ride comfort and for maintaining tire contact?'
takeaways:
  - 'Draw one force balance per mass. Suspension forces act in equal and opposite pairs and depend on relative displacement and velocity.'
  - 'In the quarter-car model, the tire spring responds to road height relative to wheel position. The body and wheel together contribute four states.'
  - 'Use body acceleration to assess ride comfort, suspension travel to check clearance, and tire deflection to estimate changes in tire force.'
---

## Write each mass balance separately

Use the same positive direction for the two displacements. Between masses with displacements $$x_1$$ and $$x_2$$, a linear spring contributes $$-k(x_1-x_2)$$ on mass 1 and the opposite force on mass 2. A damper similarly uses the velocity difference. Explicit relative terms make the signs easier to check.

## A passive quarter-car

Let $$z_s$$ be body displacement, $$z_u$$ wheel displacement, and $$r$$ road height. The suspension spring and damper depend on $$z_s-z_u$$ and its derivative. A simple tire spring applies $$k_t(r-z_u)$$ to the unsprung mass. Measure displacement from static equilibrium so constant weight is already balanced by the static deflections.

<section class="worked-example" markdown="1">

### Worked example · Find the suspension force

Hold the body at equilibrium and raise the wheel 10 mm. At an instant when both velocities are zero, only the spring contributes to the suspension force. With a stiffness of 16,500 N/m, it pushes up on the body with 165 N and down on the wheel with 165 N.

</section>

{% include activity.html id=page.activity %}

## Follow one force onto both bodies

Write the signed suspension force as $$S=k_s(z_s-z_u)+c_s(\dot z_s-\dot z_u)$$. The free-body diagrams give

$$
m_s\ddot z_s=-S,\qquad m_u\ddot z_u=S+k_t(r-z_u).
$$

Add the equations. The suspension force cancels because it is internal to the body–wheel pair. A sign error leaves an extra suspension force in the sum. To get this passive model from the lecture PDF's general model, set the actuator force and tire damping coefficient to zero. The suspension damper still acts between body and wheel.

## From equations to outputs

The two second-order equations require four states: both positions and both velocities. To obtain a transfer function, transform the two equations under zero initial conditions and solve for the chosen output. Body acceleration, suspension travel, and tire deflection reveal different design tradeoffs. [Apply this in the suspension project]({{ '/projects/02-suspension/' | relative_url }}).
