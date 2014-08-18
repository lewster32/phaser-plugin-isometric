/**
 * Octree Constructor
 *
 * @class Phaser.Plugin.Isometric.Octree
 * @classdesc A Octree implementation based on Phaser.QuadTree.
 * Original version at https://github.com/timohausmann/quadtree-js/
 * 
 * @constructor
 * @param {number} x - The bottom-back coordinate of the octree.
 * @param {number} y - The bottom-back coordinate of the octree.
 * @param {number} z - The bottom-back coordinate of the octree.
 * @param {number} widthX - The width X (breadth) of the octree.
 * @param {number} widthY - The width Y (depth) of the octree.
 * @param {number} height - The height (Z) of the octree.
 * @param {number} [maxObjects=10] - The maximum number of objects per node.
 * @param {number} [maxLevels=4] - The maximum number of levels to iterate to.
 * @param {number} [level=0] - Which level is this?
 */
Phaser.Plugin.Isometric.Octree = function (x, y, z, widthX, widthY, height, maxObjects, maxLevels, level) {

    /**
     * @property {number} maxObjects - The maximum number of objects per node.
     * @default
     */
    this.maxObjects = 10;

    /**
     * @property {number} maxLevels - The maximum number of levels to break down to.
     * @default
     */
    this.maxLevels = 4;

    /**
     * @property {number} level - The current level.
     */
    this.level = 0;

    /**
     * @property {object} bounds - Object that contains the octree bounds.
     */
    this.bounds = {};

    /**
     * @property {array} objects - Array of octree children.
     */
    this.objects = [];

    /**
     * @property {array} nodes - Array of associated child nodes.
     */
    this.nodes = [];

    /**
     * @property {array} _empty - Internal empty array.
     * @private
     */
    this._empty = [];

    this.reset(x, y, z, widthX, widthY, height, maxObjects, maxLevels, level);

};

Phaser.Plugin.Isometric.Octree.prototype = {

    /**
     * Resets the QuadTree.
     *
     * @method Phaser.Plugin.Isometric.Octree#reset
     * @param {number} x - The bottom-back coordinate of the octree.
     * @param {number} y - The bottom-back coordinate of the octree.
     * @param {number} z - The bottom-back coordinate of the octree.
     * @param {number} widthX - The width X (breadth) of the octree.
     * @param {number} widthY - The width Y (depth) of the octree.
     * @param {number} height - The height (Z) of the octree.
     * @param {number} [maxObjects=10] - The maximum number of objects per node.
     * @param {number} [maxLevels=4] - The maximum number of levels to iterate to.
     * @param {number} [level=0] - Which level is this?
     */
    reset: function (x, y, z, widthX, widthY, height, maxObjects, maxLevels, level) {

        this.maxObjects = maxObjects || 10;
        this.maxLevels = maxLevels || 4;
        this.level = level || 0;

        this.bounds = {
            x: Math.round(x),
            y: Math.round(y),
            z: Math.round(z),
            widthX: widthX,
            widthY: widthY,
            height: height,
            subWidthX: Math.floor(widthX * 0.5),
            subWidthY: Math.floor(widthY * 0.5),
            subHeight: Math.floor(height * 0.5),
            frontX: Math.round(x) + Math.floor(widthX * 0.5),
            frontY: Math.round(y) + Math.floor(widthY * 0.5),
            top: Math.round(z) + Math.floor(height * 0.5)
        };

        this.objects.length = 0;
        this.nodes.length = 0;

    },

    /**
     * Populates this octree with the children of the given Group. In order to be added the child must exist and have a body property.
     *
     * @method Phaser.Plugin.Isometric.Octree#populate
     * @param {Phaser.Group} group - The Group to add to the octree.
     */
    populate: function (group) {

        group.forEach(this.populateHandler, this, true);

    },

    /**
     * Handler for the populate method.
     *
     * @method Phaser.Plugin.Isometric.Octree#populateHandler
     * @param {Phaser.Plugin.Isometric.IsoSprite|object} sprite - The Sprite to check.
     */
    populateHandler: function (sprite) {

        if (sprite.body && sprite.exists) {
            this.insert(sprite.body);
        }

    },

    /**
     * Split the node into 8 subnodes
     *
     * @method Phaser.Plugin.Isometric.Octree#split
     */
    split: function () {

        //  bottom four octants
        //  -x-y-z
        this.nodes[0] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.y, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x-y-z
        this.nodes[1] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.y, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  -x+y-z
        this.nodes[2] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.frontY, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x+y-z
        this.nodes[3] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.frontY, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));

        //  top four octants
        //  -x-y+z
        this.nodes[4] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.y, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x-y+z
        this.nodes[5] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.y, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  -x+y+z
        this.nodes[6] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.frontY, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x+y+z
        this.nodes[7] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.frontY, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
    },

    /**
     * Insert the object into the node. If the node exceeds the capacity, it will split and add all objects to their corresponding subnodes.
     *
     * @method Phaser.Plugin.Isometric.Octree#insert
     * @param {Phaser.Plugin.Isometric.Body|Phaser.Plugin.Isometric.Cube|object} body - The Body object to insert into the octree. Can be any object so long as it exposes x, y, z, frontX, frontY and top properties.
     */
    insert: function (body) {

        var i = 0;
        var index;

        //  if we have subnodes ...
        if (this.nodes[0] != null) {
            index = this.getIndex(body);

            if (index != -1) {
                this.nodes[index].insert(body);
                return;
            }
        }

        this.objects.push(body);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            //  Split if we don't already have subnodes
            if (this.nodes[0] == null) {
                this.split();
            }

            //  Add objects to subnodes
            while (i < this.objects.length) {
                index = this.getIndex(this.objects[i]);

                if (index != -1) {
                    //  this is expensive - see what we can do about it
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                } else {
                    i++;
                }
            }
        }

    },

    /**
     * Determine which node the object belongs to.
     *
     * @method Phaser.Plugin.Isometric.Octree#getIndex
     * @param {Phaser.Plugin.Isometric.Cube|object} cube - The bounds in which to check.
     * @return {number} index - Index of the subnode (0-7), or -1 if cube cannot completely fit within a subnode and is part of the parent node.
     */
    getIndex: function (cube) {

        //  default is that cube doesn't fit, i.e. it straddles the internal octants
        var index = -1;

        if (cube.x < this.bounds.frontX && cube.frontX < this.bounds.frontX) {
            if (cube.y < this.bounds.frontY && cube.frontY < this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into -x-y-z octant
                    index = 0;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into -x-y+z octant
                    index = 4;
                }
            } else if (cube.y > this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into -x+y-z octant
                    index = 2;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into -x+y+z octant
                    index = 6;
                }
            }
        } else if (cube.x > this.bounds.frontX) {
            if (cube.y < this.bounds.frontY && cube.frontY < this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into +x-y-z octant
                    index = 1;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into +x-y+z octant
                    index = 5;
                }
            } else if (cube.y > this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into +x+y-z octant
                    index = 3;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into +x+y+z octant
                    index = 7;
                }
            }
        }


        return index;

    },

    /**
     * Return all objects that could collide with the given IsoSprite or Cube.
     *
     * @method Phaser.Plugin.Isometric.Octree#retrieve
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Plugin.Isometric.Cube} source - The source object to check the Octree against. Either a IsoSprite or Cube.
     * @return {array} - Array with all detected objects.
     */
    retrieve: function (source) {

        var returnObjects, index;

        if (source instanceof Phaser.Plugin.Isometric.Cube) {
            returnObjects = this.objects;

            index = this.getIndex(source);
        } else {
            if (!source.body) {
                return this._empty;
            }

            returnObjects = this.objects;

            index = this.getIndex(source.body);
        }

        if (this.nodes[0]) {
            //  If cube fits into a subnode ..
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].retrieve(source));
            } else {
                //  If cube does not fit into a subnode, check it against all subnodes (unrolled for speed)
                returnObjects = returnObjects.concat(this.nodes[0].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[1].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[2].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[3].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[4].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[5].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[6].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[7].retrieve(source));
            }
        }

        return returnObjects;

    },

    /**
     * Clear the octree.
     * @method Phaser.Plugin.Isometric.Octree#clear
     */
    clear: function () {

        this.objects.length = 0;

        var i = this.nodes.length;

        while (i--) {
            this.nodes[i].clear();
            this.nodes.splice(i, 1);
        }

        this.nodes.length = 0;
    }

};

