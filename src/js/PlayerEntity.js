import Entity from "./Entity.js";

export default class PlayerEntity extends Entity {
    constructor(entraceDoorCoord) {
        super();
        this.setBaseHealth(8);
        this.attack = 10;
        this.entityDiv.addClass('player');
        this.entityType = "Player";
        this.setPosition({x:entraceDoorCoord,y:1});
        this.setIsSpawned(true);
    }
    

}