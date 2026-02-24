import { CGFobject } from '../../lib/CGF.js';

/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of slices (sides) of the prism
 * @param stacks - Number of stacks (layers) of the prism
 */
export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let index = 0;
        let angle = 2 * Math.PI / this.slices;
        let currentZ = 1 / this.stacks;

        // Side faces
        for (let a = 0; a < this.slices; a++) {
            let x1 = Math.cos(a * angle);
            let y1 = Math.sin(a * angle);
            let x2 = Math.cos((a + 1) * angle);
            let y2 = Math.sin((a + 1) * angle);

            for (let b = 0; b < this.stacks; b++) {
                let z1 = b * currentZ;
                let z2 = (b + 1) * currentZ;

                // Vertices
                this.vertices.push(x1, y1, z1);
                this.vertices.push(x2, y2, z1);
                this.vertices.push(x1, y1, z2);
                this.vertices.push(x2, y2, z2);

                // Indices
                this.indices.push(index, index + 1, index + 2);
                this.indices.push(index + 1, index + 3, index + 2);

                // Normals (pointing outward)
                let normalX = Math.cos((a + 0.5) * angle);
                let normalY = Math.sin((a + 0.5) * angle);
                for (let i = 0; i < 4; i++) {
                    this.normals.push(normalX, normalY, 0);
                }

                // Texture coords
                let u0 = a / this.slices;
                let u1 = (a + 1) / this.slices;
                let v0 = b / this.stacks;
                let v1 = (b + 1) / this.stacks;
                this.texCoords.push(u0, v0);
                this.texCoords.push(u1, v0);
                this.texCoords.push(u0, v1);
                this.texCoords.push(u1, v1);

                index += 4;
            }
        }

        // Top base
        let topCenter = index;
        this.vertices.push(0, 0, 1);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);  // center texCoord

        for (let a = 0; a < this.slices; a++) {
            let x = Math.cos(a * angle);
            let y = Math.sin(a * angle);
            this.vertices.push(x, y, 1);
            this.normals.push(0, 0, 1);

            // Map circle to square texCoord space
            this.texCoords.push(0.5 + 0.5 * x, 0.5 - 0.5 * y);
        }

        for (let a = 0; a < this.slices; a++) {
            let current = topCenter + 1 + a;
            let next = topCenter + 1 + ((a + 1) % this.slices);
            this.indices.push(topCenter, current, next);
        }

        index += this.slices + 1;

        // Bottom base
        let baseCenter = index;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(0.5, 0.5);  // center texCoord

        for (let a = 0; a < this.slices; a++) {
            let x = Math.cos(a * angle);
            let y = Math.sin(a * angle);
            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(0.5 + 0.5 * x, 0.5 - 0.5 * y);
        }

        for (let a = 0; a < this.slices; a++) {
            let current = baseCenter + 1 + a;
            let next = baseCenter + 1 + ((a + 1) % this.slices);
            this.indices.push(baseCenter, next, current);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {}
}
