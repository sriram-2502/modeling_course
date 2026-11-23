---
title: "Fluid Systems and Electrical Analogies"
study: final-exam
number: '21'
unit: "Electrical, fluid, and thermal systems"
summary: "Model hydraulic pressure, restrictions, capacitance, and piston forces."
slides: /materials/lectures/lecture-21.pdf
notes: /materials/lectures/lecture-21-notes.pdf
activity: hydraulic
opening_questions:
  - 'Which hydraulic variables play the roles of voltage and current?'
  - 'Which cylinder chamber needs inflow as the piston moves right, and what happens to the flows as it reverses?'
takeaways:
  - 'Pressure difference drives flow through a restriction. A local hydraulic resistance is the slope of the pressure-drop versus flow curve.'
  - 'A free-surface tank stores fluid. Its cross-sectional area sets how quickly pressure changes for a given net inflow.'
  - 'Piston force comes from pressure acting over effective areas. Piston velocity sets how fast the chamber volumes change.'
---

## Pressure and flow

Pressure difference drives volumetric flow in a hydraulic restriction. Near a chosen operating point, a nonlinear relation can be approximated with a local resistance $$R=d(\Delta p)/dq$$. Pressure plays a role analogous to voltage, and flow to current.

## Storage and pressure force

For a free-surface tank with $$p=\rho gh$$, a constant surface area $$A$$ corresponds to fluid capacitance $$C_h=A/(\rho g)$$, where $$q_{\mathrm{net}}=C_h\dot{p}$$. A piston turns a pressure difference into force. For equal effective areas, $$F=A_p(p_1-p_2)$$. For unequal areas, calculate each pressure force separately.

Watch how storage and outlet resistance set the response in the [two-tank fill and drain example]({{ '/lectures/20-fluid-systems/#filling-and-draining-demo' | relative_url }}).

## Coupled actuator model

{% include example-diagram.html id='hydraulic-actuator' %}

In a double-acting actuator, piston motion changes the two chamber volumes in opposite directions. Include these volume changes in the chamber flow balances, and use chamber pressures in the piston’s mechanical balance. For a simple damper with $$q=A_pv$$ and $$\Delta p=Rq$$, the equivalent damping magnitude is $$RA_p^2$$.

For the sealed-air model, prescribe the piston motion and treat the gas as isothermal. Each chamber obeys $$pV=p_0V_0$$. As the piston moves, the gas pressure rises in the shrinking chamber and falls in the expanding chamber. Switch to the open-port liquid model to compare with the flow required by the same motion.

<section class="worked-example" markdown="1">

### Worked example · Find the force at the right stroke limit

At the right stroke limit, the two air volumes are 0.125 L on the left and 0.075 L on the right. Both started at 100 kPa and 0.100 L. The pressure–volume relation gives 80 kPa on the left and 133.3 kPa on the right. Over an effective area of 0.001 m² the net pressure force is 53.3 N to the left.

</section>

{% include activity.html id=page.activity %}
