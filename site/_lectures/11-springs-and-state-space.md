---
title: "Springs and State Space"
study: exam-2
number: '11'
unit: "Mechanical systems and stability"
summary: "Build spring models and express a second-order ODE as a first-order state model."
slides: /materials/lectures/lecture-11.pdf
notes: /materials/lectures/lecture-11-notes.pdf
activity: modes
opening_questions:
  - 'Do two springs share the same force or the same displacement when connected in series?'
  - 'What happens to the middle spring when two identical masses move together by the same amount?'
takeaways:
  - 'Parallel springs share displacement, so their stiffnesses add. Series springs share force, so their compliances add.'
  - 'Use position and velocity as states to turn the second-order spring–mass equation into two first-order equations.'
  - 'A coupling spring responds to relative displacement. In a normal mode, the masses move at one frequency with a fixed displacement ratio.'
---

## Spring force and energy

{% include example-diagram.html id='spring-connections' %}

A linear spring exerts a restoring force proportional to displacement from its unstretched length. Two springs in parallel share displacement and their stiffnesses add. Springs in series share force, so their compliances add. An ideal spring stores energy $$\tfrac{1}{2}kx^2$$.

**Spring and damper in series.** For a massless junction the transmitted force is common. The total extension is $$x=x_s+x_d$$, where $$x_s=F/k$$ and $$\dot x_d=F/c$$. Differentiating gives $$\dot x=\dot F/k+F/c$$. If total extension is held fixed, the force relaxes with time constant $$c/k$$. This differs from parallel elements, which share the same extension.

## From an ODE to state equations

<section class="worked-example" markdown="1">

### Worked example · Choose states for a spring–mass system

Choose position $$x$$ and velocity $$v$$ as the states for $$m\ddot{x}+kx=f$$. The two equations are $$\dot{x}=v$$ and $$\dot{v}=-(k/m)x+f/m$$. In the form $$\dot{z}=Az+Bu$$ and $$y=Cz+Du$$, the position output uses $$C=[1,\;0]$$ and $$D=0$$. Choose the output from the physical measurement of interest.

</section>

## Coupled motion

A spring between two masses acts on their relative displacement and exerts equal and opposite forces. A normal mode describes a shape in which the masses oscillate at one frequency with fixed displacement ratios. Energy alternates between kinetic energy and spring energy in the undamped model.

{% include activity.html id=page.activity %}
