
/**
 * @class Phaser.Plugin.Isometric.Point3
 * @classdesc
 * The Point3 object represents a location in a three-dimensional coordinate system,
 * where x and y represent the horizontal axes and z represents the vertical axis.
 * The following code creates a point at (0,0,0):
 * `var myPoint = new Phaser.Plugin.Isometric.Point3();`
 */

/**
 * Creates a new Point3 object. If you pass no parameters a Point3 is created set to (0, 0, 0).
 *
 * @constructor
 * @param {number} [x=0] - The horizontal X position of this Point.
 * @param {number} [y=0] - The horizontal Y position of this Point.
 * @param {number} [z=0] - The vertical position of this Point.
 */
Phaser.Plugin.Isometric.Point3 = function (x, y, z) {
    x = x || 0;
    y = y || 0;
    z = z || 0;

    /**
     * @property {number} x - The x value of the point.
     */
    this.x = x;

    /**
     * @property {number} y - The y value of the point.
     */
    this.y = y;

    /**
     * @property {number} z - The z value of the point.
     */
    this.z = z;
};

Phaser.Plugin.Isometric.Point3.prototype = {
    /**
     * Copies the x, y and z properties from any given object to this Point3.
     *
     * @method Phaser.Plugin.Isometric.Point3#copyFrom
     * @param {any} source - The object to copy from.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object.
     */
    copyFrom: function (source) {

        return this.setTo(source.x, source.y, source.z);

    },

    /**
     * Copies the x, y and z properties from this Point3 to any given object.
     *
     * @method Phaser.Plugin.Isometric.Point3#copyTo
     * @param {any} dest - The object to copy to.
     * @return {Object} The dest object.
     */
    copyTo: function (source) {

        dest.x = this.x;
        dest.y = this.y;
        dest.z = this.z;

        return dest;

    },

    /**
     * Determines whether the given object's x/y/z values are equal to this Point3 object.
     *
     * @method Phaser.Plugin.Isometric.Point3#equals
     * @param {Phaser.Plugin.Isometric.Point3|any} a - The object to compare with this Point3.
     * @return {boolean} A value of true if the x and y points are equal, otherwise false.
     */
    equals: function (a) {

        return (a.x === this.x && a.y === this.y && a.z === this.z);

    },

    /**
     * Sets the x, y and z values of this Point3 object to the given values.
     * If you omit the y and z value then the x value will be applied to all three, for example:
     * `Point3.set(2)` is the same as `Point3.set(2, 2, 2)`
     * If however you set both x and y, but no z, the z value will be set to 0.
     *
     * @method Phaser.Plugin.Isometric.Point3#set
     * @param {number} x - The x value of this point.
     * @param {number} [y] - The y value of this point. If not given the x value will be used in its place.
     * @param {number} [z] - The z value of this point. If not given and the y value is also not given, the x value will be used in its place.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    set: function (x, y, z) {
        this.x = x || 0;
        this.y = y || ((y !== 0) ? this.x : 0);
        this.z = z || ((typeof y === "undefined") ? this.x : 0);

        return this;
    },

    /**
     * Sets the x, y and z values of this Point3 object to the given values.
     * If you omit the y and z value then the x value will be applied to all three, for example:
     * `Point3.setTo(2)` is the same as `Point3.setTo(2, 2, 2)`
     * If however you set both x and y, but no z, the z value will be set to 0.
     *
     * @method Phaser.Plugin.Isometric.Point3#setTo
     * @param {number} x - The x value of this point.
     * @param {number} [y] - The y value of this point. If not given the x value will be used in its place.
     * @param {number} [z] - The z value of this point. If not given and the y value is also not given, the x value will be used in its place.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    setTo: function (x, y, z) {
        return this.set(x, y, z);
    },

    /**
     * Adds the given x, y and z values to this Point3.
     *
     * @method Phaser.Plugin.Isometric.Point3#add
     * @param {number} x - The value to add to Point3.x.
     * @param {number} y - The value to add to Point3.y.
     * @param {number} z - The value to add to Point3.z.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    add: function (x, y) {

        this.x += x || 0;
        this.y += y || 0;
        return this;

    },

    /**
     * Subtracts the given x, y and z values from this Point3.
     *
     * @method Phaser.Plugin.Isometric.Point3#subtract
     * @param {number} x - The value to subtract from Point3.x.
     * @param {number} y - The value to subtract from Point3.y.
     * @param {number} z - The value to subtract from Point3.z.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    subtract: function (x, y, z) {

        this.x -= x || 0;
        this.y -= y || 0;
        this.z -= z || 0;

        return this;

    },

    /**
     * Multiplies Point3.x, Point3.y and Point3.z by the given x and y values. Sometimes known as `Scale`.
     *
     * @method Phaser.Plugin.Isometric.Point3#multiply
     * @param {number} x - The value to multiply Point3.x by.
     * @param {number} y - The value to multiply Point3.y by.
     * @param {number} z - The value to multiply Point3.z by.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    multiply: function (x, y, z) {

        this.x *= x || 1;
        this.y *= y || 1;
        this.z *= z || 1;

        return this;

    },

    /**
     * Divides Point3.x, Point3.y and Point3.z by the given x, y and z values.
     *
     * @method Phaser.Plugin.Isometric.Point3#divide
     * @param {number} x - The value to divide Point3.x by.
     * @param {number} y - The value to divide Point3.y by.
     * @param {number} z - The value to divide Point3.z by.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    divide: function (x, y, z) {

        this.x /= x || 1;
        this.y /= y || 1;
        this.z /= z || 1;

        return this;

    }
};

Phaser.Plugin.Isometric.Point3.prototype.constructor = Phaser.Plugin.Isometric.Point3;

/**
 * Adds the coordinates of two points together to create a new point.
 *
 * @method Phaser.Plugin.Isometric.Point3.add
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} [out] - Optional Point3 to store the value in, if not supplied a new Point3 object will be created.
 * @return {Phaser.Plugin.Isometric.Point3} The new Point3 object.
 */
Phaser.Plugin.Isometric.Point3.add = function (a, b, out) {

    if (typeof out === "undefined") {
        out = new Phaser.Plugin.Isometric.Point3();
    }

    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;

    return out;

};

/**
 * Subtracts the coordinates of two points to create a new point.
 *
 * @method Phaser.Plugin.Isometric.Point3.subtract
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} [out] - Optional Point3 to store the value in, if not supplied a new Point3 object will be created.
 * @return {Phaser.Plugin.Isometric.Point3} The new Point3 object.
 */
Phaser.Plugin.Isometric.Point3.subtract = function (a, b, out) {

    if (typeof out === "undefined") {
        out = new Phaser.Plugin.Isometric.Point3();
    }

    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;

    return out;

};

/**
 * Multiplies the coordinates of two points to create a new point.
 *
 * @method Phaser.Plugin.Isometric.Point3.multiply
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} [out] - Optional Point3 to store the value in, if not supplied a new Point3 object will be created.
 * @return {Phaser.Plugin.Isometric.Point3} The new Point3 object.
 */
Phaser.Plugin.Isometric.Point3.multiply = function (a, b, out) {

    if (typeof out === "undefined") {
        out = new Phaser.Plugin.Isometric.Point3();
    }

    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;

    return out;

};

/**
 * Divides the coordinates of two points to create a new point.
 *
 * @method Phaser.Plugin.Isometric.Point3.divide
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} [out] - Optional Point3 to store the value in, if not supplied a new Point3 object3 will be created.
 * @return {Phaser.Plugin.Isometric.Point3} The new Point3 object.
 */
Phaser.Plugin.Isometric.Point3.divide = function (a, b, out) {

    if (typeof out === "undefined") {
        out = new Phaser.Plugin.Isometric.Point3();
    }

    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;

    return out;

};

/**
 * Determines whether the two given Point3 objects are equal. They are considered equal if they have the same x, y and z values.
 *
 * @method Phaser.Plugin.Isometric.Point3.equals
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @return {boolean} A value of true if the Points3 are equal, otherwise false.
 */
Phaser.Plugin.Isometric.Point3.equals = function (a, b) {

    return (a.x === b.x && a.y === b.y && a.z === b.z);

};

/**
 * Creates a new Cube object with the bottom-back corner specified by the x, y and z parameters, with the specified breadth (widthX), depth (widthY) and height parameters. If you call this function without parameters, a Cube with x, y, z, breadth, depth and height properties set to 0 is created.
 *
 * @class Phaser.Plugin.Isometric.Cube
 * @constructor
 * @param {number} x - The x coordinate of the bottom-back corner of the Cube.
 * @param {number} y - The y coordinate of the bottom-back corner of the Cube.
 * @param {number} z - The z coordinate of the bottom-back corner of the Cube.
 * @param {number} widthX - The X axis width (breadth) of the Cube. Should always be either zero or a positive value.
 * @param {number} widthY - The Y axis width (depth) of the Cube. Should always be either zero or a positive value.
 * @param {number} height - The Z axis height of the Cube. Should always be either zero or a positive value.
 * @return {Phaser.Plugin.Isometric.Cube} This Cube object.
 */
Phaser.Plugin.Isometric.Cube = function (x, y, z, widthX, widthY, height) {

    x = x || 0;
    y = y || 0;
    z = z || 0;
    widthX = widthX || 0;
    widthY = widthY || 0;
    height = height || 0;

    /**
     * @property {number} x - The x coordinate of the bottom-back corner of the Cube.
     */
    this.x = x;

    /**
     * @property {number} y - The y coordinate of the bottom-back corner of the Cube.
     */
    this.y = y;

    /**
     * @property {number} z - The z coordinate of the bottom-back corner of the Cube.
     */
    this.z = z;

    /**
     * @property {number} widthX - The X axis width (breadth) of the Cube. This value should never be set to a negative.
     */
    this.widthX = widthX;

    /**
     * @property {number} widthY - The Y axis width (depth) of the Cube. This value should never be set to a negative.
     */
    this.widthY = widthY;

    /**
     * @property {number} height - The Z axis height of the Cube. This value should never be set to a negative.
     */
    this.height = height;

    /**
     * @property {Point3[]} _corners - The 8 corners of the Cube.
     * @private
     */
    this._corners = [
        new Phaser.Plugin.Isometric.Point3(this.x, this.y, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y + this.widthY, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y + this.widthY, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y + this.widthY, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y + this.widthY, this.z + this.height)
    ];
};

Phaser.Plugin.Isometric.Cube.prototype.constructor = Phaser.Plugin.Isometric.Cube;

Phaser.Plugin.Isometric.Cube.prototype = {
    /**
     * Sets the members of Cube to the specified values.
     * @method Phaser.Plugin.Isometric.Cube#setTo
     * @param {number} x - The x coordinate of the bottom-back corner of the Cube.
     * @param {number} y - The y coordinate of the bottom-back corner of the Cube.
     * @param {number} z - The z coordinate of the bottom-back corner of the Cube.
     * @param {number} widthX - The X axis width (breadth) of the Cube. This value should never be set to a negative.
     * @param {number} widthY - The Y axis width (depth) of the Cube. This value should never be set to a negative.
     * @param {number} height - The Z axis height of the Cube. This value should never be set to a negative.
     * @return {Phaser.Plugin.Isometric.Cube} This Cube object
     */
    setTo: function (x, y, z, widthX, widthY, height) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.widthX = widthX;
        this.widthY = widthY;
        this.height = height;

        return this;

    },

    /**
     * Copies the x, y, z, widthX, widthY and height properties from any given object to this Cube.
     * @method Phaser.Plugin.Isometric.Cube#copyFrom
     * @param {any} source - The object to copy from.
     * @return {Phaser.Plugin.Isometric.Cube} This Cube object.
     */
    copyFrom: function (source) {

        this.setTo(source.x, source.y, source.z, source.widthX, source.widthY, source.height);

    },

    /**
     * Copies the x, y, z, widthX, widthY and height properties from this Cube to any given object.
     * @method Phaser.Plugin.Isometric.Cube#copyTo
     * @param {any} dest - The object to copy to.
     * @return {Phaser.Plugin.Isometric.Cube} This Cube object.
     */
    copyTo: function (dest) {

        dest.x = this.x;
        dest.y = this.y;
        dest.z = this.z;
        dest.widthX = this.widthX;
        dest.widthY = this.widthY;
        dest.height = this.height;

        return dest;

    },

    /**
     * The size of the Cube object, expressed as a Point3 object with the values of the widthX, widthY and height properties.
     * @method Phaser.Plugin.Isometric.Cube#size
     * @param {Phaser.Plugin.Isometric.Point3} [output] - Optional Point3 object. If given the values will be set into the object, otherwise a brand new Point3 object will be created and returned.
     * @return {Phaser.Plugin.Isometric.Point3} The size of the Cube object.
     */
    size: function (output) {

        return Phaser.Plugin.Isometric.Cube.size(this, output);

    },

    /**
     * Returns a new Cube object with the same values for the x, y, z, widthX, widthY and height properties as the original Cube object.
     * @method Phaser.Plugin.Isometric.Cube#clone
     * @param {Phaser.Plugin.Isometric.Cube} [output] - Optional Cube object. If given the values will be set into the object, otherwise a brand new Cube object will be created and returned.
     * @return {Phaser.Plugin.Isometric.Cube}
     */
    clone: function (output) {

        return Phaser.Plugin.Isometric.Cube.clone(this, output);

    },

    /**
     * Determines whether the two Cubes intersect with each other.
     * This method checks the x, y, z, widthX, widthY, and height properties of the Cubes.
     * @method Phaser.Plugin.Isometric.Cube#intersects
     * @param {Phaser.Plugin.Isometric.Cube} b - The second Cube object.
     * @return {boolean} A value of true if the specified object intersects with this Cube object; otherwise false.
     */
    intersects: function (b) {

        return Phaser.Plugin.Isometric.Cube.intersects(this, b);

    },

    /**
     * Updates and returns an Array of eight Point3 objects containing the corners of this Cube.
     * @method Phaser.Plugin.Isometric.Cube#getCorners
     * @return {Phaser.Plugin.Isometric.Point3[]} The corners of this Cube expressed as an Array of eight Point3 objects.
     */
    getCorners: function () {

        this._corners[0].setTo(this.x, this.y, this.z);
        this._corners[1].setTo(this.x, this.y, this.z + this.height);
        this._corners[2].setTo(this.x, this.y + this.widthY, this.z);
        this._corners[3].setTo(this.x, this.y + this.widthY, this.z + this.height);
        this._corners[4].setTo(this.x + this.widthX, this.y, this.z);
        this._corners[5].setTo(this.x + this.widthX, this.y, this.z + this.height);
        this._corners[6].setTo(this.x + this.widthX, this.y + this.widthY, this.z);
        this._corners[7].setTo(this.x + this.widthX, this.y + this.widthY, this.z + this.height);

        return this._corners;

    },

    /**
     * Returns a string representation of this object.
     * @method Phaser.Plugin.Isometric.Cube#toString
     * @return {string} A string representation of the instance.
     */
    toString: function () {

        return "[{Cube (x=" + this.x + " y=" + this.y + " z=" + this.z + " widthX=" + this.widthX + " widthY=" + this.widthY + " height=" + this.height + " empty=" + this.empty + ")}]";

    }
};

