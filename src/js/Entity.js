export default class Entity {
    
    constructor() {
        this.baseHealth = 5;
        this.health = 5;
        this.attack = 1;
        this.isDead = false;
        this.isSpawned = false;
        this.position = {
            x: -1,
            y: -1
        };
        this.entityID = Math.floor(Math.random()*100);
        this.entityDiv = $("<div class='entity' id=" + this.entityID + "></div>");
        this.entityType = "Entity";

        this.actionPoints = {
            base: 2,
            used: 0
        };
    }
    getHealth = () => this.health;
    getbaseHealth = () => this.baseHealth;
    getAttack = () => this.attack;
    getIsDead = () => this.isDead;
    getPosition = () => this.position;
    getEntityDiv = () => this.entityDiv;
    getEntityID = () => this.entityID;
    getEntityType = () => this.entityType;
    getActionPoints = () => this.actionPoints;

    setUsedActionPoints = (amount) => {
        this.actionPoints.used += amount;
    }

    refillActionPoints = () => {
        this.actionPoints.base = 2;
        this.actionPoints.used = 0;
    }

    isEnoughAP = () => {
        return this.getActionPoints().used < this.getActionPoints().base;
    }

    setBaseHealth = (health) => {
        this.baseHealth = health;
        this.health = this.baseHealth;
    }

    setPosition = (position) => {
        this.position = position;
        return;
    }

    generatePosition = () => {
        let randomX = Math.floor((Math.random() * 11) + 1);
        let randomY = Math.floor(Math.random() * (9 - 4) + 4);

        this.position.x = randomX;
        this.position.y = randomY;
        return;
    }

    setHealth = (num) => {
        if(num <= 0) {
            this.health = 0;
            this.isDead = true;
        }else{
            this.health = num;
        }
    };

    attackEntity = (e) => {
        if(e instanceof Entity) {
            let attackerDMG = this.attack;
            e.setHealth(e.getHealth() - attackerDMG);
            
            if(e.getIsDead()) {
                return true;
            }else return false;
        }else{
            return console.error("Invalid target!");
        }
    }

    setIsSpawned = (b) => {
        this.isSpawned = b;
    }
}