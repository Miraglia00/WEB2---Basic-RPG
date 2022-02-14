import Entity from "./Entity.js";

export default class Render {
    constructor(gridDiv) {
        this.grid = gridDiv;
    }

    renderEntity = (e) => {
        if(e instanceof Entity) {
            console.log(e.getPosition())
            if(e.getPosition().isSpawned === true) {
                let entity = $("<div class='entity'></div>");
            
                $('div.grid-block#' + e.getPosition().x + '-' + e.getPosition().y).append(e.getEntityDiv());
            }else{
                return console.error("Entity not spawned yet!");
            }
        }else{
            return console.error("Invalid target!" + e instanceof "Entity");
        }

    }
}