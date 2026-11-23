---
title: "Electromechanical Coupling"
study: final-exam
number: '18'
unit: "Electrical, fluid, and thermal systems"
summary: "Predict the force on a current-carrying rod and the voltage across the same rod when it moves."
slides: /materials/lectures/lecture-18.pdf
notes: /materials/lectures/lecture-18-notes.pdf
activity: sliding-rod
opening_questions:
  - 'A vertical rod carries current upward in a field pointing toward you. Which way will the rod accelerate?'
  - 'If you disconnect the source and slide the rod by hand, can a voltmeter read a voltage while the current is zero?'
takeaways:
  - 'Reverse either the current or the perpendicular magnetic field and the force reverses. A field parallel to the rod produces zero magnetic force on its axial current.'
  - 'A moving rod can produce an open-circuit voltage. Its polarity reverses when either the velocity or the field reverses.'
  - 'With consistent reference directions, the same coupling coefficient relates current to force and velocity to back EMF.'
---

## From current to force and motion to voltage

Imagine a conducting rod that bridges two horizontal rails and can slide left or right. Define positive current as **up the rod** and positive motion as **to the right**. A dot in the diagram means the magnetic field points out of the page, toward you. A cross means it points into the page.

**Drive the rod with current.** Point your right-hand fingers up the rod and curl them toward the field. Your thumb points along the magnetic force $$\mathbf F=i(\boldsymbol\ell\times\mathbf B)$$. With the field toward you and current upward, the force points right. Reverse the current and the rod accelerates left.

**Move the rod by hand.** Disconnect the source and connect an ideal voltmeter across the rails. Push the rod right through the same outward field. A positive charge moving with the rod feels $$q(\mathbf v\times\mathbf B)$$ downward, so positive charge builds up at the bottom. A meter with its positive lead on the bottom rail reads a positive voltage, even with zero current through the meter.

The experiment uses a 0.20 m rod of mass 0.25 kg sliding without friction. In the current-driven trial it starts from rest. In the hand-driven trial you set its velocity and the ideal voltmeter draws zero current.

{% include activity.html id=page.activity %}

<section class="worked-example" markdown="1">

### Worked example · Read the same rod two ways

A 0.20 m rod slides in a uniform 0.50 T field directed out of the page. First send 2 A upward through the rod. Then disconnect the source and push the rod left at 1 m/s. Which way does the force point in the first trial? Which rail is positive in the second?

**Current-driven trial.** The force is $$F_x=(2)(0.20)(0.50)=+0.20\,\mathrm N$$, to the right. At release the rod is stationary, so its back EMF is zero even though the force is already present.

**Open-circuit trial.** The signed meter reading is $$V_{\rm bottom}-V_{\rm top}=(0.50)(0.20)(-1)=-0.10\,\mathrm V$$. The top rail is at the higher potential. The circuit is open, so the current and the magnetic force on the rod are both zero.

</section>

## Close the physical loop

Let $$B_z$$ be the signed field component pointing out of the page and set $$K=\ell B_z$$. For this rod, $$F_x=Ki$$ and $$e=V_{\rm bottom}-V_{\rm top}=Kv_x$$. Multiplying the voltage by the current gives $$e i=F_x v_x$$. Each side measures the same rate of energy conversion in watts.

If a voltage source drives the rod through a resistance $$R$$, Kirchhoff’s law gives $$u=Ri+e$$. As the rod speeds up in the direction of the magnetic force, the back EMF reduces the voltage available to drive current. In [Lecture 19]({{ '/lectures/19-dc-motors/#dc-motor' | relative_url }}), torque and shaft speed play the roles of force and linear speed.

The RC ladder from this lecture’s PDF is now part of [Lecture 17’s stage-loading example and lab]({{ '/lectures/17-electrical-circuits/#stage-loading' | relative_url }}).
{: #stage-loading}
