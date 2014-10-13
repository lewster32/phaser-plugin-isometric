declare module Phaser.Plugin {
	class Isometric extends Phaser.Plugin {
		projector: Phaser.Plugin.Isometric.Projector;

		constructor(game: Phaser.Game, parent: any);

		addIsoSprite(x: number, y: number, z: number, key?: any, frame?: any, group?: Phaser.Group): Phaser.Sprite;
	}

	module Isometric {
		class Projector {
			anchor: Phaser.Point;
		}
	}

}