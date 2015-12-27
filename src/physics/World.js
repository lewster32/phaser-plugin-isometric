/**
 * IsoArcade Physics constructor.
 *
 * @class Phaser.Plugin.Isometric.Arcade
 * @classdesc IsoArcade Physics Constructor
 * @constructor
 * @param {Phaser.Game} game reference to the current game instance.
 */
Phaser.Plugin.Isometric.Arcade = function (game) {

    /**
     * @property {Phaser.Game} game - Local reference to game.
     */
    this.game = game;

    /**
     * @property {Phaser.Plugin.Isometric.Point3} gravity - The World gravity setting. Defaults to x: 0, y: 0, z: 0 or no gravity.
     */
    this.gravity = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Cube} bounds - The bounds inside of which the physics world exists. Defaults to match the world bounds relatively closely given the isometric projection.
     */
    this.bounds = new Phaser.Plugin.Isometric.Cube(0, 0, 0, game.world.width * 0.5, game.world.width * 0.5, game.world.height);

    /**
     * Set the checkCollision properties to control for which bounds collision is processed.
     * For example checkCollision.down = false means Bodies cannot collide with the World.bounds.bottom.
     * @property {object} checkCollision - An object containing allowed collision flags.
     */
    this.checkCollision = {
        up: true,
        down: true,
        frontX: true,
        frontY: true,
        backX: true,
        backY: true
    };

    /**
     * @property {number} maxObjects - Used by the QuadTree/Octree to set the maximum number of objects per quad.
     */
    this.maxObjects = 10;

    /**
     * @property {number} maxLevels - Used by the QuadTree/Octree to set the maximum number of iteration levels.
     */
    this.maxLevels = 4;

    /**
     * @property {number} OVERLAP_BIAS - A value added to the delta values during collision checks.
     */
    this.OVERLAP_BIAS = 4;

    /**
     * @property {boolean} forceX - If true World.separate will always separate on the X and Y axes before Z. Otherwise it will check gravity totals first.
     */
    this.forceXY = false;

    /**
     * @property {boolean} skipTree - If true an Octree/QuadTree will never be used for any collision. Handy for tightly packed games. See also Body.skipTree.
     */
    this.skipTree = false;

    /**
     * @property {boolean} useQuadTree - If true, the collision/overlap routines will use a QuadTree, which will ignore the z position of objects when determining potential collisions. This will be faster if you don't do a lot of stuff on the z-axis.
     */
    this.useQuadTree = false;

    /**
     * @property {Phaser.QuadTree} quadTree - The world QuadTree.
     */
    this.quadTree = new Phaser.QuadTree(this.bounds.x, this.bounds.y, this.bounds.widthX, this.bounds.widthY, this.maxObjects, this.maxLevels);

    /**
     * @property {Phaser.Plugin.Isometric.Octree} octree - The world Octree.
     */
    this.octree = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.y, this.bounds.z, this.bounds.widthX, this.bounds.widthY, this.bounds.height, this.maxObjects, this.maxLevels);

    //  Avoid gc spikes by caching these values for re-use

    /**
     * @property {number} _overlap - Internal cache var.
     * @private
     */
    this._overlap = 0;

    /**
     * @property {number} _maxOverlap - Internal cache var.
     * @private
     */
    this._maxOverlap = 0;

    /**
     * @property {number} _velocity1 - Internal cache var.
     * @private
     */
    this._velocity1 = 0;

    /**
     * @property {number} _velocity2 - Internal cache var.
     * @private
     */
    this._velocity2 = 0;

    /**
     * @property {number} _newVelocity1 - Internal cache var.
     * @private
     */
    this._newVelocity1 = 0;

    /**
     * @property {number} _newVelocity2 - Internal cache var.
     * @private
     */
    this._newVelocity2 = 0;

    /**
     * @property {number} _average - Internal cache var.
     * @private
     */
    this._average = 0;

    /**
     * @property {Array} _mapData - Internal cache var.
     * @private
     */
    this._mapData = [];

    /**
     * @property {boolean} _result - Internal cache var.
     * @private
     */
    this._result = false;

    /**
     * @property {number} _total - Internal cache var.
     * @private
     */
    this._total = 0;

    /**
     * @property {number} _angle - Internal cache var.
     * @private
     */
    this._angle = 0;

    /**
     * @property {number} _dx - Internal cache var.
     * @private
     */
    this._dx = 0;

    /**
     * @property {number} _dy - Internal cache var.
     * @private
     */
    this._dy = 0;

    /**
     * @property {number} _dz - Internal cache var.
     * @private
     */
    this._dz = 0;

};

Phaser.Plugin.Isometric.Arcade.prototype.constructor = Phaser.Plugin.Isometric.Arcade;

