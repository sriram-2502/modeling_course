---
title: "Connecting System Representations"
study: final-exam
number: '23'
unit: "System representations and feedback"
summary: "Explain how ODEs, state space, transfer functions, and phase portraits describe the same dynamics."
activity: representations
slides: /materials/lectures/lecture-23.pdf
opening_questions:
  - 'Which representation would you choose to compare two measured outputs from the same state model?'
  - 'Why can an eigenvalue appear in a state model and be absent from a particular transfer function?'
takeaways:
  - 'Choose a representation to match the question. ODEs show balances, state equations expose internal variables, and transfer functions describe input-to-output behavior.'
  - 'In a minimal realization, the state-matrix eigenvalues are the transfer-function poles. A canceled mode can still affect internal motion in a nonminimal realization.'
  - 'First-order systems in different domains share the same normalized step response when their time constants match.'
---

## Separate the model from its representation

An ODE states the governing balance. A state model makes the evolving variables explicit. A block diagram exposes how signals and integrations connect. A transfer function describes one input-to-output map under zero initial conditions.

For $$\dot{z}=Az+Bu$$ and $$y=Cz+Du$$, take the Laplace transform with zero initial state to obtain

$$
G(s)=C(sI-A)^{-1}B+D.
$$

The roots of $$\det(sI-A)$$ are eigenvalues. In a minimal realization they also appear as transfer-function poles. Modes that cancel in an input-output map can still appear in the state model.

## Follow one release through every representation
{: #one-release}

Release a 1 kg mass from 1 m at zero speed. Use $$c=2\,\mathrm{N\,s/m}$$ and $$k=5\,\mathrm{N/m}$$. There is no applied force after release. How can there be motion when the input is zero?

The force balance gives $$\ddot x+2\dot x+5x=f$$. Writing $$z=[x,\dot x]^T$$ gives

$$
\dot z=\begin{bmatrix}0&1\\-5&-2\end{bmatrix}z+\begin{bmatrix}0\\1\end{bmatrix}f.
$$

The characteristic roots, eigenvalues, and force-to-position transfer-function poles are all $$-1\pm2j$$. With the given initial state the free response is $$x(t)=e^{-t}(\cos 2t+\tfrac12\sin 2t)$$ m. The transfer function $$1/(s^2+2s+5)$$ describes the separate zero-state response to force. Here the initial spring energy supplies the motion.

{% include activity.html id=page.activity %}

**Can a measurement hide a mode?** Take two independent states satisfying $$\dot z_1=-z_1+u$$ and $$\dot z_2=-3z_2+u$$. Measuring only $$z_1$$ gives $$Y/U=1/(s+1)$$ even though the state matrix also has eigenvalue $$-3$$. Measuring $$z_1+z_2$$ reveals both modes. Choosing the sensor is part of choosing the model's output.

## Transfer the method to another domain

Compare a first-order RC circuit, a thermal enclosure, and a tank with a linear outlet. Each has a storage element and a loss or resistance path. The variables and units change, but the first-order time constant, equilibrium, and exponential response carry over. Choose which representation best answers the measurement or design question.

Compare the single real pole of the [series RC circuit]({{ '/lectures/17-electrical-circuits/#a-series-rc-circuit' | relative_url }}) with the pole of the [thermal enclosure]({{ '/lectures/22-thermal-systems/#a-lumped-thermal-model' | relative_url }}). Match the time constants in seconds to make the normalized responses coincide.

<section class="worked-example" markdown="1">

### Worked example · Compare electrical and thermal time constants

A 10 kΩ resistor with a 2 mF capacitor gives a time constant of 20 s. So does a thermal resistance of 0.2 K/W with a thermal capacitance of 100 J/K. Both models have a pole at $$-0.05\,\mathrm{s}^{-1}$$ and complete about 63% of their step response in 20 s.

</section>
