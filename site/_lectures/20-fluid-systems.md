---
title: "Fluid Systems and Mass Conservation"
study: final-exam
number: '20'
unit: "Electrical, fluid, and thermal systems"
summary: "Derive liquid-level and mixing models from conservation of mass."
slides: /materials/lectures/lecture-20.pdf
notes: /materials/lectures/lecture-20-notes.pdf
lab: draining
opening_questions:
  - 'Does a freely draining tank lose height fastest when it is full or nearly empty?'
  - 'If one tank feeds another, can the second tank keep filling after the pump turns off?'
takeaways:
  - 'A tank rises while inflow exceeds outflow. In a cascade, the second tank can keep rising after the pump shuts off because the first tank is still draining into it.'
  - 'With Torricelli drainage and no inflow, outflow scales with the square root of the height. The level falls more slowly as the tank empties.'
  - 'Track dissolved salt with its own balance. The second well-mixed tank receives the first tank’s concentration, so its concentration starts with zero slope after an inlet step into initially fresh water.'
---

## Set up the stored quantity

{% include example-diagram.html id='tank' %}

For an incompressible liquid of density $$\rho$$, mass flow is $$\rho$$ times volumetric flow. A constant-area tank with height $$h$$ stores volume $$Ah$$. Its balance is $$A\,dh/dt=q_{\mathrm{in}}-q_{\mathrm{out}}$$. With variable geometry, replace $$A$$ by the cross-sectional area at the current height.

## Drainage and Torricelli’s law

With atmospheric pressure above the liquid and at the outlet, neglect surface velocity and use an ideal outlet model corrected by a discharge coefficient. Then $$q_{\mathrm{out}}=C_dA_o\sqrt{2gh}$$. For zero inflow and constant $$A$$, integrating the height equation gives

$$
\sqrt{h}=\sqrt{h_0}-\frac{C_dA_o}{A}\sqrt{\frac{g}{2}}\,t
$$

until the tank empties.

{% include lab.html id=page.lab %}

## Fill and drain two tanks

Here two tanks with the same cross-sectional area of 0.020 m² are connected in cascade. Tank 1 discharges freely into Tank 2, and Tank 2 discharges to a drain. With a linear outlet law, each outflow is proportional to the water depth in its own tank. A tank rises when more water flows in than out, and falls when more flows out than in.

<section class="worked-example" markdown="1">

### Worked example · Why Tank 2 keeps rising

At pump shutoff in the default case, Tank 1 is about 0.388 m deep and Tank 2 is about 0.221 m deep. With a 20 s outlet time constant, the second tank’s height changes at about $$(0.388-0.221)/20=0.00835\,\mathrm{m/s}$$. The positive sign means the downstream tank is still rising.

</section>

{% include lab.html id='tank-levels' anchor='filling-and-draining-demo' %}

<details markdown="1"><summary>Why can the second tank still rise after pump shutoff?</summary>

Trace the pipe between the tanks. The upstream tank still supplies $$q_{12}$$. Tank 2 reaches its peak when $$q_{12}=q_{\mathrm{out},2}$$. Step past shutoff and compare that crossing with the peak on the level plot.

</details>

## Mixing is a separate balance

{% include example-diagram.html id='mixing-tanks' %}

If the tank is well mixed, the concentration in the outlet equals the current tank concentration. Write the balance for dissolved salt as input salt rate minus output salt rate. For two tanks in cascade, the first tank’s outlet concentration becomes the second tank’s inlet concentration.

{% include lab.html id='mixing' anchor='mixing-demo' %}