/**
 * @name Phaser.Plugin.Isometric.Cube#halfWidthX
 * @property {number} halfWidthX - Half of the widthX of the Cube.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "halfWidthX", {

    get: function () {
        return Math.round(this.widthX * 0.5);
    }

});

/**
 * @name Phaser.Plugin.Isometric.Cube#halfWidthY
 * @property {number} halfWidthY - Half of the widthY of the Cube.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "halfWidthY", {

    get: function () {
        return Math.round(this.widthY * 0.5);
    }

});

/**
 * @name Phaser.Plugin.Isometric.Cube#halfHeight
 * @property {number} halfHeight - Half of the height of the Cube.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "halfHeight", {

    get: function () {
        return Math.round(this.height * 0.5);
    }

});

/**
 * The z coordinate of the bottom of the Cube. Changing the bottom property of a Cube object has no effect on the x, y, widthX and widthY properties.
 * However it does affect the height property, whereas changing the z value does not affect the height property.
 * @name Phaser.Plugin.Isometric.Cube#bottom
 * @property {number} bottom - The z coordinate of the bottom of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "bottom", {

    get: function () {
        return this.z;
    },

    set: function (value) {
        if (value >= this.top) {
            this.height = 0;
        } else {
            this.height = (this.top - value);
        }
        this.z = value;
    }

});

/**
 * The sum of the z and height properties. Changing the top property of a Cube object has no effect on the x, y, z, widthX and widthY properties, but does change the height property.
 * @name Phaser.Plugin.Isometric.Cube#top
 * @property {number} top - The sum of the z and height properties.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "top", {

    get: function () {
        return this.z + this.height;
    },

    set: function (value) {
        if (value <= this.z) {
            this.height = 0;
        } else {
            this.height = (value - this.z);
        }
    }

});

/**
 * The x coordinate of the back of the Cube. Changing the backX property of a Cube object has no effect on the y, z, widthY and height properties. However it does affect the widthX property, whereas changing the x value does not affect the width property.
 * @name Phaser.Plugin.Isometric.Cube#backX
 * @property {number} backX - The x coordinate of the left of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "backX", {

    get: function () {
        return this.x;
    },

    set: function (value) {
        if (value >= this.frontX) {
            this.widthX = 0;
        } else {
            this.widthX = (this.frontX - value);
        }
        this.x = value;
    }

});

/**
 * The y coordinate of the back of the Cube. Changing the backY property of a Cube object has no effect on the x, z, widthX and height properties. However it does affect the widthY property, whereas changing the y value does not affect the width property.
 * @name Phaser.Plugin.Isometric.Cube#backY
 * @property {number} backY - The x coordinate of the left of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "backY", {

    get: function () {
        return this.y;
    },

    set: function (value) {
        if (value >= this.frontY) {
            this.widthY = 0;
        } else {
            this.widthY = (this.frontY - value);
        }
        this.y = value;
    }

});

/**
 * The sum of the x and widthX properties. Changing the frontX property of a Cube object has no effect on the x, y, z, widthY and height properties, however it does affect the widthX property.
 * @name Phaser.Plugin.Isometric.Cube#frontX
 * @property {number} frontX - The sum of the x and widthX properties.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "frontX", {

    get: function () {
        return this.x + this.widthX;
    },

    set: function (value) {
        if (value <= this.x) {
            this.widthX = 0;
        } else {
            this.widthX = (value - this.x);
        }
    }

});

/**
 * The sum of the y and widthY properties. Changing the frontY property of a Cube object has no effect on the x, y, z, widthX and height properties, however it does affect the widthY property.
 * @name Phaser.Plugin.Isometric.Cube#frontY
 * @property {number} frontY - The sum of the y and widthY properties.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "frontY", {

    get: function () {
        return this.y + this.widthY;
    },

    set: function (value) {
        if (value <= this.y) {
            this.widthY = 0;
        } else {
            this.widthY = (value - this.y);
        }
    }

});

/**
 * The volume of the Cube derived from widthX * widthY * height.
 * @name Phaser.Plugin.Isometric.Cube#volume
 * @property {number} volume - The volume of the Cube derived from widthX * widthY * height.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "volume", {

    get: function () {
        return this.widthX * this.widthY * this.height;
    }

});

/**
 * The x coordinate of the center of the Cube.
 * @name Phaser.Plugin.Isometric.Cube#centerX
 * @property {number} centerX - The x coordinate of the center of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "centerX", {
    get: function () {
        return this.x + this.halfWidthX;
    },

    set: function (value) {
        this.x = value - this.halfWidthX;
    }
});

/**
 * The y coordinate of the center of the Cube.
 * @name Phaser.Plugin.Isometric.Cube#centerY
 * @property {number} centerY - The y coordinate of the center of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "centerY", {
    get: function () {
        return this.y + this.halfWidthY;
    },

    set: function (value) {
        this.y = value - this.halfWidthY;
    }
});

/**
 * The z coordinate of the center of the Cube.
 * @name Phaser.Plugin.Isometric.Cube#centerZ
 * @property {number} centerZ - The z coordinate of the center of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "centerZ", {
    get: function () {
        return this.z + this.halfHeight;
    },

    set: function (value) {
        this.z = value - this.halfHeight;
    }
});

/**
 * A random value between the frontX and backX values (inclusive) of the Cube.
 *
 * @name Phaser.Plugin.Isometric.Cube#randomX
 * @property {number} randomX - A random value between the frontX and backX values (inclusive) of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "randomX", {

    get: function () {

        return this.x + (Math.random() * this.widthX);

    }

});

/**
 * A random value between the frontY and backY values (inclusive) of the Cube.
 *
 * @name Phaser.Plugin.Isometric.Cube#randomY
 * @property {number} randomY - A random value between the frontY and backY values (inclusive) of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "randomY", {

    get: function () {

        return this.y + (Math.random() * this.widthY);

    }

});

/**
 * A random value between the bottom and top values (inclusive) of the Cube.
 *
 * @name Phaser.Plugin.Isometric.Cube#randomZ
 * @property {number} randomZ - A random value between the bottom and top values (inclusive) of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "randomZ", {

    get: function () {

        return this.z + (Math.random() * this.height);

    }

});

/**
 * Determines whether or not this Cube object is empty. A Cube object is empty if its widthX, widthY or height is less than or equal to 0.
 * If set to true then all of the Cube properties are set to 0.
 * @name Phaser.Plugin.Isometric.Cube#empty
 * @property {boolean} empty - Gets or sets the Cube's empty state.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "empty", {

    get: function () {
        return (!this.widthX || !this.widthY || !this.height);
    },

    set: function (value) {

        if (value === true) {
            this.setTo(0, 0, 0, 0, 0, 0);
        }

    }

});

/**
 * The size of the Cube object, expressed as a Point3 object with the values of the widthX, widthY and height properties.
 * @method Phaser.Plugin.Isometric.Cube.size
 * @param {Phaser.Plugin.Isometric.Cube} a - The Cube object.
 * @param {Phaser.Plugin.Isometric.Point3} [output] - Optional Point3 object. If given the values will be set into the object, otherwise a brand new Point3 object will be created and returned.
 * @return {Phaser.Plugin.Isometric.Point3} The size of the Cube object
 */
