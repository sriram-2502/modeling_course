---
title: "Second-Order Systems"
study: exam-1
number: '04'
unit: "Dynamic response and modeling foundations"
summary: "Connect characteristic roots to the free response of a mass–spring–damper system."
slides: /materials/lectures/lecture-04.pdf
notes: /materials/lectures/lecture-04-notes.pdf
supplement: /materials/lectures/lecture-04-complex-roots.pdf
lab: second-order
activity: base-response
opening_questions:
  - 'If you pull a mass away from equilibrium and release it, will it cross the equilibrium position?'
  - 'Where do the roots move when you stiffen the spring and keep the mass and damper fixed?'
takeaways:
  - 'A second-order free response needs two initial conditions, typically position and velocity.'
  - 'For a conjugate root pair, the real part sets the decay or growth rate and the imaginary magnitude sets the oscillation frequency.'
  - 'Critical damping occurs at $$c=2\sqrt{mk}$$. The two roots coincide on the real axis.'
---

## From an ODE to its roots

A second-order model needs two initial conditions, typically displacement $$x(0)$$ and velocity $$\dot{x}(0)$$. For the homogeneous equation $$a\ddot{x}+b\dot{x}+cx=0$$, substitute the trial solution $$x=Ce^{st}$$. Differentiation introduces factors of $$s$$ and $$s^2$$. Cancel the common nonzero exponential to obtain $$as^2+bs+c=0$$.

| Characteristic roots | Real-valued free response |
|:--|:--|
| Two distinct real roots $$s_1$$ and $$s_2$$ | $$C_1e^{s_1t}+C_2e^{s_2t}$$ |
| Repeated root $$s$$ | $$(C_1+C_2t)e^{st}$$ |
| Conjugate roots $$\alpha\pm j\beta$$ | $$e^{\alpha t}[C_1\cos(\beta t)+C_2\sin(\beta t)]$$ |

The initial conditions determine $$C_1$$ and $$C_2$$. For a conjugate pair, $$\alpha$$ governs the envelope and $$\beta$$ gives the angular frequency. Negative real parts give decay, positive real parts give growth, and a purely imaginary nonzero pair produces sustained oscillation.

## Build a mass–spring–damper model

{% include example-diagram.html id='mass-spring-damper' %}

Take positive displacement $$x$$ to the right and measure it from equilibrium. The spring contributes $$-kx$$ and the viscous damper contributes $$-c\dot{x}$$. Newton’s second law gives

$$
m\ddot{x}+c\dot{x}+kx=f(t).
$$

Here $$m$$ is in kg, $$c$$ in N·s/m, and $$k$$ in N/m. Set $$f(t)=0$$ for free response. Dividing by $$m$$ gives $$\ddot{x}+2\beta\dot{x}+\omega_n^2x=0$$, where $$\beta=c/(2m)$$ is the damping rate and $$\omega_n=\sqrt{k/m}$$ is the undamped natural frequency. The damping ratio $$\zeta=\beta/\omega_n$$ is dimensionless, and the roots are $$s=-\beta\pm\sqrt{\beta^2-\omega_n^2}$$.

| Damping ratio | What to expect |
|:--|:--|
| $$\zeta=0$$ | Sustained oscillation at $$\omega_n$$ |
| $$0<\zeta<1$$ | Decaying oscillation at $$\omega_d=\omega_n\sqrt{1-\zeta^2}$$ |
| $$\zeta=1$$ | Repeated root at $$-\omega_n$$, at the boundary between oscillatory and non-oscillatory behavior |
| $$\zeta>1$$ | Two negative real roots. The slower mode can dominate the return to equilibrium. |

{% include lab.html id=page.lab %}

<section class="worked-example" markdown="1">

## Worked example

Use the layout above with a 1 kg mass, a 4 N·s/m damper, and a 5 N/m spring. Pull the mass 0.10 m to the right and release it from rest. What displacement will you measure as it returns toward equilibrium?

For $$\ddot{x}+4\dot{x}+5x=0$$, the roots are $$-2\pm j$$. With $$x(0)=0.10\,\mathrm{m}$$ and $$\dot{x}(0)=0$$, evaluating the response and its derivative at $$t=0$$ gives $$C_1=0.10$$ and $$C_2=0.20$$. The resulting displacement is

$$
x(t)=0.10e^{-2t}\bigl(\cos t+2\sin t\bigr)\ \mathrm{m}.
$$

[Run these exact values in the cart simulation](?case=worked#interactive-lab). A release from 1 m scales every displacement by ten and gives the same roots.

Its envelope decays at $$2\,\mathrm{s}^{-1}$$ and its period is $$2\pi\,\mathrm{s}$$.

For comparison, $$\ddot{x}+6\dot{x}+9x=0$$ has the repeated root $$-3$$, so its free response has the form $$(C_1+C_2t)e^{-3t}$$. The equation $$\ddot{x}-4\dot{x}+3x=0$$ has positive roots at $$1$$ and $$3$$, so a nonzero mode grows.

</section>

## From free to forced response

Free response isolates the effect of initial displacement and velocity. The quarter-car problem introduces road motion as an input, so the forcing frequency matters too. In [Assignment 2]({{ '/assignments/#assignment-02' | relative_url }}), identify which part of the solution decays and which part remains while the road input continues.

## When does a mount isolate vibration?
{: #frequency-response}

Imagine a machine mounted on a vibrating floor. The floor moves through a fixed amplitude $$Y$$ while the forcing frequency $$\omega$$ changes. How large is the machine's **absolute** displacement $$X$$ after the transient dies away?

The spring and damper connect the mass to the moving floor. With upward displacement positive for both, their forces depend on relative motion. Newton's law gives

$$
m\ddot x+c(\dot x-\dot y)+k(x-y)=0.
$$

For sinusoidal base motion, the steady displacement amplitude ratio is

$$
T=\frac{X}{Y}=\sqrt{\frac{1+(2\zeta r)^2}{(1-r^2)^2+(2\zeta r)^2}},\qquad r=\frac{\omega}{\omega_n}.
$$

At low frequency the mass follows the floor. Near resonance it can travel farther than the floor. Above $$r=\sqrt{2}$$, the mass displacement amplitude is smaller than the base amplitude. This criterion applies to the steady sinusoidal displacement comparison.

{% include activity.html id='base-response' anchor='isolation-demo' %}

**How would a vibration absorber differ?** An isolator changes the transmission path from the floor. A tuned absorber adds a second moving mass. In the ideal undamped, force-driven case, tune its spring and mass so that $$\sqrt{k_a/m_a}$$ equals the forcing frequency. The absorber can then supply the opposing spring force while the primary mass has zero steady harmonic displacement. Detuning and damping change that result.

## Two applications from the lecture

**Pendulum and humanoid balance.** Near the hanging position, the small-angle, undamped model satisfies $$\ddot{\theta}+(g/\ell)\theta=0$$. Near the upright position, the sign changes to $$\ddot{\theta}-(g/\ell)\theta=0$$. The first model has purely imaginary roots and bounded oscillations. The upright model has a positive root and a growing mode, which explains why a standing robot needs a means of stabilizing its motion.

**Passive quarter-car.** A one-mass model captures one mode. Adding independent body and wheel motion introduces a second mass and four states. The suspension forces depend on the relative body and wheel motion. The tire spring depends on the difference between wheel displacement and road height. [Lecture 14]({{ '/lectures/14-coupled-systems/' | relative_url }}) develops the coupled equations.
