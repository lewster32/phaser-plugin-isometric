/**
* The MIT License (MIT)

* Copyright (c) 2014 Lewis Lane

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* 
*
*/

/**
 * @author       Lewis Lane <lew@rotates.org>
 * @copyright    2014 Lewis Lane (Rotates.org)
 * @license      {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @class Phaser.Plugin.Isometric
 * 
 * @classdesc
 * Isometric is a comprehensive axonometric plugin for Phaser which provides an API for handling axonometric projection of assets in 3D space to the screen.
 * The goal has been to mimic as closely as possible the existing APIs provided by Phaser for standard orthogonal 2D projection, but add a third dimension.
 * Also included is an Arcade-based 3D AABB physics engine, which again is closely equivalent in functionality and its API.
 * 
 * @constructor
 * @param {Phaser.Game} game The current game instance.
 */
Phaser.Plugin.Isometric = function (game, parent) {

    Phaser.Plugin.call(this, game, parent);
    this.projector = new Phaser.Plugin.Isometric.Projector(this.game, Phaser.Plugin.Isometric.CLASSIC);
    //  Add an instance of Isometric.Projector to game.iso if it doesn't exist already
    this.game.iso = this.game.iso || this.projector;
};

Phaser.Plugin.Isometric.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Isometric.prototype.constructor = Phaser.Plugin.Isometric;

Phaser.Plugin.Isometric.VERSION = '0.9.1';

//  Directional consts
Phaser.Plugin.Isometric.UP = 0;
Phaser.Plugin.Isometric.DOWN = 1;
Phaser.Plugin.Isometric.FORWARDX = 2;
Phaser.Plugin.Isometric.FORWARDY = 3;
Phaser.Plugin.Isometric.BACKWARDX = 4;
Phaser.Plugin.Isometric.BACKWARDY = 5;

//  Type consts
Phaser.Plugin.Isometric.ISOSPRITE = 'isosprite';
Phaser.Plugin.Isometric.ISOARCADE = 'isoarcade';
