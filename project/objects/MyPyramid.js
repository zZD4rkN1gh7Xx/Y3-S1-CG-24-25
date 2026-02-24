import {CGFobject} from '../../lib/CGF.js';
/**
* MyPyramid
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyPyramid extends CGFobject {
    constructor(scene, slices, stacks, height, width) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.width = width;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        for(var i = 0; i < this.slices; i++){
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa = Math.sin(ang);
            var saa = Math.sin(ang + alphaAng);
            var ca = Math.cos(ang);
            var caa = Math.cos(ang + alphaAng);

            this.vertices.push(0, this.height, 0);
            this.vertices.push(this.width * ca, 0, -this.width * sa);
            this.vertices.push(this.width * caa, 0, -this.width * saa);

            // triangle normal computed by cross product of two edges
            var normal = [
                saa - sa,
                (ca * saa - sa * caa) / this.height,
                caa - ca
            ];

            // normalization
            var nsize = Math.sqrt(
                normal[0]*normal[0] +
                normal[1]*normal[1] +
                normal[2]*normal[2]
            );
            normal[0] /= nsize;
            normal[1] /= nsize;
            normal[2] /= nsize;

            // push normal once for each vertex of this triangle
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);

            // texture coords
            this.texCoords.push(0.5, 1);  //tip (top middle)
            this.texCoords.push(0, 0);    //left base
            this.texCoords.push(1, 0);    //right base

            this.indices.push(3 * i, 3 * i + 1, 3 * i + 2);

            ang += alphaAng;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
       this.updateTexCoordsGLBuffers();

    }
    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity);//complexity varies 0-1, so slices varies 3-12
        
        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