Phaser.Plugin.Isometric.Cube.size = function (a, output) {
    if (typeof output === "undefined" || output === null) {
        output = new Phaser.Plugin.Isometric.Point3(a.widthX, a.widthY, a.height);
    } else {
        output.setTo(a.widthX, a.widthY, a.height);
    }

    return output;
};

/**
 * Returns a new Cube object with the same values for the x, y, z, widthX, widthY, and height properties as the original Cube object.
 * @method Phaser.Plugin.Isometric.Cube.clone
 * @param {Phaser.Plugin.Isometric.Cube} a - The Cube object.
 * @param {Phaser.Plugin.Isometric.Cube} [output] - Optional Cube object. If given the values will be set into the object, otherwise a brand new Cube object will be created and returned.
 * @return {Phaser.Plugin.Isometric.Cube}
 */
Phaser.Plugin.Isometric.Cube.clone = function (a, output) {
    if (typeof output === "undefined" || output === null) {
        output = new Phaser.Plugin.Isometric.Cube(a.x, a.y, a.z, a.widthX, a.widthY, a.height);
    } else {
        output.setTo(a.x, a.y, a.z, a.widthX, a.widthY, a.height);
    }

    return output;
};

/**
 * Determines whether the specified coordinates are contained within the region defined by this Cube object.
 * @method Phaser.Plugin.Isometric.Cube.contains
 * @param {Phaser.Plugin.Isometric.Cube} a - The Cube object.
 * @param {number} x - The x coordinate of the point to test.
 * @param {number} y - The y coordinate of the point to test.
 * @param {number} z - The z coordinate of the point to test.
 * @return {boolean} A value of true if the Cube object contains the specified point; otherwise false.
 */
