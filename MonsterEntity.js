import Entity from "./Entity.js";

export default class MonsterEntity extends Entity {
    constructor() {
        super();
        this.entityDiv = $("<div class='entity monster'></div>");
    }

    getEntityDiv = () => this.entityDiv;
}