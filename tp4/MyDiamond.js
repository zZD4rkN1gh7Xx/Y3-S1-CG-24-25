import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 * @param {Array} coords - Array of texture coordinates (optional)
 */
export class MyDiamond extends CGFobject {
	constructor(scene,coords) {
		super(scene);
		this.initBuffers();
		if (coords != undefined)
			this.updateTexCoords(coords);
	}
	
	initBuffers() {
		this.vertices = [
			0, -1, 0, 
			1, 0, 0,
			0, 1, 0,
			-1, 0, 0
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			0, 2, 3,

			2, 1, 0,
			3, 2, 0
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		   this.texCoords = [
			0.25, 0.75,  
			0.5, 0.5,  
			0.25, 0.25,  
			0, 0.5   
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

