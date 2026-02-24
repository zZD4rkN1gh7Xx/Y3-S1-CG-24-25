import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyParallelogram extends CGFobject
{
    constructor(scene,coords) {
		super(scene);
		this.initBuffers();
		if (coords != undefined)
			this.updateTexCoords(coords);
	}

    initBuffers()
    {
        this.vertices = 
        [
            0, 0 , 0, // 0
            2, 0, 0, // 1
            3, 1, 0, // 2
            1, 1, 0 // 3
        ];

        this.indices = 
        [
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
			1, 1,  
			0.5, 1,  
			0.25, 0.75,  
			0.75, 0.75   
		];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}