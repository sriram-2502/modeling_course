---
title: "Designing a Smoother Ride"
skill: states
number: '02'
domain: "Vehicle dynamics"
summary: "Fit damping models and choose one spring–damper setup for a road hump and uneven road."
image: /assets/images/project-02.png
alt: "Schematic of a passive quarter-car model with sprung and unsprung masses."
handout: /materials/projects/project-02.pdf
guide: /materials/projects/project-02-guide.pdf
starter: /materials/projects/project-02-starter.zip
---

## The modeling question

Which spring–damper pair gives a comfortable ride while controlling suspension motion? The passive quarter-car model uses a sprung body mass and an unsprung wheel mass. The road drives the wheel through the tire.

<figure>
  <img src="{{ '/assets/images/project-02.png' | relative_url }}" alt="Quarter-car schematic showing the body and wheel connected by a spring and damper above the road">
  <figcaption>Quarter-car schematic from the project material.</figcaption>
</figure>

## What you do

Fit linear and nonlinear damper curves, verify the model, then evaluate candidate setups over the assigned road profiles. Use the selected project metrics to explain ride comfort, suspension travel, and road holding, including tradeoffs. The code guide describes the starter’s state variables and the MATLAB/Simulink workflow.

[Review the coupled-systems lecture]({{ '/lectures/14-coupled-systems/' | relative_url }}).

[Explore the quarter-car model]({{ '/lectures/14-coupled-systems/#a-passive-quarter-car' | relative_url }}) to see how a bump moves the body and wheel.
