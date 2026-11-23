---
title: "Electrical Circuits"
study: final-exam
number: '17'
unit: "Electrical, fluid, and thermal systems"
summary: "Apply Kirchhoff’s laws to derive RC, RL, and RLC dynamics."
slides: /materials/lectures/lecture-17.pdf
notes: /materials/lectures/lecture-17-notes.pdf
lab: rc
opening_questions:
  - 'Does doubling resistance speed up the response in an RC circuit, an RL circuit, or both?'
  - 'When you connect a second RC stage, where does its charging current come from?'
  - 'What can make the capacitor voltage overshoot the applied step in an RLC circuit?'
takeaways:
  - 'Choose capacitor voltage and inductor current as states. Use Kirchhoff’s laws and the element equations to find their dynamics.'
  - 'Increasing resistance lengthens the RC time constant $$RC$$ and shortens the RL time constant $$L/R$$.'
  - 'A series RLC circuit has two storage elements and two poles. Underdamped poles can produce ringing and overshoot in the capacitor voltage.'
  - 'A second RC stage draws charging current from the first. An ideal buffer isolates the stages.'
---

## Element laws and storage

With passive sign convention, a resistor follows $$v=Ri$$, an inductor $$v=L\,di/dt$$, and a capacitor $$i=C\,dv/dt$$. Use Kirchhoff’s current law at nodes and voltage law around loops. Capacitor voltage and inductor current are natural state variables because they track stored energy.

The **ammeter** goes in series and reports signed current. The **voltmeter** connects across the capacitor or inductor and reads its voltage drop. The moving blue dots follow the direction of conventional current, with their speed scaled for visibility.

Compare the models and pole plots for the [RC](#a-series-rc-circuit), [RL](#a-series-rl-circuit), and [RLC](#a-series-rlc-circuit) circuits.

## A series RC circuit

{% include example-diagram.html id='rc' %}

For a source $$u(t)$$ driving a resistor and capacitor in series, $$u=Ri+v_C$$ and $$i=C\,dv_C/dt$$. Substituting gives $$RC\,dv_C/dt+v_C=u$$. For a step from zero to $$U$$ and an initially uncharged capacitor,

$$
v_C(t)=U\bigl(1-e^{-t/(RC)}\bigr).
$$

The product $$RC$$ has units of seconds.

{% include lab.html id=page.lab %}

## A series RL circuit

{% include example-diagram.html id='rl' %}

The series RL circuit obeys $$L\,di/dt+Ri=u$$, with time constant $$L/R$$ and pole $$s=-R/L$$.

<section class="worked-example" markdown="1">

### Worked example · Double the RL resistance

For a 2 Ω resistor and a 1 H inductor, the pole is $$-2\,\mathrm{s}^{-1}$$. Doubling the resistance moves it to $$-4\,\mathrm{s}^{-1}$$ and halves the time constant. For the same voltage step, the final current falls by half because $$i_\infty=U/R$$.

</section>

{% include lab.html id='rl' anchor='rl-lab' %}

**Read the meters at switching.** For an initially uncharged capacitor in a series RC circuit, the capacitor voltage starts at zero and the initial current is $$V/R$$. For an initially unenergized series RL circuit, the current starts at zero and rises toward $$V/R$$. The ideal voltage step changes the derivative of the stored state. Check the initial meter readings before pressing Play.

## A series RLC circuit

{% include example-diagram.html id='rlc' %}

Current and capacitor voltage are two states. Use $$u=Ri+L\dot{i}+v_C$$ and $$i=C\dot{v}_C$$ to obtain $$LC\ddot{v}_C+RC\dot{v}_C+v_C=u$$. With capacitor voltage as the output, its transfer-function poles are the roots of $$LCs^2+RCs+1=0$$.

Divide by $$LC$$ and compare with $$s^2+(c/m)s+k/m=0$$ for the mass–spring–damper system. The circuit’s $$R/L$$ plays the role of $$c/m$$, and $$1/(LC)$$ plays the role of $$k/m$$.

{% include lab.html id='rlc' anchor='rlc-lab' %}

## Stage loading

{% include example-diagram.html id='rc-ladder' %}

Write a separate current balance for each capacitor node in a ladder circuit. The branch current between nodes depends on their voltage difference. Because each node appears in the other node’s equation, two connected stages generally behave differently from the product of their isolated responses. An ideal buffer is one way to remove loading.

The bottom wire connects both capacitors to the negative terminal of the 5 V step source. This **ground node** is the shared 0 V reference for both voltmeters. The ammeter reads the current between the stages.

<section class="worked-example" markdown="1">

### Worked example · Read the current from the node voltages

Suppose the voltmeters read 3.85 V at Node 1 and 3.14 V at Node 2. With a 1 kΩ resistor between them, the current is $$(3.85-3.14)/1000=0.00071\,\mathrm{A}$$. It flows from Node 1 to Node 2, so the ammeter reads about 0.71 mA.

</section>

{% include lab.html id='ladder' anchor='rc-ladder-lab' %}
