export default class Entity {
    
    constructor() {
        this.health = 5;
        this.attack = 1;
        this.isDead = false;
        this.position = {
            isSpawned: false,
            x: -1,
            y: -1
        };
    }

    getHealth = () => this.health;
    getAttack = () => this.attack;
    getIsDead = () => this.isDead;
    getPosition = () => this.position;

    spawnEntity = () => {
        this.position.isSpawned = true;
        let randomX = Math.floor((Math.random() * 11) + 1);
        let randomY = Math.floor((Math.random() * 11) + 1);

        this.position.x = randomX;
        this.position.y = randomY;
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
        if(typeof e === Entity) {
            let attackerDMG = this.attack;
            e.setHealth(e.getHealth() - attackerDMG);
            return;
        }else{
            return console.error("Invalid target!");
        }
    }
}