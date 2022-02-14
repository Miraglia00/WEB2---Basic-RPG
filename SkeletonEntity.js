import Entity from "./Entity.js";

export default class SkeletonEntity extends Entity {
    constructor() {
        super();
        this.entityDiv.addClass('skeleton'); 
    }
}