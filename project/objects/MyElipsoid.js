import { CGFobject } from '../../lib/CGF.js';

export class MyEllipsoid extends CGFobject {
    constructor(scene, slices, stacks, radiusX, radiusY, radiusZ) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.radiusZ = radiusZ;
        this.flipNormals = false;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let stack = 0; stack <= this.stacks; ++stack) {
            const phi = stack * Math.PI / this.stacks;
            for (let slice = 0; slice <= this.slices; ++slice) {
                const theta = slice * 2 * Math.PI / this.slices;

                // Coordinates
                const x = this.radiusX * Math.sin(phi) * Math.cos(theta);
                const y = this.radiusY * Math.cos(phi);
                const z = this.radiusZ * Math.sin(phi) * Math.sin(theta);
                this.vertices.push(x, y, z);

                // Normals from unit sphere
                const nx = Math.sin(phi) * Math.cos(theta);
                const ny = Math.cos(phi);
                const nz = Math.sin(phi) * Math.sin(theta);

                if (this.flipNormals)
                    this.normals.push(-nx, -ny, -nz);
                else
                    this.normals.push(nx, ny, nz);

                this.texCoords.push(
                    slice / this.slices,
                    stack / this.stacks
                );
            }
        }

        for (let stack = 0; stack < this.stacks; ++stack) {
            for (let slice = 0; slice < this.slices; ++slice) {
                const first = stack * (this.slices + 1) + slice;
                const second = first + this.slices + 1;

                if (this.flipNormals) {
                    this.indices.push(first, second + 1, second);
                    this.indices.push(first, first + 1, second + 1);
                } else {
                    this.indices.push(first, second, second + 1);
                    this.indices.push(first, second + 1, first + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    setInsideView() {
        this.flipNormals = true;
        this.initBuffers();
    }

    setOutsideView() {
        this.flipNormals = false;
        this.initBuffers();
    }
}
