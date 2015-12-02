/**
* @class Phaser.Plugin.Isometric.IsoSprite
*
* @classdesc
* Create a new `IsoSprite` object. IsoSprites are extended versions of standard Sprites that are suitable for axonometric positioning.
*
* IsoSprites are simply Sprites that have three new position properties (isoX, isoY and isoZ) and ask the instance of Phaser.Plugin.Isometric.Projector what their position should be in a 2D scene whenever these properties are changed.
* The IsoSprites retain their 2D position property to prevent any problems and allow you to interact with them as you would a normal Sprite. The upside of this simplicity is that things should behave predictably for those already used to Phaser.
*
* @constructor
* @extends Phaser.Sprite
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in 3D space) to position the IsoSprite at.
* @param {number} y - The y coordinate (in 3D space) to position the IsoSprite at.
* @param {number} z - The z coordinate (in 3D space) to position the IsoSprite at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the IsoSprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this IsoSprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
 */
Phaser.Plugin.Isometric.IsoSprite = function (game, x, y, z, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);

    /**
     * @property {number} type - The const type of this object.
     * @readonly
     */
    this.type = Phaser.Plugin.Isometric.ISOSPRITE;

    /**
     * @property {Phaser.Plugin.Isometric.Point3} _isoPosition - Internal 3D position.
     * @private
     */
    this._isoPosition = new Phaser.Plugin.Isometric.Point3(x, y, z);

    /**
     * @property {number} snap - Snap this IsoSprite's position to the specified value; handy for keeping pixel art snapped to whole pixels.
     * @default
     */
    this.snap = 0;

    /**
     * @property {number} _depth - Internal cached depth value.
     * @readonly
     * @private
     */
    this._depth = 0;

    /**
     * @property {boolean} _depthChanged - Internal invalidation control for depth management.
     * @readonly
     * @private
     */
    this._depthChanged = true;

    /**
     * @property {boolean} _isoPositionChanged - Internal invalidation control for positioning.
     * @readonly
     * @private
     */
    this._isoPositionChanged = true;

    /**
     * @property {boolean} _isoBoundsChanged - Internal invalidation control for isometric bounds.
     * @readonly
     * @private
     */
    this._isoBoundsChanged = true;

    this._project();

    /**
     * @property {Phaser.Plugin.Isometric.Cube} _isoBounds - Internal derived 3D bounds.
     * @private
     */
    this._isoBounds = this.resetIsoBounds();
};

Phaser.Plugin.Isometric.IsoSprite.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.Plugin.Isometric.IsoSprite.prototype.constructor = Phaser.Plugin.Isometric.IsoSprite;

/**
 * Internal function called by the World postUpdate cycle.
 *
 * @method Phaser.Plugin.Isometric.IsoSprite#postUpdate
 * @memberof Phaser.Plugin.Isometric.IsoSprite
 */
Phaser.Plugin.Isometric.IsoSprite.prototype.postUpdate = function () {
    Phaser.Sprite.prototype.postUpdate.call(this);

    this._project();
};

/**
 * Internal function that performs the axonometric projection from 3D to 2D space.
 * @method Phaser.Plugin.Isometric.IsoSprite#_project
 * @memberof Phaser.Plugin.Isometric.IsoSprite
 * @private
 */
Phaser.Plugin.Isometric.IsoSprite.prototype._project = function () {
    if (this._isoPositionChanged) {
        this.game.iso.project(this._isoPosition, this.position);

        if (this.snap > 0) {
            this.position.x = Phaser.Math.snapTo(this.position.x, this.snap);
            this.position.y = Phaser.Math.snapTo(this.position.y, this.snap);
        }

        this._depthChanged = this._isoPositionChanged = this._isoBoundsChanged = true;
    }
};

Phaser.Plugin.Isometric.IsoSprite.prototype.resetIsoBounds = function () {
    if (typeof this._isoBounds === "undefined") {
        this._isoBounds = new Phaser.Plugin.Isometric.Cube();
    }

    var asx = Math.abs(this.scale.x);
    var asy = Math.abs(this.scale.y);

    this._isoBounds.widthX = Math.round(Math.abs(this.width) * 0.5) * asx;
    this._isoBounds.widthY = Math.round(Math.abs(this.width) * 0.5) * asx;
    this._isoBounds.height = Math.round(Math.abs(this.height) - (Math.abs(this.width) * 0.5)) * asy;

    this._isoBounds.x = this.isoX + (this._isoBounds.widthX * -this.anchor.x) + this._isoBounds.widthX * 0.5;
    this._isoBounds.y = this.isoY + (this._isoBounds.widthY * this.anchor.x) - this._isoBounds.widthY * 0.5;
    this._isoBounds.z = this.isoZ - (Math.abs(this.height) * (1 - this.anchor.y)) + (Math.abs(this.width * 0.5));

    return this._isoBounds;
};

