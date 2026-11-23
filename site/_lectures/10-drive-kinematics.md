---
title: "Drive Kinematics"
study: exam-2
number: '10'
unit: "Mechanical systems and stability"
summary: "Model pulleys, belts, and gear pairs with kinematic constraints and torque balances."
slides: /materials/lectures/lecture-10.pdf
notes: /materials/lectures/lecture-10-notes.pdf
activity: gears
opening_questions:
  - 'If a 24-tooth gear drives a 12-tooth gear, which turns faster and in which direction?'
  - 'What does no slip tell you about a belt’s speed at the rim of a pulley?'
takeaways:
  - 'The no-slip constraint ties belt speed to pulley rim speed, $$v=r\omega$$.'
  - 'External gears turn in opposite directions. Their angular speed magnitudes vary inversely with their tooth counts.'
  - 'For an ideal gear pair, the speed ratio enters inversely in the torque ratio and squared when reflecting inertia to the input shaft.'
---

## No slip links rotation and translation

At a pulley of radius $$r$$, no slip gives a rim speed $$r\omega$$ and tangential acceleration $$r\alpha$$. A belt or cable transmits this motion to a connected component. Select signs from the actual direction of motion. Write separate force balances for the translating bodies and a moment balance for the pulley. If the pulley has inertia, tensions can differ on opposite sides.

**From drum to load.** A cable winds without slip on a drum of radius $$r$$. Its load speed is $$v=r\omega$$, and a cable tension $$T$$ exerts a moment of magnitude $$Tr$$. The reflected inertia of a translating mass follows from energy: $$\tfrac12 mv^2=\tfrac12(mr^2)\omega^2$$. This lets one angular balance include both drum and load.

## Gear speed, torque, and inertia

{% include example-diagram.html id='drive-train' %}

Meshing external gears have equal tangential speed magnitude at their pitch point and rotate in opposite directions. For tooth counts $$N_1$$ and $$N_2$$, $$\omega_2/\omega_1=-N_1/N_2$$. In an ideal lossless pair, torque magnitude varies inversely with speed magnitude. For a load inertia $$J_2$$, its value reflected to shaft 1 is $$J_2(\omega_2/\omega_1)^2$$. The square follows by equating kinetic energies.

<section class="worked-example" markdown="1">

### Worked example · A 24-tooth gear drives a 12-tooth gear

With the driver turning at 2 rad/s, the driven speed is $$-2(24/12)=-4\,\mathrm{rad/s}$$. The negative sign marks opposite rotation. In the ideal pair, the output torque magnitude is half the input torque magnitude.

</section>

{% include activity.html id=page.activity %}
