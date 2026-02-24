import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();
        
        // === Other ===
        const folderOther = this.gui.addFolder("Other");
        folderOther.add(this.scene, 'displayAxis').name("Display Axis");

        // === Planet ===
        //const folderPlanet = this.gui.addFolder("Planet Scene");
        //folderPlanet.add(this.scene, 'displayPlanet').name("Display Planet");

         // === Fire Scene ===
        const folderScene = this.gui.addFolder("Scene");
        folderScene.add(this.scene, 'displayFireScene').name("Switch scenes");

        // === Fire Scene objects ===
        const folderSceneObjects = this.gui.addFolder("Fire Scene Objects");
        folderSceneObjects.add(this.scene, 'displayPlane').name("Display Ground");
        folderSceneObjects.add(this.scene, 'displayLandscape').name("Display Sky");
        folderSceneObjects.add(this.scene, 'displayBuilding').name("Display Building");
        folderSceneObjects.add(this.scene, 'displayTrees').name("Display Trees");
        folderSceneObjects.add(this.scene, 'displayHelicopter').name("Display Helicopter");
        folderSceneObjects.add(this.scene, 'displayLake').name("Display Lake");

        // === Scene actions ===
        const folderSceneActions = this.gui.addFolder("Fire Scene Actions");
        //folderSceneActions.add(this.scene, 'goThirdPerson').name("3rd person heli");
        let label = { info: " V to toggle 3rd person" };
        folderSceneActions.add(label, 'info').name("");
        folderSceneActions.add(this.scene, 'speedFactor', 0.1, 3).name("Speed Factor");
        
        this.initKeys();


        
        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};

        this.releasedKeys = {}; //array that stores released keys (will be cleaned each update)
        
        //register event listeners ?
        document.addEventListener("keydown", this.processKeyDown.bind(this));
        document.addEventListener("keyup", this.processKeyUp.bind(this));

    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
        this.releasedKeys[event.code] = true;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

    wasKeyReleased(keyCode) {
    return this.releasedKeys[keyCode] || false;
    }

    resetReleasedKeys() {
        this.releasedKeys = {};
    }
    
}