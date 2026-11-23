---
title: "Thermal Systems"
study: final-exam
number: '22'
unit: "Electrical, fluid, and thermal systems"
summary: "Use energy conservation, thermal resistance, and capacitance to predict temperature."
slides: /materials/lectures/lecture-22.pdf
lab: thermal
opening_questions:
  - 'Can you make a heated body warm up more slowly while keeping its final temperature the same?'
  - 'If two isolated bodies with the same thermal capacitance start at 60 °C and 20 °C, where will their temperatures meet?'
takeaways:
  - 'A lumped thermal model balances the heater power, heat loss, and the rate of energy storage in the body.'
  - 'Thermal capacitance changes the time constant. Thermal resistance changes both the time constant and the steady temperature rise at fixed heater power.'
  - 'Heat exchanged between two bodies leaves one balance and enters the other. Equal-capacitance bodies in an isolated pair settle at the average of their initial temperatures.'
---

## A lumped thermal model

{% include example-diagram.html id='thermal' %}

When a body can be approximated by one temperature, its thermal capacitance is $$C_{\mathrm{th}}=mc_p$$. A thermal resistance $$R_{\mathrm{th}}$$ relates heat rate to temperature difference. With constant ambient temperature $$T_a$$ and heater power $$P$$, the energy balance is

$$
C_{\mathrm{th}}\dot{T}=P-\frac{T-T_a}{R_{\mathrm{th}}}.
$$

At steady state the temperature is $$T_a+PR_{\mathrm{th}}$$. The time constant is $$R_{\mathrm{th}}C_{\mathrm{th}}$$. A model in the deviation $$T-T_a$$ looks mathematically like the RC circuit.

The animated thermometers share a 20–60 °C scale. Blue marks the cool end of the scale and red marks the warm end.

<section class="worked-example" markdown="1">

### Worked example · Predict the rise and the time constant

Start at room temperature, 20 °C. With a 50 W heater and thermal resistance of 0.4 K/W, the steady rise is 20 K, so the final temperature is 40 °C. With a thermal capacitance of 250 J/K, the time constant is 100 s. After 100 s the body has completed about 63% of its rise, reaching about 32.6 °C.

</section>

{% include lab.html id=page.lab %}

## Two thermal bodies

{% include example-diagram.html id='thermal-pair' %}

For bodies with temperatures $$T_1$$ and $$T_2$$, heat transfer through their connecting resistance is $$(T_1-T_2)/R_{12}$$. It leaves body 1 and enters body 2. Include each body’s input power and losses in its own energy balance, then use the two temperatures, or deviations from equilibrium, as states.

{% include lab.html id='thermal-pair' anchor='heat-exchange-demo' %}
