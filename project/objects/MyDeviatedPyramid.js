import {CGFobject} from '../../lib/CGF.js';

export class MyDeviatedPyramid extends CGFobject {
    constructor(scene, height, width, tipOffsetX) {
        super(scene);
        this.slices = 3;
        this.height = height;
        this.width = width;
        this.tipOffsetX = tipOffsetX;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let ang = 0;
        const alphaAng = 2 * Math.PI / this.slices;

        const baseVertices = [];

        for (let i = 0; i < this.slices; i++) {
            const sa = Math.sin(ang);
            const ca = Math.cos(ang);
            baseVertices.push([this.width * ca, 0, -this.width * sa]);
            ang += alphaAng;
        }

        //tip aligned with middle of edge 1–2
        const base1 = baseVertices[1];
        const base2 = baseVertices[2];
        const midBase = [
            (base1[0] + base2[0]) / 2 + this.tipOffsetX,
            this.height,
            (base1[2] + base2[2]) / 2
        ];

        // triangle 1
        const base0 = baseVertices[0];

        this.vertices.push(...midBase); // tip
        this.vertices.push(...base0);
        this.vertices.push(...base1);

        const normal1 = this.computeNormal(midBase, base0, base1);
        this.normals.push(...normal1, ...normal1, ...normal1);
        this.indices.push(0, 1, 2);
        this.texCoords.push(0.5, 1.0); // tip
        this.texCoords.push(0.0, 0.0); // base0
        this.texCoords.push(1.0, 0.0); // base1

        // triangle 2
        this.vertices.push(...midBase); // tip
        this.vertices.push(...base1);
        this.vertices.push(...base2);

        const normal2 = this.computeNormal(midBase, base1, base2);
        this.normals.push(...normal2, ...normal2, ...normal2);
        this.indices.push(3, 4, 5);
        this.texCoords.push(0.5, 1.0); // tip
        this.texCoords.push(0.0, 0.0); // base1
        this.texCoords.push(1.0, 0.0); // base2

        // triangle 3
        this.vertices.push(...midBase); // tip
        this.vertices.push(...base2);
        this.vertices.push(...base0);

        const normal3 = this.computeNormal(midBase, base2, base0);
        this.normals.push(...normal3, ...normal3, ...normal3);
        this.indices.push(6, 7, 8);
        this.texCoords.push(0.5, 1.0); // tip
        this.texCoords.push(0.0, 0.0); // base2
        this.texCoords.push(1.0, 0.0); // base0

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    computeNormal(p1, p2, p3) {
        const U = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
        const V = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];
        const N = [U[1] * V[2] - U[2] * V[1], U[2] * V[0] - U[0] * V[2], U[0] * V[1] - U[1] * V[0]];
        const length = Math.sqrt(N[0] ** 2 + N[1] ** 2 + N[2] ** 2);
        return [N[0] / length, N[1] / length, N[2] / length];
    }
}
