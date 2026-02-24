import {CGFobject} from '../../lib/CGF.js';

/**
* MySphere
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions from equator to each pole
*/
export class MySphere extends CGFobject {
    constructor(scene, slices, stacks) {
      super(scene);
      this.slices = slices;
      this.stacks = stacks;
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
  
          const x = Math.sin(phi) * Math.cos(theta);
          const y = Math.cos(phi);
          const z = Math.sin(phi) * Math.sin(theta);
  
          this.vertices.push(x, y, z);
  
            
          if (this.flipNormals)
            this.normals.push(x, y, z);
          else
            this.normals.push(-x, -y, -z);

            this.texCoords.push(
              this.flipNormals ? 1 - (slice / this.slices) : slice / this.slices,
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
      this.flipNormals = false;
      this.initBuffers(); 
    }

    setOutsideView() {
      this.flipNormals = true;
      this.initBuffers(); 
    }
  }
  