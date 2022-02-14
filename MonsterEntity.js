import Entity from "./Entity.js";

export default class MonsterEntity extends Entity {
    constructor() {
        super();
        this.health = 7;
        this.attack = 2;
        this.entityDiv.addClass('monster'); 
    }
}