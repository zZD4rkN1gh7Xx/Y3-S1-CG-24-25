import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyTriangleSmall extends CGFobject 
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
            -1, 0, 0, //0
            1, 0, 0, //1
            0, 1, 0, // 2

        ];

        this.indices = 
        [
            0, 1, 2,
            2, 1, 0
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
			0 ,0,     
			0, 1,  
		];


        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();

    }

    updateTexCoords(coords) {
        this.texCoords = [...coords]; 
        this.updateTexCoordsGLBuffers(); 
    }

    setTexCoords(coords) {
        if (coords.length == 6) { 
            this.updateTexCoords(coords);
        } else {
            console.error("Invalid texture coordinates. Expected 6 elements (s1, t1, s2, t2, s3, t3).");
        }
    }
}