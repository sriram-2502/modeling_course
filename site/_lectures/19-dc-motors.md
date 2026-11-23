---
title: "Galvanometers and DC Motors"
study: final-exam
number: '19'
unit: "Electrical, fluid, and thermal systems"
summary: "Combine current, torque, speed, and back EMF in a coupled electromechanical model."
slides: /materials/lectures/lecture-19.pdf
notes: /materials/lectures/lecture-19-notes.pdf
lab: motor
opening_questions:
  - 'Why does a DC motor’s back EMF start at zero and rise as the shaft speeds up?'
  - 'Can you change how much a galvanometer’s pointer overshoots while keeping its final reading the same?'
takeaways:
  - 'The armature current produces torque. Shaft motion produces back EMF, which subtracts from the voltage driving the current.'
  - 'For an opposing load increase at fixed voltage, the motor slows and draws more current as it approaches its new equilibrium.'
  - 'Galvanometer damping changes the transient. The steady pointer angle comes from the balance between the current-induced torque and the torsional spring.'
---

## Galvanometer

<div class="electromechanical-diagrams" markdown="1">
{% include example-diagram.html id='galvanometer' %}
{% include example-diagram.html id='galvanometer-fbd' %}
</div>

A current-carrying coil in a magnetic field develops torque. Draw the two winding forces first, then isolate the rotor and write its moment balance. Taking counterclockwise as positive gives

$$
J\ddot{\theta}=K_t i-b\dot{\theta}-k\theta.
$$

The spring sets the steady pointer angle for a given current. The damper sets how the pointer approaches that reading. The moving coil also generates back EMF $$e=K_e\dot{\theta}$$. In the lab an ideal current source supplies the selected current as the back EMF changes.

The force arrows show an effective winding pair in a 0.50 T field. Each side has an effective active conductor length of 2 m across the turns, at a radius of 0.025 m. Thus each side has force magnitude $$F=B\ell_{\mathrm{eff}}i$$, and their torque is $$2rF=K_t i$$.

For the model below, use a rotor inertia of 0.002 kg·m², a spring stiffness of 0.018 N·m/rad, and a back-EMF constant of 0.05 V·s/rad.

<section class="worked-example" markdown="1">

### Worked example · Predict the final pointer angle

A 20 mA current and a torque constant of 0.05 N·m/A produce 0.001 N·m of drive torque. At rest the spring balances it, so $$\theta=0.001/0.018=0.0556\,\mathrm{rad}$$, or about 3.18°.

</section>

The pointer is attached to the coil’s shaft. On the left, the purple mark magnifies the shaft rotation **16×**. The dashed horizontal line shows its starting position. A 3° shaft rotation therefore appears as a 48° sweep on the rotor. Read the actual angle in degrees on the right-hand dial. Its dashed target needle marks the steady angle where spring torque balances magnetic torque, $$\theta_\infty=K_t i/k$$.

{% include lab.html id='galvanometer' anchor='pointer-demo' %}

## DC motor

<div class="electromechanical-diagrams" markdown="1">
{% include example-diagram.html id='dc-motor' %}
{% include example-diagram.html id='dc-motor-fbd' %}
</div>

A simple armature model gives $$L\dot{i}+Ri+K_e\omega=v$$. The shaft balance is $$J\dot{\omega}+b\omega=K_ti-T_{\mathrm{load}}$$. Current produces torque, and shaft speed feeds back through the back EMF. Under zero initial conditions and zero load torque, the speed-to-voltage transfer function is

$$
\frac{\Omega(s)}{V(s)}=
\frac{K_t}{(Ls+R)(Js+b)+K_eK_t}.
$$

## Startup and load

Back EMF starts at zero when the shaft is at rest. As speed rises, it reduces the voltage available to drive current. An added opposing load slows the motor at first, reducing back EMF and increasing the current available for motor torque. The new speed follows from solving the steady electrical and mechanical equations together.

The animation uses an effective winding pair in a 0.50 T field. The force on each side acts at a 0.10 m radius and represents 1 m of active conductor across the turns. The colored rotor marker tracks shaft angle as the effective force couple drives the rotor.

{% include lab.html id=page.lab %}