Phaser.Plugin.Isometric.Octree.prototype.constructor = Phaser.Plugin.Isometric.Octree;

/**
 * Visually renders an Octree to the display.
 *
 * @method Phaser.Utils.Debug#octree
 * @param {Phaser.Plugin.Isometric.Octree} octree - The octree to render.
 * @param {string} color - The color of the lines in the quadtree.
 */
Phaser.Utils.Debug.prototype.octree = function (octree, color) {

    color = color || 'rgba(255,0,0,0.3)';

    this.start();

    var bounds = octree.bounds,
        i, points;

    if (octree.nodes.length === 0) {

        this.context.strokeStyle = color;

        var cube = new Phaser.Plugin.Isometric.Cube(bounds.x, bounds.y, bounds.z, bounds.widthX, bounds.widthY, bounds.height);
        var corners = cube.getCorners();

        var posX = -this.game.camera.x;
        var posY = -this.game.camera.y;

        points = corners.slice(0, corners.length);

        points = points.map(function (p) {
            var newPos = this.game.iso.project(p);
            newPos.x += posX;
            newPos.y += posY;
            return newPos;
        });

        this.context.moveTo(points[0].x, points[0].y);
        this.context.beginPath();
        this.context.strokeStyle = color;

        this.context.lineTo(points[1].x, points[1].y);
        this.context.lineTo(points[3].x, points[3].y);
        this.context.lineTo(points[2].x, points[2].y);
        this.context.lineTo(points[6].x, points[6].y);
        this.context.lineTo(points[4].x, points[4].y);
        this.context.lineTo(points[5].x, points[5].y);
        this.context.lineTo(points[1].x, points[1].y);
        this.context.lineTo(points[0].x, points[0].y);
        this.context.lineTo(points[4].x, points[4].y);
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo(points[2].x, points[2].y);
        this.context.moveTo(points[3].x, points[3].y);
        this.context.lineTo(points[7].x, points[7].y);
        this.context.lineTo(points[6].x, points[6].y);
        this.context.moveTo(points[7].x, points[7].y);
        this.context.lineTo(points[5].x, points[5].y);
        this.context.stroke();
        this.context.closePath();

        for (i = 0; i < octree.objects.length; i++) {
            this.body(octree.objects[i].sprite, 'rgb(0,255,0)', false);
        }
    } else {
        for (i = 0; i < octree.nodes.length; i++) {
            this.octree(octree.nodes[i]);
        }
    }

    this.stop();

};
