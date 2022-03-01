import Entity from "./Entity.js";

export default class MonsterEntity extends Entity {
    constructor() {
        super();
        this.setBaseHealth(7);
        this.attack = 2;
        this.entityDiv.addClass('monster');
        this.entityType = "Monster";
    }
}