import {CGFobject} from '../../lib/CGF.js';

export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Front face
            -0.5, -0.5,  0.5, // 0
             0.5, -0.5,  0.5, // 1
             0.5,  0.5,  0.5, // 2
            -0.5,  0.5,  0.5, // 3

            // Back face
            -0.5, -0.5, -0.5, // 4
             0.5, -0.5, -0.5, // 5
             0.5,  0.5, -0.5, // 6
            -0.5,  0.5, -0.5, // 7

            // Top face
            -0.5,  0.5,  0.5, // 8
             0.5,  0.5,  0.5, // 9
             0.5,  0.5, -0.5, // 10
            -0.5,  0.5, -0.5, // 11

            // Bottom face
            -0.5, -0.5,  0.5, // 12
             0.5, -0.5,  0.5, // 13
             0.5, -0.5, -0.5, // 14
            -0.5, -0.5, -0.5, // 15

            // Right face
             0.5, -0.5,  0.5, // 16
             0.5, -0.5, -0.5, // 17
             0.5,  0.5, -0.5, // 18
             0.5,  0.5,  0.5, // 19

            // Left face
            -0.5, -0.5,  0.5, // 20
            -0.5, -0.5, -0.5, // 21
            -0.5,  0.5, -0.5, // 22
            -0.5,  0.5,  0.5  // 23
        ];

        this.indices = [
            0, 1, 2,  0, 2, 3,       // Front
            4, 6, 5,  4, 7, 6,       // Back
            8, 9,10,  8,10,11,       // Top
            12,14,13, 12,15,14,      // Bottom
            16,17,18, 16,18,19,      // Right
            20,23,22, 20,22,21       // Left
        ];

        this.normals = [
            // Front face normals (0, 0, 1)
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // Back face normals (0, 0, -1)
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Top face normals (0, 1, 0)
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Bottom face normals (0, -1, 0)
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Right face normals (1, 0, 0)
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // Left face normals (-1, 0, 0)
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0
        ];

        this.texCoords = [
            // Front
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Back
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Top
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Bottom
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Right
            0, 0,
            1, 0,
            1, 1,
            0, 1,

            // Left
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
