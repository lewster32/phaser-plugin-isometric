declare module Phaser.Plugin {
	class Isometric extends Phaser.Plugin {
		projector: Phaser.Plugin.Isometric.Projector;

		constructor(game: Phaser.Game, parent?: any);

		addIsoSprite(x: number, y: number, z: number, key?: any, frame?: any, group?: Phaser.Group): Phaser.Sprite;
	}

	module Isometric {
		class Projector {
			game: Phaser.Game;
			anchor: Phaser.Point;
			projectionAngle: number;

			project(point3:Phaser.Plugin.Isometric.Point3, out:Phaser.Point) : Phaser.Point;
			projectXy(point3:Phaser.Plugin.Isometric.Point3, out:Phaser.Point) : Phaser.Point;
			unproject(point:Phaser.Point, out: Phaser.Plugin.Isometric.Point3, z: number): Phaser.Plugin.Isometric.Point3;
			simpleSort(group: Phaser.Group);
			topologicalSort(group: Phaser.Group, padding: number, prop: string);

		}

		class Point3 {
			x: number;
			y: number;
			z: number;

			constructor(x: number, y: number, z: number);
			
			copyFrom(source:Phaser.Plugin.Isometric.Point3) : Phaser.Plugin.Isometric.Point3;
			copyto(dest:Phaser.Plugin.Isometric.Point3) : Phaser.Plugin.Isometric.Point3;
			equals(a:Phaser.Plugin.Isometric.Point3) : boolean;
			set(x: number, y: number, z: number) : Phaser.Plugin.Isometric.Point3;
			setTo(x: number, y: number, z: number) : Phaser.Plugin.Isometric.Point3;
			add(x: number, y: number) : Phaser.Plugin.Isometric.Point3;
			subtract(x: number, y: number, z: number) : Phaser.Plugin.Isometric.Point3;
			multiply(x: number, y: number, z: number) : Phaser.Plugin.Isometric.Point3;
			divide(x: number, y: number, z: number) : Phaser.Plugin.Isometric.Point3;
		}

		class IsoSprite extends Phaser.Sprite{
			snap: number;
			constructor(game: Phaser.Game, x: number, y: number, z: number, key?: any, frame?: any);

		}
	}

}