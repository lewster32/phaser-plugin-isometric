/**
 * @class Phaser.Plugin.Isometric.Point3
 * 
 * @classdesc
 * The Point3 object represents a location in a three-dimensional coordinate system,
 * where x and y represent the horizontal axes and z represents the vertical axis.
 * The following code creates a point at (0,0,0):
 * `var myPoint = new Phaser.Plugin.Isometric.Point3();`
 * 
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
    copyTo: function (dest) {

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
    add: function (x, y, z) {

        this.x += x || 0;
        this.y += y || 0;
        this.z += z || 0;

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
