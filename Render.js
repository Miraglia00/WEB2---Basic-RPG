import Entity from "./Entity.js";

export default class Render {
    constructor(gridDiv) {
        this.grid = gridDiv;
        this.entities = [];
    }

    getRenderedEntities = () => this.entities;

    getEntityByID = (id) => {
        for(let e of this.entities) {
            if(e.getEntityID() === id) return e
        }
    }

    
    isGridOccupied = (x,y,self) => {
        if(this.entities.length !== 0) {
           for(let entity of this.entities) {
               if(entity.getPosition().x === x && entity.getPosition().y === y) {
                   if(self === entity) {
                       continue;
                   }else return true;
               }
           }
        }
        return false;
    }

    renderEntity = (e) => {
        if(e instanceof Entity) {         
            $('div.grid-block#' + e.getPosition().x + '-' + e.getPosition().y).append(e.getEntityDiv());
            if(!this.entities.includes(e)) {
                this.entities.push(e);
            }
        }else{
            return console.error("Invalid target!" + e instanceof "Entity");
        }
    }

    initRenderEntity = (e) => {
        if(e instanceof Entity) {          
            e.generatePosition();

            if(!this.isGridOccupied(e.getPosition().x,  e.getPosition().y, e)) {
                this.renderEntity(e);
            }else{
                console.error("initRendering: Grid occupied! Re-rendering entity...");
                this.initRenderEntity(e);
            }    
        }
    }

    updateEntity = (e) => {
        if(e instanceof Entity) {
            if(this.entities.includes(e)) { 
                if(this.isGridOccupied(e.getPosition().x,  e.getPosition().y, e)) {
                    console.error("updateEntity: Grid is occupied! Moving not updated!");
                    return false;
                }else{
                    $('div.entity#' + e.entityID).remove();
                    this.renderEntity(e, {x: e.getPosition().x, y: e.getPosition().y });
                    return true;
                }
            }else{
                return console.error("Entity not rendered yet!");
            }
        }else{
            return console.error("Invalid target!" + e instanceof "Entity");
        }
    }

    removeEntity = (e) => {
        if(e instanceof Entity) {
            let index = this.entities.indexOf(e);
            this.entities.splice(index, 1);
            $('div.entity#' + e.entityID).remove();

        }
    }
}