Phaser.Plugin.Isometric.Arcade.prototype = {

    /**
     * Updates the size of this physics world.
     *
     * @method Phaser.Plugin.Isometric.Arcade#setBounds
     * @param {number} x - Bottom rear most corner of the world.
     * @param {number} y - Bottom rear most corner of the world.
     * @param {number} z - Bottom rear most corner of the world.
     * @param {number} widthX - New X width (breadth) of the world. Can never be smaller than the Game.width.
     * @param {number} widthY - New Y width (depth) of the world. Can never be smaller than the Game.width.
     * @param {number} height - New height of the world. Can never be smaller than the Game.height.
     */
    setBounds: function (x, y, z, widthX, widthY, height) {

        this.bounds.setTo(x, y, z, widthX, widthY, height);

    },

    /**
     * Updates the size of this physics world to match the size of the game world.
     *
     * @method Phaser.Plugin.Isometric.Arcade#setBoundsToWorld
     */
    setBoundsToWorld: function () {

        this.bounds.setTo(0, 0, 0, this.game.world.width * 0.5, this.game.world.width * 0.5, this.game.world.height);

    },

    /**
     * This will create an IsoArcade Physics body on the given game object or array of game objects.
     * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
     *
     * @method Phaser.Plugin.Isometric.Arcade#enable
     * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
     * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
     */
    enable: function (object, children) {

        if (typeof children === 'undefined') {
            children = true;
        }

        var i = 1;

        if (Array.isArray(object)) {
            i = object.length;

            while (i--) {
                if (object[i] instanceof Phaser.Group) {
                    //  If it's a Group then we do it on the children regardless
                    this.enable(object[i].children, children);
                } else {
                    this.enableBody(object[i]);

                    if (children && object[i].hasOwnProperty('children') && object[i].children.length > 0) {
                        this.enable(object[i], true);
                    }
                }
            }
        } else {
            if (object instanceof Phaser.Group) {
                //  If it's a Group then we do it on the children regardless
                this.enable(object.children, children);
            } else {
                this.enableBody(object);

                if (children && object.hasOwnProperty('children') && object.children.length > 0) {
                    this.enable(object.children, true);
                }
            }
        }

    },

    /**
     * Creates an IsoArcade Physics body on the given game object.
     * A game object can only have 1 physics body active at any one time, and it can't be changed until the body is nulled.
     *
     * @method Phaser.Plugin.Isometric.Arcade#enableBody
     * @param {object} object - The game object to create the physics body on. A body will only be created if this object has a null `body` property.
     */
    enableBody: function (object) {

        if (object.hasOwnProperty('body') && object.body === null) {
            object.body = new Phaser.Plugin.Isometric.Body(object);
        }

    },

    /**
     * Called automatically by a Physics body, it updates all motion related values on the Body.
     *
     * @method Phaser.Plugin.Isometric.Arcade#updateMotion
     * @param {Phaser.Plugin.Isometric.Body} body - The Body object to be updated.
     */
    updateMotion: function (body) {

        this._velocityDelta = this.computeVelocity(0, body, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity;
        body.angularVelocity += this._velocityDelta;
        body.rotation += (body.angularVelocity * this.game.time.physicsElapsed);

        body.velocity.x = this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x, body.maxVelocity.x);
        body.velocity.y = this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y, body.maxVelocity.y);
        body.velocity.z = this.computeVelocity(3, body, body.velocity.z, body.acceleration.z, body.drag.z, body.maxVelocity.z);

    },

    /**
     * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
     * Based on a function in Flixel by @ADAMATOMIC
     *
     * @method Phaser.Plugin.Isometric.Arcade#computeVelocity
     * @param {number} axis - 0 for nothing, 1 for X-axis, 2 for Y-axis, 3 for vertical (Z-axis).
     * @param {Phaser.Plugin.Isometric.Body} body - The Body object to be updated.
     * @param {number} velocity - Any component of velocity (e.g. 20).
     * @param {number} acceleration - Rate at which the velocity is changing.
     * @param {number} drag - Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
     * @param {number} [max=10000] - An absolute value cap for the velocity.
     * @return {number} The altered Velocity value.
     */
    computeVelocity: function (axis, body, velocity, acceleration, drag, max) {

        max = max || 10000;

        if (axis === 1 && body.allowGravity) {
            velocity += (this.gravity.x + body.gravity.x) * this.game.time.physicsElapsed;
        } else if (axis === 2 && body.allowGravity) {
            velocity += (this.gravity.y + body.gravity.y) * this.game.time.physicsElapsed;
        } else if (axis === 3 && body.allowGravity) {
            velocity += (this.gravity.z + body.gravity.z) * this.game.time.physicsElapsed;
        }

        if (acceleration) {
            velocity += acceleration * this.game.time.physicsElapsed;
        } else if (drag) {
            this._drag = drag * this.game.time.physicsElapsed;

            if (velocity - this._drag > 0) {
                velocity -= this._drag;
            } else if (velocity + this._drag < 0) {
                velocity += this._drag;
            } else {
                velocity = 0;
            }
        }

        if (velocity > max) {
            velocity = max;
        } else if (velocity < -max) {
            velocity = -max;
        }

        return velocity;

    },

    /**
     * Checks for overlaps between two game objects. The objects can be IsoSprites or Groups.
     * You can perform IsoSprite vs. IsoSprite, IsoSprite vs. Group and Group vs. Group overlap checks.
     * Unlike collide the objects are NOT automatically separated or have any physics applied, they merely test for overlap results.
     * The second parameter can be an array of objects, of differing types.
     * NOTE: This function is not recursive, and will not test against children of objects passed (i.e. Groups within Groups).
     *
     * @method Phaser.Plugin.Isometric.Arcade#overlap
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group} object1 - The first object to check. Can be an instance of Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group|array} object2 - The second object or array of objects to check. Can be Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {function} [overlapCallback=null] - An optional callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then overlapCallback will only be called if processCallback returns true.
     * @param {object} [callbackContext] - The context in which to run the callbacks.
     * @return {boolean} True if an overlap occured otherwise false.
     */
    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext) {

        overlapCallback = overlapCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || overlapCallback;

        this._result = false;
        this._total = 0;

        if (Array.isArray(object2)) {
            for (var i = 0, len = object2.length; i < len; i++) {
                this.collideHandler(object1, object2[i], overlapCallback, processCallback, callbackContext, true);
            }
        } else {
            this.collideHandler(object1, object2, overlapCallback, processCallback, callbackContext, true);
        }

        return (this._total > 0);

    },

    /**
     * Checks for collision between two game objects. You can perform IsoSprite vs. IsoSprite, IsoSprite vs. Group or Group vs. Group collisions.
     * The second parameter can be an array of objects, of differing types.
     * The objects are also automatically separated. If you don't require separation then use IsoArcade.overlap instead.
     * An optional processCallback can be provided. If given this function will be called when two sprites are found to be colliding. It is called before any separation takes place,
     * giving you the chance to perform additional checks. If the function returns true then the collision and separation is carried out. If it returns false it is skipped.
     * The collideCallback is an optional function that is only called if two sprites collide. If a processCallback has been set then it needs to return true for collideCallback to be called.
     * NOTE: This function is not recursive, and will not test against children of objects passed (i.e. Groups within Groups).
     *
     * @method Phaser.Plugin.Isometric.Arcade#collide
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group} object1 - The first object to check. Can be an instance of Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group|array} object2 - The second object or array of objects to check. Can be Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {function} [collideCallback=null] - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them, unless you are colliding Group vs. Sprite, in which case Sprite will always be the first parameter.
     * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} [callbackContext] - The context in which to run the callbacks.
     * @return {boolean} True if a collision occured otherwise false.
     */
    collide: function (object1, object2, collideCallback, processCallback, callbackContext) {

        collideCallback = collideCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || collideCallback;

        this._result = false;
        this._total = 0;

        if (Array.isArray(object2)) {
            for (var i = 0, len = object2.length; i < len; i++) {
                this.collideHandler(object1, object2[i], collideCallback, processCallback, callbackContext, false);
            }
        }
        else {
            this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext, false);
        }

        return (this._total > 0);

    },

    /**
     * Internal collision handler.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideHandler
     * @private
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group} object1 - The first object to check. Can be an instance of Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group} object2 - The second object to check. Can be an instance of Phaser.Plugin.Isometric.IsoSprite or Phaser.Group. Can also be an array of objects to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     */
    collideHandler: function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly) {

        //  Only collide valid objects
        if (!object2 && object1.type === Phaser.GROUP) {
            this.collideGroupVsSelf(object1, collideCallback, processCallback, callbackContext, overlapOnly);
            return;
        }

        if (object1 && object2 && object1.exists && object2.exists) {
            //  ISOSPRITES
            if (object1.type === Phaser.Plugin.Isometric.ISOSPRITE) {
                if (object2.type === Phaser.Plugin.Isometric.ISOSPRITE) {
                    this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                } else if (object2.type === Phaser.GROUP) {
                    this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
                //  GROUPS
            else if (object1.type === Phaser.GROUP) {
                if (object2.type === Phaser.Plugin.Isometric.ISOSPRITE) {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
                } else if (object2.type === Phaser.GROUP) {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }

    },

    /**
     * An internal function. Use Phaser.Plugin.Isometric.Arcade.collide instead.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideSpriteVsSprite
     * @private
     * @param {Phaser.Plugin.Isometric.IsoSprite} sprite1 - The first sprite to check.
     * @param {Phaser.Plugin.Isometric.IsoSprite} sprite2 - The second sprite to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     * @return {boolean} True if there was a collision, otherwise false.
     */
    collideSpriteVsSprite: function (sprite1, sprite2, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (!sprite1.body || !sprite2.body) {
            return false;
        }

        if (this.separate(sprite1.body, sprite2.body, processCallback, callbackContext, overlapOnly)) {
            if (collideCallback) {
                collideCallback.call(callbackContext, sprite1, sprite2);
            }

            this._total++;
        }

        return true;

    },

    /**
     * An internal function. Use Phaser.Plugin.Isometric.Arcade.collide instead.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideSpriteVsGroup
     * @private
     * @param {Phaser.Plugin.Isometric.IsoSprite} sprite - The sprite to check.
     * @param {Phaser.Group} group - The Group to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     */
    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly) {
        var i, len;

        if (group.length === 0 || !sprite.body) {
            return;
        }

        if (sprite.body.skipTree || this.skipTree) {
            for (i = 0, len = group.children.length; i < len; i++) {
                if (group.children[i] && group.children[i].exists) {
                    this.collideSpriteVsSprite(sprite, group.children[i], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        } else {
            if (this.useQuadTree) {
                //  What is the sprite colliding with in the quadTree?
                this.quadTree.clear();

                this.quadTree.reset(this.bounds.x, this.bounds.y, this.bounds.widthX, this.bounds.widthY, this.maxObjects, this.maxLevels);

                this.quadTree.populate(group);

                this._potentials = this.quadTree.retrieve(sprite);
            } else {
                //  What is the sprite colliding with in the octree?
                this.octree.clear();

                this.octree.reset(this.bounds.x, this.bounds.y, this.bounds.z, this.bounds.widthX, this.bounds.widthY, this.bounds.height, this.maxObjects, this.maxLevels);

                this.octree.populate(group);

                this._potentials = this.octree.retrieve(sprite);
            }

            for (i = 0, len = this._potentials.length; i < len; i++) {
                //  We have our potential suspects, are they in this group?
                if (this.separate(sprite.body, this._potentials[i], processCallback, callbackContext, overlapOnly)) {
                    if (collideCallback) {
                        collideCallback.call(callbackContext, sprite, this._potentials[i].sprite);
                    }

                    this._total++;
                }
            }
        }
    },

    /**
     * An internal function. Use Phaser.Plugin.Isometric.Arcade.collide instead.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideGroupVsSelf
     * @private
     * @param {Phaser.Group} group - The Group to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     * @return {boolean} True if there was a collision, otherwise false.
     */
    collideGroupVsSelf: function (group, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group.length === 0) {
            return;
        }

        var len = group.children.length;

        for (var i = 0; i < len; i++) {
            for (var j = i + 1; j <= len; j++) {
                if (group.children[i] && group.children[j] && group.children[i].exists && group.children[j].exists) {
                    this.collideSpriteVsSprite(group.children[i], group.children[j], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }

    },

    /**
     * An internal function. Use Phaser.Plugin.Isometric.Arcade.collide instead.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideGroupVsGroup
     * @private
     * @param {Phaser.Group} group1 - The first Group to check.
     * @param {Phaser.Group} group2 - The second Group to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     */
    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group1.length === 0 || group2.length === 0) {
            return;
        }

        for (var i = 0, len = group1.children.length; i < len; i++) {
            if (group1.children[i].exists) {
                this.collideSpriteVsGroup(group1.children[i], group2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }

    },

    /**
     * The core separation function to separate two physics bodies.
     *
     * @private
     * @method Phaser.Plugin.Isometric.Arcade#separate
     * @param {Phaser.Plugin.Isometric.Body} body1 - The first Body object to separate.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The second Body object to separate.
     * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this function is set then the sprites will only be collided if it returns true.
     * @param {object} [callbackContext] - The context in which to run the process callback.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     * @return {boolean} Returns true if the bodies collided, otherwise false.
     */
    separate: function (body1, body2, processCallback, callbackContext, overlapOnly) {

        if (!body1.enable || !body2.enable || !this.intersects(body1, body2)) {
            return false;
        }

        //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
        if (processCallback && processCallback.call(callbackContext, body1.sprite, body2.sprite) === false) {
            return false;
        }

        if (overlapOnly) {
            //  We already know they intersect from the check above, and we don't need separation, so ...
            return true;
        }

        //  Do we separate on X and Y first?
        //  If we weren't having to carry around so much legacy baggage with us, we could do this properly. But alas ...
        if (this.forceXY || Math.abs(this.gravity.z + body1.gravity.z) < Math.abs(this.gravity.x + body1.gravity.x) || Math.abs(this.gravity.z + body1.gravity.z) < Math.abs(this.gravity.y + body1.gravity.y)) {
            this._result = (this.separateX(body1, body2, overlapOnly) || this.separateY(body1, body2, overlapOnly) || this.separateZ(body1, body2, overlapOnly));
        } else {
            this._result = (this.separateZ(body1, body2, overlapOnly) || this.separateX(body1, body2, overlapOnly) || this.separateY(body1, body2, overlapOnly));
        }

        return this._result;

    },

    /**
     * Check for intersection against two bodies.
     *
     * @method Phaser.Plugin.Isometric.Arcade#intersects
     * @param {Phaser.Plugin.Isometric.Body} body1 - The Body object to check.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The Body object to check.
     * @return {boolean} True if they intersect, otherwise false.
     */
    intersects: function (body1, body2) {

        if (body1.frontX <= body2.x) {
            return false;
        }

        if (body1.frontY <= body2.y) {
            return false;
        }

        if (body1.x >= body2.frontX) {
            return false;
        }

        if (body1.y >= body2.frontY) {
            return false;
        }

        if (body1.top <= body2.z) {
            return false;
        }

        if (body1.z >= body2.top) {
            return false;
        }

        return true;

    },

    /**
     * The core separation function to separate two physics bodies on the x axis.
     *
     * @private
     * @method Phaser.Plugin.Isometric.Arcade#separateX
     * @param {Phaser.Plugin.Isometric.Body} body1 - The Body object to separate.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The Body object to separate.
     * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
     * @return {boolean} Returns true if the bodies were separated, otherwise false.
     */
    separateX: function (body1, body2, overlapOnly) {

        //  Can't separate two immovable bodies
        if (body1.immovable && body2.immovable) {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (this.intersects(body1, body2)) {
            this._maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + this.OVERLAP_BIAS;

            if (body1.deltaX() === 0 && body2.deltaX() === 0) {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            } else if (body1.deltaX() > body2.deltaX()) {
                //  Body1 is moving forward and/or Body2 is moving back
                this._overlap = body1.frontX - body2.x;

                if ((this._overlap > this._maxOverlap) || body1.checkCollision.frontX === false || body2.checkCollision.backX === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.frontX = true;
                    body2.touching.none = false;
                    body2.touching.backX = true;
                }
            } else if (body1.deltaX() < body2.deltaX()) {
                //  Body1 is moving back and/or Body2 is moving forward
                this._overlap = body1.x - body2.widthX - body2.x;

                if ((-this._overlap > this._maxOverlap) || body1.checkCollision.backX === false || body2.checkCollision.frontX === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.backX = true;
                    body2.touching.none = false;
                    body2.touching.frontX = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap !== 0) {
                body1.overlapX = this._overlap;
                body2.overlapX = this._overlap;

                if (overlapOnly || body1.customSeparateX || body2.customSeparateX) {
                    return true;
                }

                this._velocity1 = body1.velocity.x;
                this._velocity2 = body2.velocity.x;

                if (!body1.immovable && !body2.immovable) {
                    this._overlap *= 0.5;

                    body1.x = body1.x - this._overlap;
                    body2.x += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.x = this._average + this._newVelocity1 * body1.bounce.x;
                    body2.velocity.x = this._average + this._newVelocity2 * body2.bounce.x;
                } else if (!body1.immovable) {
                    body1.x = body1.x - this._overlap;
                    body1.velocity.x = this._velocity2 - this._velocity1 * body1.bounce.x;
                } else if (!body2.immovable) {
                    body2.x += this._overlap;
                    body2.velocity.x = this._velocity1 - this._velocity2 * body2.bounce.x;
                }

                return true;
            }
        }

        return false;

    },

    /**
     * The core separation function to separate two physics bodies on the x axis.
     *
     * @private
     * @method Phaser.Plugin.Isometric.Arcade#separateY
     * @param {Phaser.Plugin.Isometric.Body} body1 - The Body object to separate.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The Body object to separate.
     * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
     * @return {boolean} Returns true if the bodies were separated, otherwise false.
     */
    separateY: function (body1, body2, overlapOnly) {

        //  Can't separate two immovable bodies
        if (body1.immovable && body2.immovable) {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (this.intersects(body1, body2)) {
            this._maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + this.OVERLAP_BIAS;

            if (body1.deltaY() === 0 && body2.deltaY() === 0) {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            } else if (body1.deltaY() > body2.deltaY()) {
                //  Body1 is moving forward and/or Body2 is moving back
                this._overlap = body1.frontY - body2.y;

                if ((this._overlap > this._maxOverlap) || body1.checkCollision.frontY === false || body2.checkCollision.backY === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.frontY = true;
                    body2.touching.none = false;
                    body2.touching.backY = true;
                }
            } else if (body1.deltaY() < body2.deltaY()) {
                //  Body1 is moving back and/or Body2 is moving forward
                this._overlap = body1.y - body2.widthY - body2.y;

                if ((-this._overlap > this._maxOverlap) || body1.checkCollision.backY === false || body2.checkCollision.frontY === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.backY = true;
                    body2.touching.none = false;
                    body2.touching.frontY = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap !== 0) {
                body1.overlapY = this._overlap;
                body2.overlapY = this._overlap;

                if (overlapOnly || body1.customSeparateY || body2.customSeparateY) {
                    return true;
                }

                this._velocity1 = body1.velocity.y;
                this._velocity2 = body2.velocity.y;

                if (!body1.immovable && !body2.immovable) {
                    this._overlap *= 0.5;

                    body1.y = body1.y - this._overlap;
                    body2.y += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.y = this._average + this._newVelocity1 * body1.bounce.y;
                    body2.velocity.y = this._average + this._newVelocity2 * body2.bounce.y;
                } else if (!body1.immovable) {
                    body1.y = body1.y - this._overlap;
                    body1.velocity.y = this._velocity2 - this._velocity1 * body1.bounce.y;
                } else if (!body2.immovable) {
                    body2.y += this._overlap;
                    body2.velocity.y = this._velocity1 - this._velocity2 * body2.bounce.y;
                }

                return true;
            }
        }

        return false;

    },

    /**
     * The core separation function to separate two physics bodies on the z axis.
     *
     * @private
     * @method Phaser.Plugin.Isometric.Arcade#separateZ
     * @param {Phaser.Plugin.Isometric.Body} body1 - The Body object to separate.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The Body object to separate.
     * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
     * @return {boolean} Returns true if the bodies were separated, otherwise false.
     */
    separateZ: function (body1, body2, overlapOnly) {

        //  Can't separate two immovable or non-existing bodys
        if (body1.immovable && body2.immovable) {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (this.intersects(body1, body2)) {
            this._maxOverlap = body1.deltaAbsZ() + body2.deltaAbsZ() + this.OVERLAP_BIAS;

            if (body1.deltaZ() === 0 && body2.deltaZ() === 0) {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            } else if (body1.deltaZ() > body2.deltaZ()) {
                //  Body1 is moving down and/or Body2 is moving up
                this._overlap = body1.top - body2.z;

                if ((this._overlap > this._maxOverlap) || body1.checkCollision.down === false || body2.checkCollision.up === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.down = true;
                    body2.touching.none = false;
                    body2.touching.up = true;
                }
            } else if (body1.deltaZ() < body2.deltaZ()) {
                //  Body1 is moving up and/or Body2 is moving down
                this._overlap = body1.z - body2.top;

                if ((-this._overlap > this._maxOverlap) || body1.checkCollision.up === false || body2.checkCollision.down === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.up = true;
                    body2.touching.none = false;
                    body2.touching.down = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap !== 0) {
                body1.overlapZ = this._overlap;
                body2.overlapZ = this._overlap;

                if (overlapOnly || body1.customSeparateY || body2.customSeparateZ) {
                    return true;
                }

                this._velocity1 = body1.velocity.z;
                this._velocity2 = body2.velocity.z;

                if (!body1.immovable && !body2.immovable) {
                    this._overlap *= 0.5;

                    body1.z = body1.z - this._overlap;
                    body2.z += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.z = this._average + this._newVelocity1 * body1.bounce.z;
                    body2.velocity.z = this._average + this._newVelocity2 * body2.bounce.z;
                } else if (!body1.immovable) {
                    body1.z = body1.z - this._overlap;
                    body1.velocity.z = this._velocity2 - this._velocity1 * body1.bounce.z;

                    //  This is special case code that handles things like moving platforms you can ride
                    if (body2.moves) {
                        body1.x += body2.x - body2.prev.x;
                        body1.y += body2.y - body2.prev.y;
                    }
                } else if (!body2.immovable) {
                    body2.z += this._overlap;
                    body2.velocity.z = this._velocity1 - this._velocity2 * body2.bounce.z;

                    //  This is special case code that handles things like moving platforms you can ride
                    if (body1.moves) {
                        body2.x += body1.x - body1.prev.x;
                        body2.y += body1.y - body1.prev.y;
                    }
                }

                return true;
            }

        }

        return false;

    },

    /**
     * Find the distance between two display objects (like Sprites).
     *
     * @method Phaser.Plugin.Isometric.Isometric.Arcade#distanceBetween
     * @param {any} source - The Display Object to test from.
     * @param {any} target - The Display Object to test to.
     * @return {number} The distance between the source and target objects.
     */
    distanceBetween: function (source, target) {

        this._dx = source.x - target.x;
        this._dy = source.y - target.y;
        this._dz = source.z - target.z;

        return Math.sqrt(this._dx * this._dx + this._dy * this._dy + this._dz * this._dz);

    },

    /**
     * Find the distance between a display object (like a Sprite) and the given x/y coordinates only (ignore z).
     * The calculation is made from the display objects x/y coordinate. This may be the top-left if its anchor hasn't been changed.
     * If you need to calculate from the center of a display object instead use the method distanceBetweenCenters()
     *
     * @method Phaser.Plugin.Isometric.Arcade#distanceToXY
     * @param {any} displayObject - The Display Object to test from.
     * @param {number} x - The x coordinate to test to.
     * @param {number} y - The y coordinate to test to.
     * @return {number} The distance between the object and the x/y coordinates.
     */
    distanceToXY: function (displayObject, x, y) {

        this._dx = displayObject.x - x;
        this._dy = displayObject.y - y;

        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    },

    /**
     * Find the distance between a display object (like a Sprite) and the given x/y/z coordinates.
     * The calculation is made from the display objects x/y/z coordinate. This may be the top-left if its anchor hasn't been changed.
     * If you need to calculate from the center of a display object instead use the method distanceBetweenCenters()
     *
     * @method Phaser.Plugin.Isometric.Arcade#distanceToXYZ
     * @param {any} displayObjectBody - The Display Object to test from.
     * @param {number} x - The x coordinate to test to.
     * @param {number} y - The y coordinate to test to.
     * @param {number} z - The y coordinate to test to
     * @return {number} The distance between the object and the x/y coordinates.
     */
    distanceToXYZ: function (displayObjectBody, x, y, z) {

        this._dx = displayObjectBody.x - x;
        this._dy = displayObjectBody.y - y;
        this._dz = displayObjectBody.z - z;

        return Math.sqrt(this._dx * this._dx + this._dy * this._dy + this._dz * this._dz);

    },

    /**
    * Find the distance between a display object (like a Sprite) and a Pointer. If no Pointer is given the Input.activePointer is used.
    * The calculation is made from the display objects x/y coordinate. This may be the top-left if its anchor hasn't been changed.
    * If you need to calculate from the center of a display object instead use the method distanceBetweenCenters()
    * The distance to the Pointer is returned in isometric distance.
    *
    * @method Phaser.Physics.Arcade#distanceToPointer
    * @param {any} displayObjectBody - The Display Object to test from.
    * @param {Phaser.Pointer} [pointer] - The Phaser.Pointer to test to. If none is given then Input.activePointer is used.
    * @return {number} The distance between the object and the Pointer.
    */
    distanceToPointer: function (displayObjectBody, pointer) {

        pointer = pointer || this.game.input.activePointer;
        var isoPointer = this.game.iso.unproject(pointer.position,undefined,displayObjectBody.z);
        isoPointer.z = displayObjectBody.z;
        var a = this.anglesToXYZ(displayObjectBody, isoPointer.x, isoPointer.y, isoPointer.z);

        return a.r;

    },

    /**
     * Find the angles in radians between a display object (like a IsoSprite) and the given x/y/z coordinate.
     *
     * @method Phaser.Physics.Isometric.Isometric.Arcade#anglesToXYZ
     * @param {any} displayObjectBody - The Display Object to test from.
     * @param {number} x - The x coordinate to get the angle to.
     * @param {number} y - The y coordinate to get the angle to.
     * @param {number} z - The z coordinate to get the angle to.
     * @return {number} The angle in radians between displayObjectBody.x/y to Pointer.x/y
     */
    anglesToXYZ: function (displayObjectBody, x, y, z) {

        // Spherical polar coordinates
        var r = this.distanceToXYZ(displayObjectBody, x, y, z);
        var theta = Math.atan2(y - displayObjectBody.y, x - displayObjectBody.x);
        var phi   = Math.acos((z - displayObjectBody.z)/ r);

        return {r:r,theta:theta,phi:phi};

    },

    /**
     * Find the angle in radians between a display object (like a Sprite) and a Pointer, taking their x/y and center into account.
     * This is not the visual angle but the angle in the isometric co-ordinate system.
     *
     * @method Phaser.Physics.Isometric.Arcade#angleToPointer
     * @param {any} displayObjectBody - The Display Object to test from.
     * @param {Phaser.Pointer} [pointer] - The Phaser.Pointer to test to. If none is given then Input.activePointer is used.
     * @return {number} The (isometric) angle in radians between displayObjectBody.x/y to Pointer.x/y.
     */
    angleToPointer: function(displayObjectBody, pointer) {

        pointer = pointer || this.game.input.activePointer;
        var isoPointer = this.game.iso.unproject(pointer.position,undefined,displayObjectBody.z);
        isoPointer.z = displayObjectBody.z;
        var a = this.anglesToXYZ(displayObjectBody, isoPointer.x, isoPointer.y, isoPointer.z);

        return a.theta;

    },

    /**
    * Given the angle (in degrees) and speed calculate the velocity and return it as a Point object, or set it to the given point object.
    * One way to use this is: velocityFromAngle(angle, 200, sprite.velocity) which will set the values directly to the sprites velocity and not create a new Point object.
    *
    * @method Phaser.Physics.Arcade#velocityFromAngle
    * @param {number} theta - The angle in radians for x,y in the isometric co-ordinate system
    * @param {number} [phi=Math.PI/2] - The angle in radians for z in the isometric co-ordinate system
    * @param {number} [speed=60] - The speed it will move, in pixels per second sq.
    * @param {Phaser.Point|object} [point] - The Point object in which the x and y properties will be set to the calculated velocity.
    * @return {Phaser.Plugin.Isometric.Point3} - A Point where point.x contains the velocity x value and so on for y and z.
    */
    velocityFromAngles: function (theta, phi, speed, point) {

        if (phi === undefined) { phi = Math.sin(Math.PI/2); }
        if (speed === undefined) { speed = 60; }
        point = point || new Phaser.Point();

        return new Phaser.Plugin.Isometric.Point3(
            Math.cos(theta) * Math.sin(phi) * speed,
            Math.sin(theta) * Math.sin(phi) * speed,
                              Math.cos(phi) * speed
            );

    },

    /**
    * Sets the acceleration.x/y property on the display object so it will move towards the x/y coordinates at the given speed (in pixels per second sq.)
    * You must give a maximum speed value, beyond which the display object won't go any faster.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    *
    * @method Phaser.Physics.Isometric.Arcade#accelerateToXYZ
    * @param {any} displayObject - The display object to move.
    * @param {number} x - The x coordinate to accelerate towards.
    * @param {number} y - The y coordinate to accelerate towards.
    * @param {number} z - The z coordinate to accelerate towards.
    * @param {number} [speed=60] - The speed it will accelerate in pixels per second.
    * @param {number} [xSpeedMax=500] - The maximum x velocity the display object can reach.
    * @param {number} [ySpeedMax=500] - The maximum y velocity the display object can reach.
    * @param {number} [zSpeedMax=500] - The maximum z velocity the display object can reach.
    * @return {number} The angle (in radians).
    */
    accelerateToXYZ: function(displayObject, x, y, z, speed, xSpeedMax, ySpeedMax, zSpeedMax) {

        if (speed === undefined) { speed = 60; }
        if (xSpeedMax === undefined) { xSpeedMax = 500; }
        if (ySpeedMax === undefined) { ySpeedMax = 500; }
        if (zSpeedMax === undefined) { zSpeedMax = 500; }

        var a = this.anglesToXYZ(displayObject.body, x, y,z);
        var v = this.velocityFromAngles(a.theta,a.phi,speed);

        displayObject.body.acceleration.setTo(v.x,v.y,v.z);
        displayObject.body.maxVelocity.setTo(xSpeedMax, ySpeedMax, zSpeedMax);

        return a.theta;

    },

    /**
     * Move the given display object towards the x/y coordinates at a steady velocity.
     * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
     * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
     * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
     * Note: The display object doesn't stop moving once it reaches the destination coordinates.
     * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
     *
     * @method Phaser.Physics.Isometric.Arcade#moveToXYZ
     * @param {any} displayObject - The display object to move, must have an isoArcade body.
     * @param {number} x - The x coordinate to move towards.
     * @param {number} y - The y coordinate to move towards.
     * @param {number} z - The z coordinate to move towards.
     * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
     * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
     * @return {number} The angle (in radians).
    */
    moveToXYZ: function(displayObject, x, y, z, speed, maxTime) {

        if (typeof speed === 'undefined') {
            speed = 60;
        }
        if (typeof maxTime === 'undefined') {
            maxTime = 0;
        }

        if (maxTime > 0) {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceToXYZ(displayObject.body, x, y ,z) / (maxTime / 1000);
        }
        var a = this.anglesToXYZ(displayObject.body, x, y,z);
        var v = this.velocityFromAngles(a.theta,a.phi,speed);

        displayObject.body.velocity.copyFrom(v);

        return a.theta;

    },

    /**
    * Move the given display object towards the destination object at a steady velocity.
    * If you specify a maxTime then it will adjust the speed (overwriting what you set) so it arrives at the destination in that number of seconds.
    * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
    *
    * @method Phaser.Physics.Isometric.Arcade#moveToObject
    * @param {any} displayObject - The display object to move.
    * @param {any} destination - The display object to move towards. Can be any object but must have visible x/y/z properties.
    * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
    * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
    * @return {number} The angle (in radians).
    */
    moveToObject: function (displayObject, destination, speed, maxTime) {

        return this.moveToXYZ(displayObject, destination.x, destination.y, destination.z, speed, maxTime);

    },

    /**
    * Move the given display object towards the pointer at a steady x & y velocity. If no pointer is given it will use Phaser.Input.activePointer.
    * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
    * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
    * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
    * Note: The display object doesn't stop moving once it reaches the destination coordinates.
    *
    * @method Phaser.Physics.Isometric.Arcade#moveToPointer
    * @param {any} displayObject - The display object to move.
    * @param {number} [speed=60] - The speed it will move, in pixels per second (default is 60 pixels/sec)
    * @param {Phaser.Pointer} [pointer] - The pointer to move towards. Defaults to Phaser.Input.activePointer.
    * @param {number} [maxTime=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
    * @return {number} The angle (in radians).
    */
    moveToPointer: function(displayObject, speed, pointer, maxTime) {

        pointer = pointer || this.game.input.activePointer;
        var isoPointer = this.game.iso.unproject(pointer.position,undefined,displayObject.body.z);
        isoPointer.z = displayObject.body.z;

        if (typeof speed === 'undefined') {
            speed = 60;
        }
        if (typeof maxTime === 'undefined') {
            maxTime = 0;
        }

        if (maxTime > 0) {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceToXYZ(displayObject.body, isoPointer.x, isoPointer.y ,isoPointer.z) / (maxTime / 1000);
        }
        var a = this.anglesToXYZ(displayObject.body, isoPointer.x, isoPointer.y,isoPointer.z);
        var v = this.velocityFromAngles(a.theta,a.phi,speed);

        displayObject.body.velocity.x=v.x;
        displayObject.body.velocity.y=v.y;

        return a.theta;
    }


};

Phaser.Physics.prototype.isoArcade = null;

Phaser.Physics.prototype.parseConfig = (function (_super) {

    return function () {
        if (this.config.hasOwnProperty('isoArcade') && this.config['isoArcade'] === true && Phaser.Plugin.Isometric.hasOwnProperty('IsoArcade')) {
            this.isoArcade = new Phaser.Plugin.Isometric(this.game, this.config);
        }
        return _super.call(this);
    };

})(Phaser.Physics.prototype.parseConfig);

Phaser.Physics.prototype.startSystem = (function (_super) {

    return function (system) {
        if (system === Phaser.Plugin.Isometric.ISOARCADE && this.isoArcade === null) {
            this.isoArcade = new Phaser.Plugin.Isometric.Arcade(this.game);
            this.setBoundsToWorld();
        }
        return _super.call(this, system);
    };

})(Phaser.Physics.prototype.startSystem);

Phaser.Physics.prototype.enable = (function (_super) {

    return function (sprite, system) {
        if (system === Phaser.Plugin.Isometric.ISOARCADE && this.isoArcade) {
            this.isoArcade.enable(sprite);
        }
        return _super.call(this, sprite, system);
    };

})(Phaser.Physics.prototype.enable);

Phaser.Physics.prototype.setBoundsToWorld = (function (_super) {

    return function () {
        if (this.isoArcade) {
            this.isoArcade.setBoundsToWorld();
        }
        return _super.call(this);
    };

})(Phaser.Physics.prototype.setBoundsToWorld);

Phaser.Physics.prototype.destroy = (function (_super) {

    return function () {
        this.isoArcade = null;

        return _super.call(this);
    };

})(Phaser.Physics.prototype.destroy);
