/**
 * @class Phaser.Plugin.Isometric.Projector
 *
 * @classdesc
 * Creates a new Isometric Projector object, which has helpers for projecting x, y and z coordinates into axonometric x and y equivalents.
 *
 * @constructor
 * @param {Phaser.Game} game - The current game object.
 * @param {number} projectionAngle - The angle of the axonometric projection in radians. Defaults to approx. 0.4636476 (Math.atan(0.5) which is suitable for 2:1 pixel art dimetric)
 * @return {Phaser.Plugin.Isometric.Cube} This Cube object.
 */
Phaser.Plugin.Isometric.Projector = function (game, projectionAngle) {

    /**
     * @property {Phaser.Game} game - The current game object.
     */
    this.game = game;

    /**
     * @property {array} _transform - The pre-calculated axonometric transformation values.
     * @private
     */
    this._transform = null;

    /**
     * @property {number} _projectionAngle - The cached angle of projection in radians.
     * @private
     */
    this._projectionAngle = 0;

    /**
     * @property {number} projectionAngle - The angle of projection in radians.
     * @default
     */
    this.projectionAngle = projectionAngle || Phaser.Plugin.Isometric.CLASSIC;

    /**
     * @property {Phaser.Point} anchor - The x and y offset multipliers as a ratio of the game world size.
     * @default
     */
    this.anchor = new Phaser.Point(0.5, 0);


};

//  Projection angles
Phaser.Plugin.Isometric.CLASSIC = Math.atan(0.5);
Phaser.Plugin.Isometric.ISOMETRIC = Math.PI / 6;
Phaser.Plugin.Isometric.MILITARY = Math.PI / 4;

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

        out.x = (point3.x - point3.y) * this._transform[0];
        out.y = ((point3.x + point3.y) * this._transform[1]) - point3.z;

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

        out.x = (point3.x - point3.y) * this._transform[0];
        out.y = (point3.x + point3.y) * this._transform[1];

        out.x += this.game.world.width * this.anchor.x;
        out.y += this.game.world.height * this.anchor.y;

        return out;
    },

    /**
     * Use reverse axonometric projection to transform a 2D Point coordinate to a 3D Point3 coordinate. If given the coordinates will be set into the object, otherwise a brand new Point3 object will be created and returned.
     * @method Phaser.Plugin.Isometric.Projector#unproject
     * @param {Phaser.Plugin.Isometric.Point} point - The Point to project from.
     * @param {Phaser.Plugin.Isometric.Point3} out - The Point3 to project to.
     * @param {number} [z] - Specified z-plane to project to.
     * @return {Phaser.Plugin.Isometric.Point3} The transformed Point3.
     */
    unproject: function (point, out, z) {
        if (typeof out === "undefined") {
            out = new Phaser.Plugin.Isometric.Point3();
        }

        z = z || 0;


        var x = point.x - this.game.world.x - (this.game.world.width * this.anchor.x);
        var y = point.y - this.game.world.y - (this.game.world.height * this.anchor.y) + z;

        out.x = x / (2 * this._transform[0]) + y / (2 * this._transform[1]);
        out.y = -(x / (2 * this._transform[0])) + y / (2 * this._transform[1]);
        out.z = z;

        return out;
    },

    /**
     * Perform a simple depth sort on all IsoSprites in the passed group. This function is fast and will accurately sort items on a single z-plane, but breaks down when items are above/below one another in certain configurations.
     *
     * @method Phaser.Plugin.Isometric.Projector#simpleSort
     * @param {Phaser.Group} group - A group of IsoSprites to sort.
     */
    simpleSort: function(group) {
        group.sort("depth");
    },

    /**
     * Perform a volume-based topological sort on all IsoSprites in the passed group or array. Will use the body if available, otherwise it will use an automatically generated bounding cube. If a group is passed, <code>Phaser.Group#sort</code> is automatically called on the specified property.
     * Routine adapted from this tutorial: http://mazebert.com/2013/04/18/isometric-depth-sorting/
     *
     * @method Phaser.Plugin.Isometric.Projector#topologicalSort
     * @param {Phaser.Group|array} group - A group or array of IsoSprites to sort.
     * @param {number} [padding] - The amount of extra tolerance in the depth sorting; larger values reduce flickering when objects collide, but also introduce inaccuracy when objects are close. Defaults to 1.5.
     * @param {string} [prop] - The property to store the depth information on. If not specified, it will default to 'isoDepth'.
     */
    topologicalSort: function (group, padding, prop) {
        var children, isGroup;

        if (group instanceof Phaser.Group) {
            children = group.children;
            isGroup = true;
        }
        else if (group.length) {
            children = group;
        }
        else {
            return;
        }

        prop = prop || "isoDepth";

        if (typeof padding === "undefined") {
            padding = 1.5;
        }
        else {
            padding = padding;
        }

        var a, b, i, j, bounds, behindIndex, len = children.length;

        for (i = 0; i < len; i++) {
            a = children[i];
            behindIndex = 0;
            if (!a.isoSpritesBehind) {
                a.isoSpritesBehind = [];
            }

            for (j = 0; j < len; j++) {
                if (i != j) {
                    b = children[j];
                    bounds = a.body || a.isoBounds;
                    if (b._isoPosition.x + padding < bounds.frontX - padding && b._isoPosition.y + padding < bounds.frontY - padding && b._isoPosition.z + padding < bounds.top - padding) {
                        a.isoSpritesBehind[behindIndex++] = b;
                    }
                }
            }
            a.isoVisitedFlag = false;
        }

        var _sortDepth = 0;

        function visitNode(node) {
            if (node.isoVisitedFlag === false) {
                node.isoVisitedFlag = true;
                var spritesBehindLength = node.isoSpritesBehind.length;
                for (var k = 0; k < spritesBehindLength; k++) {
                    if (node.isoSpritesBehind[k] === null) {
                        break;
                    }
                    else {
                        visitNode(node.isoSpritesBehind[k]);
                        node.isoSpritesBehind[k] = null;
                    }
                }

                node[prop] = _sortDepth++;
            }
        }

        for (i = 0; i < len; i++) {
            visitNode(children[i]);
        }

        if (isGroup) {
            group.sort(prop);
        }
    }

};

/**
 * @name Phaser.Plugin.Isometric.Projector#projectionAngle
 * @property {number} projectionAngle - The angle of axonometric projection.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Projector.prototype, "projectionAngle", {

    get: function () {
        return this._projectionAngle;
    },

    set: function (value) {

        if (value === this._projectionAngle) {
            return;
        }

        this._projectionAngle = value;

        this._transform = [Math.cos(this._projectionAngle), Math.sin(this._projectionAngle)];
    }

});
