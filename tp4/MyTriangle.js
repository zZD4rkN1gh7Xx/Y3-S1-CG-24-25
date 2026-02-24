import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyTriangle extends CGFobject 
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
            -1, 1, 0, //0
            -1, -1, 0, //1
            1, -1, 0, // 2
        ];

        this.indices = 
        [
            0, 1, 2,

            2, 1, 0,
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
            0 ,0,  
			0, 1,  
			1, 1,  
		];


        this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();

    }
    updateTexCoords(coords) {
        this.texCoords = [...coords]; 
        this.updateTexCoordsGLBuffers(); 
    }

}