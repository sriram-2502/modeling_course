---
title: "Predicting Quadruped Motion"
skill: vibration
number: '04'
domain: "System identification"
summary: "Fit a command-to-speed model on flat ground and test how it transfers to debris."
image: /assets/images/project-04.png
alt: "Animation preview from the quadruped project."
handout: /materials/projects/project-04.pdf
guide: /materials/projects/project-04-guide.pdf
starter: /materials/projects/project-04-starter.zip
---

## The modeling question

Can one model predict the same robot’s forward motion on two different terrains? The commanded speed and logged speed estimate describe the overall closed-loop response of the robot and its existing controller.

## What you do

Identify effective gain, damping ratio, and natural frequency using the prescribed training runs. Evaluate those parameters on separate runs and compare shared and terrain-specific fits. Explain what the measured input and output let you identify.

[Review second-order dynamic response]({{ '/lectures/04-second-order-systems/' | relative_url }}).
