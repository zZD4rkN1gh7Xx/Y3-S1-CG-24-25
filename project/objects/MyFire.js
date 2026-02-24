import { CGFobject, CGFappearance, CGFshader } from '../../lib/CGF.js';
import { MyTriangle } from './MyTriangle.js';

export class MyFire extends CGFobject {
    constructor(scene, numFlames) {
        super(scene);
        this.scene = scene;
        this.numFlames = numFlames;
        this.flames = [];

        this.fireTexture = new CGFappearance(scene);
        this.fireTexture.setAmbient(1.0, 0.3, 0.0, 1.0);
        this.fireTexture.setDiffuse(1.0, 0.5, 0.0, 1.0);
        this.fireTexture.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.fireTexture.setShininess(100.0);
        this.fireTexture.setEmission(1.0, 0, 0, 1.0);
        this.fireTexture.loadTexture('textures/fire1.png');

        this.fireShader = new CGFshader(this.scene.gl, "shaders/fire.vert", "shaders/fire.frag");
        this.fireShader.setUniformsValues({ uTime: 0 });

        for (let i = 0; i < numFlames; i++) {
            const triangle = new MyTriangle(scene);
            const scale = Math.random() * 1.2 + 0.2;
            const offsetX = Math.random() * 1;
            const offsetY = Math.random() * 3;
            const offsetZ = Math.random() * 1;
            const rotationZ = (Math.random() * (Math.PI / 2)) - (Math.PI / 4)
            const rotationY = Math.random() * 2 * Math.PI;
            const rotationX = (Math.random() * (Math.PI / 2)) - (Math.PI / 4)

            this.flames.push({
                triangle,
                scale,
                offsetX,
                offsetZ,
                offsetY,
                rotationZ,
                rotationY,
                rotationX
            });
        }
    }

    setupFireShader() {
        //apply texture and shader for all fires
        this.fireTexture.apply();
        this.scene.setActiveShader(this.fireShader);
        
        let t = performance.now() / 1000;
        this.fireShader.setUniformsValues({ uTime: t });
    }

    cleanupFireShader() {
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    displayGeometryOnly() {
        //only render the flame triangle
        for (const flame of this.flames) {
            this.scene.pushMatrix();
            this.scene.translate(flame.offsetX, flame.offsetY, flame.offsetZ);
            this.scene.rotate(flame.rotationY, 0, 1, 0);
            this.scene.rotate(flame.rotationZ, 0, 0, 1);
            this.scene.rotate(flame.rotationX, 1, 0, 0);
            this.scene.scale(flame.scale, flame.scale * 2, 1); // taller flame
            flame.triangle.display();
            this.scene.popMatrix();
        }
    }

    display() {
        //for smooth animation
        let t = performance.now() / 1000;

        //update shader uniform
        this.fireShader.setUniformsValues({ uTime: t });

        this.fireTexture.apply();
        this.scene.setActiveShader(this.fireShader);

        for (const flame of this.flames) {
            this.scene.pushMatrix();
            this.scene.translate(flame.offsetX, flame.offsetY, flame.offsetZ);
            this.scene.rotate(flame.rotationY, 0, 1, 0);
            this.scene.rotate(flame.rotationZ, 0, 0, 1);
            this.scene.rotate(flame.rotationX, 1, 0, 0);
            this.scene.scale(flame.scale, flame.scale * 2, 1); // taller flame
            flame.triangle.display();
            this.scene.popMatrix();
        }

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}