**PLEASE NOTE, this plug-in is no longer in active development and compatibility with current versions of Phaser cannot be assured.**

Fork changelog
==============
[02.12.2015] - Fixes and utility functions courtesy of @[wassname](https://github.com/wassname/)

[23.11.2015] - Fixed typo courtesy of @[wassname](https://github.com/wassname/)

[02.04.2015] - Fix for Phaser 2.3 courtesy of @[mfpierre](https://github.com/mfpierre)

[14.10.2014] - Added Typescript Support


Phaser Isometric Plug-in
=======================

Phaser Isometric is a comprehensive axonometric plugin for Phaser which provides an API for handling axonometric projection of assets in 3D space to the screen.
The goal has been to mimic as closely as possible the existing APIs provided by Phaser for standard orthogonal 2D projection, but add a third dimension.
Also included is an Arcade-based 3D AABB physics engine, which again is closely equivalent in functionality and its API.

Features
========

* Familiar Phaser API - if you've grasped the basics of Phaser, you can use this!
* 3D geometry helpers in the form of Point3 and Cube
* Adjustable axonometric projection angle to allow for classic 2:1 pixel dimetric, true 120° isometric or any angle you like via ```game.iso.projectionAngle```
* Simple x+y (with z fudging) and advanced cubic topological depth sorting
* Arcade Physics derived 3D physics engine
* Helpful debug utilities
* Familiar factory methods added to GameObjectFactory and GameObjectCreator so you can do ```game.add.isoSprite```
* Probably not many bugs!
