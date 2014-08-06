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
 * Isometric is a comprehensive axonometric plugin for Phaser which provides an API for handling axonometric projection of assets in 3D space to the screen.
 * The goal has been to mimic as closely as possible the existing APIs provided by Phaser for standard orthogonal 2D projection, but add a third dimension.
 * Also included is an Arcade-based 3D AABB physics engine, which again is closely equivalent in functionality and its API.
 *
 * @class Phaser.Plugin.Isometric
 * @constructor
 *
 * @param {Phaser.Game} game The current game instance.
 */
Phaser.Plugin.Isometric = function (game, parent) {

    Phaser.Plugin.call(this, game, parent);

    //  Add an instance of Isometric.Projector to game.iso if it doesn't exist already
    this.game.iso = this.game.iso || new Phaser.Plugin.Isometric.Projector(this.game, Phaser.Plugin.Isometric.CLASSIC);
};

Phaser.Plugin.Isometric.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Isometric.prototype.constructor = Phaser.Plugin.Isometric;

Phaser.Plugin.Isometric.VERSION = '0.7.1';

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

//  Projection angles
Phaser.Plugin.Isometric.CLASSIC = 0.5;
Phaser.Plugin.Isometric.TRUE = 0.6154797093263624;

/**
 * Creates a new Isometric Projector object, which has helpers for projecting x, y and z coordinates into axonometric x and y equivalents.
 *
 * @class Phaser.Plugin.Isometric.Projector
 * @constructor
 * @param {Phaser.Game} game - The current game object.
 * @param {number} projectionRatio - The ratio of the axonometric projection.
 * @return {Phaser.Plugin.Isometric.Cube} This Cube object.
 */
Phaser.Plugin.Isometric.Projector = function (game, projectionRatio) {

    /**
     * @property {Phaser.Game} game - The current game object.
     */
    this.game = game;

    /**
     * @property {number} projectionRatio - The ratio of the axonometric projection.
     * @default
     */
    this.projectionRatio = projectionRatio || Phaser.Plugin.Isometric.CLASSIC;

    /**
     * @property {Phaser.Point} anchor - The x and y offset multipliers as a ratio of the game world size.
     * @default
     */
    this.anchor = new Phaser.Point(0.5, 0);
};

Phaser.Plugin.Isometric.Projector.prototype = {

    /**
     * Use axonometric projection to transform a 3D Point3 coordinate to a 2D Point coordinate. If given the coordinates will be set into the object, otherwise a brand new Point object will be created and returned.
     * @method Phaser.Plugin.Isometric.Projector#project
     * @param {Phaser.Plugin.Isometric.Point3} point3 - The Point3 to project from.
     * @param {Phaser.Point} out - The Point to project to.
     * @return {Phaser.Point} The transformed Point.
     */
    project: function (point3, out) {
        if (typeof out === "undefined") {
            out = new Phaser.Point();
        }

        out.x = point3.x - point3.y;
        out.y = ((point3.x + point3.y) * this.projectionRatio) - point3.z;


        out.x += this.game.world.width * this.anchor.x;
        out.y += this.game.world.height * this.anchor.y;

        return out;
    },

    /**
     * Use axonometric projection to transform a 3D Point3 coordinate to a 2D Point coordinate, ignoring the z-axis. If given the coordinates will be set into the object, otherwise a brand new Point object will be created and returned.
     * @method Phaser.Plugin.Isometric.Projector#projectXY
     * @param {Phaser.Plugin.Isometric.Point3} point3 - The Point3 to project from.
     * @param {Phaser.Point} out - The Point to project to.
     * @return {Phaser.Point} The transformed Point.
     */
    projectXY: function (point3, out) {
        if (typeof out === "undefined") {
            out = new Phaser.Point();
        }

        out.x = point3.x - point3.y;
        out.y = ((point3.x + point3.y) * this.projectionRatio);


        out.x += this.game.world.width * this.anchor.x;
        out.y += this.game.world.height * this.anchor.y;

        return out;
    }

};
