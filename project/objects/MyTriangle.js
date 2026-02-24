import { CGFobject } from '../../lib/CGF.js';

/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, Math.sqrt(3), 0,     
            -1, 0, 0,                  
            1, 0, 0
        ];

        this.indices = [
            0, 1, 2,
            2, 1, 0
        ];

        this.normals = [
            0, 0, 1,  //normals
            0, 0, 1,
            0, 0, 1
        ];

        this.texCoords = [
            0, 0,   // V0
            0, 1,   // V1
            1, 1    // V2
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
