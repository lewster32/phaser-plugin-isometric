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
