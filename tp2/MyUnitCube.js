import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyUnitCube extends CGFobject
{
    constructor(scene)
    {
        super(scene);
        this.initBuffers();
    }

    initBuffers()
    {
        this.vertices = 
        [

            0.5, 0.5, -0.5, //0
			-0.5, 0.5, -0.5, //1
			-0.5, 0.5, 0.5, //2
			0.5, 0.5, 0.5, //3

            0.5, -0.5, -0.5, //4
			-0.5, -0.5, -0.5, //5
			-0.5, -0.5, 0.5, //6
			0.5, -0.5, 0.5 //7

        ];

        this.indices = 
        [
            0, 1, 2, //1 (topo)
            0, 2, 3,

            4,7,6, //2 (base)
            4,6,5,
            
            3,2,6, //3
            3,6,7,

            0,3,7,//4
            0,7,4,
            
            0,4,5,//5
            0,5,1,

            1,5,6,//6
            1,6,2
            
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}