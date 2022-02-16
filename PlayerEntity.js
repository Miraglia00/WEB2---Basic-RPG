import Entity from "./Entity.js";

export default class PlayerEntity extends Entity {
    constructor(entraceDoorCoord) {
        super();
        this.setBaseHealth(8);
        this.entityDiv.addClass('player');
        this.entityType = "Player";
        this.actionPoints = {
            base: 2,
            used: 0
        };
        this.setPosition({x:11,y:entraceDoorCoord});
        this.setIsSpawned(true);
    }

    getActionPoints = () => this.actionPoints;

    setUsedActionPoints = (amount) => {
        this.actionPoints.used += amount;
    }
    

}