/**
 * The axonometric position of the IsoSprite on the x axis. Increasing the x coordinate will move the object down and to the right on the screen.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoX
 * @property {number} isoX - The axonometric position of the IsoSprite on the x axis.
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoX", {
    get: function () {
        return this._isoPosition.x;
    },
    set: function (value) {
        this._isoPosition.x = value;
        this._depthChanged = this._isoPositionChanged = this._isoBoundsChanged = true;
        if (this.body){
            this.body._reset = true;
        }
    }
});

/**
 * The axonometric position of the IsoSprite on the y axis. Increasing the y coordinate will move the object down and to the left on the screen.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoY
 * @property {number} isoY - The axonometric position of the IsoSprite on the y axis.
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoY", {
    get: function () {
        return this._isoPosition.y;
    },
    set: function (value) {
        this._isoPosition.y = value;
        this._depthChanged = this._isoPositionChanged = this._isoBoundsChanged = true;
        if (this.body){
            this.body._reset = true;
        }
    }
});

/**
 * The axonometric position of the IsoSprite on the z axis. Increasing the z coordinate will move the object directly upwards on the screen.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoZ
 * @property {number} isoZ - The axonometric position of the IsoSprite on the z axis.
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoZ", {
    get: function () {
        return this._isoPosition.z;
    },
    set: function (value) {
        this._isoPosition.z = value;
        this._depthChanged = this._isoPositionChanged = this._isoBoundsChanged = true;
        if (this.body){
            this.body._reset = true;
        }
    }
});

/**
 * A Point3 object representing the axonometric position of the IsoSprite.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoPosition
 * @property {Point3} isoPosition - The axonometric position of the IsoSprite.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoPosition", {
    get: function () {
        return this._isoPosition;
    }
});

/**
 * A Cube object representing the derived boundsof the IsoSprite.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoBounds
 * @property {Point3} isoBounds - The derived 3D bounds of the IsoSprite.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoBounds", {
    get: function () {
        if (this._isoBoundsChanged || !this._isoBounds) {
            this.resetIsoBounds();
            this._isoBoundsChanged = false;
        }
        return this._isoBounds;
    }
});

/**
 * The non-unit distance of the IsoSprite from the 'front' of the scene. Used to correctly depth sort a group of IsoSprites.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#depth
 * @property {number} depth - A calculated value used for depth sorting.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "depth", {
    get: function () {
        if (this._depthChanged === true) {
            this._depth = (this._isoPosition.x + this._isoPosition.y) + (this._isoPosition.z * 1.25);
            this._depthChanged = false;
        }
        return this._depth;
    }
});

/**
 * Create a new IsoSprite with specific position and sprite sheet key.
 *
 * @method Phaser.GameObjectFactory#isoSprite
 * @param {number} x - X position of the new IsoSprite.
 * @param {number} y - Y position of the new IsoSprite.
 * @param {number} y - Z position of the new IsoSprite.
 * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
 * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
 * @returns {Phaser.Plugin.Isometric.IsoSprite} the newly created IsoSprite object.
 */

Phaser.GameObjectCreator.prototype.isoSprite = function (x, y, z, key, frame) {

    return new Phaser.Plugin.Isometric.IsoSprite(this.game, x, y, z, key, frame);

};

/**
 * Create a new IsoSprite with specific position and sprite sheet key.
 *
 * @method Phaser.GameObjectFactory#isoSprite
 * @param {number} x - X position of the new IsoSprite.
 * @param {number} y - Y position of the new IsoSprite.
 * @param {number} y - Z position of the new IsoSprite.
 * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
 * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
 * @returns {Phaser.Plugin.Isometric.IsoSprite} the newly created IsoSprite object.
 */
Phaser.GameObjectFactory.prototype.isoSprite = function (x, y, z, key, frame, group) {

    if (typeof group === 'undefined') {
        group = this.world;
    }

    return group.add(new Phaser.Plugin.Isometric.IsoSprite(this.game, x, y, z, key, frame));

};

Phaser.Plugin.Isometric.prototype.addIsoSprite = function (x, y, z, key, frame, group) {
    return Phaser.GameObjectFactory.prototype.isoSprite.call(this.game.add, x, y, z, key, frame, group);
};



Phaser.Utils.Debug.prototype.isoSprite = function (sprite, color, filled) {

    if (!sprite.isoBounds) {
        return;
    }

    if (typeof filled === 'undefined') {
        filled = true;
    }

    color = color || 'rgba(0,255,0,0.4)';


    var points = [],
        corners = sprite.isoBounds.getCorners();

    var posX = -sprite.game.camera.x;
    var posY = -sprite.game.camera.y;

    this.start();

    if (filled) {
        points = [corners[1], corners[3], corners[2], corners[6], corners[4], corners[5], corners[1]];

        points = points.map(function (p) {
            var newPos = sprite.game.iso.project(p);
            newPos.x += posX;
            newPos.y += posY;
            return newPos;
        });
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < points.length; i++) {
            this.context.lineTo(points[i].x, points[i].y);
        }
        this.context.fill();
    } else {
        points = corners.slice(0, corners.length);
        points = points.map(function (p) {
            var newPos = sprite.game.iso.project(p);
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
    }

    this.stop();

};
