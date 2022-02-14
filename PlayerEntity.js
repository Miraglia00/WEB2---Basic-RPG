import Entity from "./Entity.js";

export default class PlayerEntity extends Entity {
    constructor() {
        super();
        this.entityDiv.addClass('player'); 
    }
}