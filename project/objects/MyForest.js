import { CGFobject } from '../../lib/CGF.js';
import { MyFire } from './MyFire.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
    constructor(scene, rows, cols) {
        super(scene);

        this.rows = rows;
        this.cols = cols;
        
        const areaWidth = 120;
        const areaDepth = 80;

        const spacingX = areaWidth / cols;
        const spacingZ = areaDepth / rows;

        this.trees = [];
        this.fire = new MyFire(this.scene, 20);
        let index = 1;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                //offset within 25% of cell
                const offsetX = (Math.random() - 0.5) * spacingX * 0.5;
                const offsetZ = (Math.random() - 0.5) * spacingZ * 0.5;

                const x = j * spacingX + offsetX - areaWidth / 2;
                const z = i * spacingZ + offsetZ - areaDepth / 2;

                //tree parameters
                const treeHeight = 3 + Math.random() * 3; //between 3 and 6
                const trunkRadius = 1 + Math.random() * 0.5; //between 1 and 1.5

                const crownColor = [
                    0.1 + Math.random() * 0.4, //R 
                    0.4 + Math.random() * 0.6, //G
                    0.1 + Math.random() * 0.2  //B
                ];

                //const rotaionDegrees = Math.random()*360;- if i ever feel like making the forest look like a deathscape
                const rotationAxis = Math.random() < 0.5 ? 'X' : 'Z';
                const postiveOrNegativeDegrees = Math.random() < 0.5 ? -1 : 1;
                const rotaionDegrees = Math.random() * 12.5 * postiveOrNegativeDegrees;

                const tree = new MyTree(scene, rotaionDegrees, rotationAxis, trunkRadius, treeHeight, crownColor);

                //the +10 and -50 are simply a simple translation to put the trees in a more suitable place
                this.trees.push({
                    index: index,
                    x: x + 10,
                    z: z - 50,
                    tree: tree,
                    onFire: Math.random() < 0.3
                });
                index++;
            }
        }
    }

    display() {
        //render all trees first
        for (let t of this.trees) {
            this.scene.pushMatrix();
            this.scene.translate(t.x, 0, t.z);
            t.tree.display();
            this.scene.popMatrix();
        }

        //batch render all fires together
        this.renderAllFires();
    }

    renderAllFires() {
        //collect all burning trees first
        const burningTrees = this.trees.filter(t => t.onFire);
        
        if (burningTrees.length === 0) return;

        // fire shader to all fires
        this.fire.setupFireShader();

        //render all fire instances
        for (let t of burningTrees) {
            this.scene.pushMatrix();
            this.scene.translate(t.x, 0, t.z);
            this.scene.scale(2, 2, 2);
            
            //render fire geometry without changing shader state
            this.fire.displayGeometryOnly();
            
            this.scene.popMatrix();
        }

        this.fire.cleanupFireShader();
    }

    putOutTree(treeIndex) {
        for (let t of this.trees) {
            if (t.index === treeIndex) {
                t.onFire = false;
            }
        }
    }
}