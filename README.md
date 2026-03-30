# Algae-Cleaner-Simulator

You are a snail trying to clean your fish tank. Move your mouse around to eat the algae and prevent the tank from building up too much green! 'Left-click' to make some bubbles!

## Overview

Algae Cleaner is an interactive fish tank simulation where you play as a snail suctioned to the inside of a glass tank. Procedurally growing algae blobs creep across the surface — eat them before they take over.
The project combines custom generative art systems, player-driven interaction, and original hand-drawn assets into a self-contained little ecosystem.

## How to Play

- Move your mouse — guide the snail to eat algae
- Left-click — spawn bubbles
- Don't let the tank go green!

## Tech Stack

- p5.js (WEBGL mode)
- Procreate

## Features

- Implemented a metaball system where algae blobs grow, oscillate, and bridge neighboring blobs with bezier curves to create organic fluid shapes.
- Built a radial gradient vignette that grows greener as the algae array fills, providing passive feedback on tank cleanliness without UI elements.
- Integrated an L-system seaweed renderer with boundary detection to prevent branches from escaping tank walls.
- Added click-to-spawn bubble particles and a persistent snail trail to reinforce the player's presence on the glass.
- Wrote a reusable parametric star function supporting straight-edged and bezier-curved styles for decorative particle details.
- Drew original fish, snail, and environmental assets across a full layered tank scene.
