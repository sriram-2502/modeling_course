---
title: "Convolution and System Response"
study: exam-1
number: '06'
unit: "Dynamic response and modeling foundations"
summary: "Find the output of a linear time-invariant model by accumulating shifted impulse responses."
slides: /materials/lectures/lecture-06.pdf
notes: /materials/lectures/lecture-06-notes.pdf
activity: convolution
opening_questions:
  - 'A two-second push ends. How can it still affect the spring–mass–damper displacement later?'
  - 'How can the response to a single tap predict the response to a full force history?'
takeaways:
  - 'Convolution adds the shifted, weighted impulse responses from all earlier input contributions.'
  - 'A finite rectangular push is a step followed by a delayed step of opposite sign. Their shifted responses add.'
  - 'Convolution gives the zero-state response. Add the free response when the initial conditions are nonzero.'
---

## What does one earlier tap contribute?
{: #two-taps}

Imagine giving the cart a quick push to the right with your fingertip and immediately letting go. That brief contact is the **tap**. Its **impulse** $$J=\int F(t)\,dt$$ is the area under the force–time curve. For example, a 100 N force applied for 0.01 s delivers $$1\,\mathrm{N\,s}$$ of impulse.

In the demo, the contact is so short compared with one oscillation that we model it as instantaneous. The 1 kg cart starts at rest at equilibrium. A rightward impulse of $$1\,\mathrm{N\,s}$$ increases its velocity by $$\Delta v=J/m=1\,\mathrm{m/s}$$. Its position is continuous through the tap. Once contact ends, the spring and damper govern the motion.

Tap the cart at 0 s and again at 1 s. Pause at 3 s. The first response is three seconds old, so it contributes $$J h(3)$$ to the displacement. The second is two seconds old, so it contributes $$J h(2)$$. Here $$h$$ gives displacement per unit impulse after that much time has elapsed. Both taps pushed to the right. Can one contribution now point left?

{% include activity.html id='tap-sum' anchor='tap-experiment' %}

Now divide a sustained force into slices. A slice at past time $$\tau$$ delivers impulse $$F(\tau)\Delta\tau$$. At the observation time $$t$$ its displacement contribution is approximately $$F(\tau)\Delta\tau\,h(t-\tau)$$. Sum the slices and shrink their widths to obtain the integral below.

## From an impulse to an arbitrary input

A linear time-invariant system’s impulse response $$h(t)$$ describes its zero-state response to a unit impulse. Linearity lets us scale a contribution by the input value and add contributions. Time invariance lets us shift $$h$$ by the time at which the contribution is applied.

For causal signals and zero initial conditions,

$$
y(t)=\int_0^t h(t-\tau)u(\tau)\,d\tau.
$$

The term $$h(t-\tau)$$ describes the amount of response left at $$t$$ from input applied at $$\tau$$. The Laplace-domain relation is $$Y(s)=H(s)U(s)$$.

For the mass–spring–damper system, take $$u=F$$ and $$y=x$$. The impulse response $$h(t)$$ describes the displacement caused by one unit of impulse area. The integral adds the displacement contributions from all earlier portions of the force.

{% include activity.html id=page.activity %}

[Compare a step, an ideal impulse, and two finite pulses on this same mass]({{ '/lectures/07-transfer-functions/#add-the-input' | relative_url }}).

<section class="worked-example" markdown="1">

## Worked response to a two-second push

Let $$g(t)$$ be the displacement produced by a sustained 1 N step on this same mass. It is the accumulated impulse response $$g(t)=\int_0^t h(\lambda)\,d\lambda$$ for $$t\geq0$$, and zero for $$t<0$$. A 1 N force that turns off at 2 s is a positive step at time zero and a negative step at 2 s. Linearity and time shifting give

$$
x(t)=g(t)-g(t-2).
$$

Before 2 s, only the first term contributes. After 2 s, the force is zero and the two displacement responses continue to combine. This gives the same result as integrating $$F(\tau)h(t-\tau)$$ over the time the force was applied. For nonzero initial conditions, add the free response separately.

</section>

## Check the endpoints

For an ordinary initial displacement with no impulse in the displacement signal, $$x(0^+)=\lim_{s\to\infty}sX(s)$$. For a rational transform, if all poles of $$sX(s)$$ lie strictly in the left half-plane, $$x(\infty)=\lim_{s\to0}sX(s)$$. The resting, damped cart returns to zero after a finite push. A sustained 1 N step on the 16 N/m spring instead settles at 0.0625 m. Check the endpoint against the force balance before accepting a transform calculation.

[Convolution practice examples (PDF)]({{ '/materials/lectures/examples-convolution.pdf' | relative_url }})