Phaser.Plugin.Isometric.Cube.contains = function (a, x, y, z) {
    if (a.widthX <= 0 || a.widthY <= 0 || a.height <= 0) {
        return false;
    }

    return (x >= a.x && x <= a.right && y >= a.y && y <= a.back && z >= a.z && z <= a.top);
};

/**
 * Determines whether the specified point is contained within the cubic region defined by this Cube object. This method is similar to the Cube.contains() method, except that it takes a Point3 object as a parameter.
 * @method Phaser.Plugin.Isometric.Cube.containsPoint3
 * @param {Phaser.Plugin.Isometric.Cube} a - The Cube object.
 * @param {Phaser.Plugin.Isometric.Point3} point3 - The Point3 object being checked. Can be Point3 or any object with .x, .y and .z values.
 * @return {boolean} A value of true if the Cube object contains the specified point; otherwise false.
 */
Phaser.Plugin.Isometric.Cube.containsPoint3 = function (a, point3) {
    return Phaser.Plugin.Isometric.Cube.contains(a, point3.x, point3.y, point3.z);
};

/**
 * Determines whether the first Cube object is fully contained within the second Cube object.
 * A Cube object is said to contain another if the second Cube object falls entirely within the boundaries of the first.
 * @method Phaser.Plugin.Isometric.Cube.containsCube
 * @param {Phaser.Plugin.Isometric.Cube} a - The first Cube object.
 * @param {Phaser.Plugin.Isometric.Cube} b - The second Cube object.
 * @return {boolean} A value of true if the Cube object contains the specified point; otherwise false.
 */
Phaser.Plugin.Isometric.Cube.containsCube = function (a, b) {

    //  If the given cube has a larger volume than this one then it can never contain it
    if (a.volume > b.volume) {
        return false;
    }

    return (a.x >= b.x && a.y >= b.y && a.z >= b.z && a.frontX <= b.frontX && a.frontY <= b.frontY && a.top <= b.top);

};

/**
 * Determines whether the two Cubes intersect with each other.
 * This method checks the x, y, z, widthX, widthY, and height properties of the Cubes.
 * @method Phaser.Plugin.Isometric.Cube.intersects
 * @param {Phaser.Plugin.Isometric.Cube} a - The first Cube object.
 * @param {Phaser.Plugin.Isometric.Cube} b - The second Cube object.
 * @return {boolean} A value of true if the specified object intersects with this Cube object; otherwise false.
 */
Phaser.Plugin.Isometric.Cube.intersects = function (a, b) {
    if (a.widthX <= 0 || a.widthY <= 0 || a.height <= 0 || b.widthX <= 0 || b.widthY <= 0 || b.height <= 0) {
        return false;
    }
    return !(a.frontX < b.x || a.frontY < b.y || a.x > b.frontX || a.y > b.frontY || a.z > b.top || a.top < b.z);
};