---
title: "Standing and Walking in Balance"
skill: stability
number: '01'
domain: "Robotics"
summary: "Fit a linear inverted pendulum model and test its prediction horizon in standing and walking."
image: /assets/images/project-01.png
alt: "A humanoid diagram comparing body motion and support in standing and walking."
handout: /materials/projects/project-01.pdf
guide: /materials/projects/project-01-guide.pdf
starter: /materials/projects/project-01-starter.zip
---

## The modeling question

How far ahead can a reduced model predict the motion of a humanoid when it is pushed? Use simulation data for the Unitree G1, including known external force and ground-support measurements. Fit the effective model separately for standing and walking.

## What you do

Use the small-push runs to identify the model, then keep the fitted coefficients fixed while testing different disturbances and prediction horizons. Report where the model remains useful and use the residuals to identify conditions it misses.

[Review the second-order models]({{ '/lectures/04-second-order-systems/' | relative_url }}).
