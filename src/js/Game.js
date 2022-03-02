import Render from "./Render.js";
import Monster from "./MonsterEntity.js";
import Skeleton from "./SkeletonEntity.js";
import PlayerEntity from "./PlayerEntity.js";

export default class Game {
    constructor() {
        this.gridHolder = $('#gridHolder');
        this.mainLayer = $('#gameLayer');
        this.menuLayer = $('#menuLayer');
        this.gridInfoHolder = $('#gridInformationHolder');
        this.turnInfo = $('#turnInfo');

        this.attckBtn = $('#attckBtn');
        this.moveBtn = $('#moveBtn');
        this.endTurnBtn = $('#endTurnBtn');

        this.render = new Render();

        let gameStart = this.resetGame();

        this.gameInfo = gameStart?.gameInfo;

        this.randomDoorLocations = gameStart?.randomDoorLocations;

        this.setTurn();

        this.updatePlayerStats();

        //listeners
        $(window).resize(() => {
            this.checkScreenSize();
        });

        $('.grid-block').click((e)=> {
            if(this.gameInfo.selectEnabled === true) {
                this.showGridInfo(e.currentTarget);
            }   
        });

        $('#actionPool button').click(async (e) => {
            switch($(e.target).attr('id')) {
                case 'moveBtn':
                    this.moveAction();
                    break;
                case 'attckBtn':
                    await this.attackAction();
                    break;
                case 'endTurnBtn':
                    this.endTurn();
                    break;
            }

            if(!this.player.isEnoughAP()) {
               this.endTurn();
              
            }
        })
        //end of listeners
    }

    static isGameReady = () => {
        return this.checkScreenSize(false,true);
    }

    resetGame = () => {
        let randomDoorLocations = {
            in: Math.floor((Math.random() * 11) + 1),
            out: Math.floor((Math.random() * 11) + 1)
        };

        this.toggleButton(this.attckBtn, false);
        this.toggleButton(this.moveBtn, false);

        this.render.removeAllEntity();

        this.gridInfoHolder.addClass('hidden');

        this.generateGrid(randomDoorLocations);

        let numberOfEnemies =  Math.floor(Math.random() * 5 + 1);
        this.setupEnemies(numberOfEnemies);

        this.player = new PlayerEntity(randomDoorLocations.in);
        this.render.renderEntity(this.player);

        this.mainLayer.removeClass('hidden');
        this.menuLayer.addClass('hidden');

        return {
            gameInfo: {
                turn: 1,
                isPlayerTurn: true,
                selectEnabled: true,
                endOfTheGame: false,
                totalKills: 0
            },
            randomDoorLocations
        }
    }

    moveAction = () => {
        const selectedDiv = $('.grid-block.selectedGrid');
        const x = parseInt(selectedDiv.attr('id').split('-')[0]);
        const y = parseInt(selectedDiv.attr('id').split('-')[1]);
        if(this.player.isEnoughAP()) {
            this.moveEntity(this.player,x,y);
            this.updatePlayerStats();
            this.showGridInfo(selectedDiv);
            if(x === this.randomDoorLocations.out && y === 12) {
                this.gameInfo.endOfTheGame = true;
                this.endGame(true);
            }
        }
    }

    attackAction = async () => {
        await this.attackEntity(this.player);
    }

    attackEntity = async (e) => {
        const selectedDiv = $('.grid-block.selectedGrid');
        const x = parseInt(selectedDiv.attr('id').split('-')[0]);
        const y = parseInt(selectedDiv.attr('id').split('-')[1]);
        if(e.isEnoughAP() && this.render.isGridOccupied(x,y)) {
            const entityID = parseInt($(selectedDiv).children().attr('id'));
            const entity = this.render.getEntityByID(entityID);

            let isDead = e.attackEntity(entity);
            e.setUsedActionPoints(1);
            await this.showAttackDMG(x,y,e.getAttack());
            if(isDead) {
                this.render.removeEntity(entity);
                if(entity instanceof PlayerEntity) {
                    this.gameInfo.endOfTheGame = true;
                    this.endTurn();
                    this.endGame(false);
                }else{
                    this.gameInfo.totalKills =+ 1;
                }
            }
            if(e instanceof PlayerEntity) {
                this.showGridInfo(selectedDiv);
            }
            this.updatePlayerStats();
        }
    }

    endGame = (win) => {
        localStorage.setItem('status', win);
        localStorage.setItem('kills', this.gameInfo.totalKills);
        
        window.location.href = window.location.href;

        this.mainLayer.addClass('hidden');
        this.menuLayer.removeClass('hidden');

        this.render.removeAllEntity();
    }

    toggleButton = (btn, t) => {
        (t) ? btn.removeClass('disabled').removeAttr('disabled') : btn.addClass('disabled').attr('disabled', '1');
    }

    showAttackDMG = async (x,y,amount) => {
        let info = `<span class='text-danger text-center'> -${amount}</span>`;
        const targetDiv = $(`.grid-block#${x}-${y} > div.entity`);
        targetDiv.append(info);
        await this.wait(500);
        $(targetDiv).children().remove();
    }

    defineRange = (x,y,range, includeDoor=false) => {
        let rangeArray = [];
        let current = {
            x: 0,
            y: 0
        };
        let direction = 1; // 1-right, 2-down, 3-left, 4-up
        let i = 0;

        while(rangeArray.length < (8*range)) {
            if(i === 0) {
                current.x = x,
                current.y = y+(1*range);

                rangeArray.push({x: current.x, y: current.y});
                i++;
            }
            let endX;
            let endY;
           
            switch(direction) {
                case 1:
                    endX = current.x+range;
                    while(current.x !== endX) {
                        current.x++;
                        rangeArray.push({x: current.x, y: current.y});
                    }
                    direction++;
                    break;
                case 2:
                   
                    endY = current.y-(range*2);
                    while(current.y !== endY) {
                        current.y--;
                        rangeArray.push({x: current.x, y: current.y});
                    }
                    direction++;
                    break;
                case 3:
                    endX = current.x-(range*2);
                    while(current.x !== endX) {
                        current.x--;
                        rangeArray.push({x: current.x, y: current.y});
                    }
                    direction++;
                    break;
                case 4:
                    endY = current.y+(range*2);
                    while(current.y !== endY) {
                        current.y++;
                        rangeArray.push({x: current.x, y: current.y});
                    }
                    direction = 1;
                    break;
            }
        }

        //rangeArray.pop(); //duplicate of the first one

        let returnArray = [];
        rangeArray.forEach((e,i) => {
            if((e.x >= 1 && e.y >= 1) && (e.x <= 11 && e.y <= 11) || (includeDoor === true && this.isDoor(e.x,e.y))) {
                if(!this.isWall(e.x,e.y)) {
                    returnArray.push(e);
                    //this.setGridColor(e.x, e.y, 'red');     
                };
            }
        });
        return returnArray;
    }

    getClosestCoordFromPositions = (rangePool, x, y) => {
        let smallest = {pos: null, len: null};

        for(let pos of rangePool) {
            let vector = { x: (x-pos.x), y: (y-pos.y) };
            let length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
            
            if(smallest.pos === null && smallest.len === null) {
                smallest.pos = pos;
                smallest.len = length;
            }

            if(smallest.len > length && !this.render.isGridOccupied(pos.x,pos.y)) {

                smallest.len = length;
                smallest.pos = pos;
            }


        }
        return smallest;
        /* 
            Loop through every move range and calculate the length to the player, the smallest value will be the closest gridpoint
            that will be the destination to the enemy to move;
            two coords vector = (end.x-start.x;end.y-start.y)
            v.length = sqrt(v1^2 + v2^2)
        */
    }

    isInRange = (e,x,y, rangeMultiplier=null) => {
        let entityPos = e.getPosition();
        let range = 1;
        if(rangeMultiplier !== null && parseInt(rangeMultiplier)) {
            range = range * rangeMultiplier;
        }

        let preDefRange = this.defineRange(entityPos.x, entityPos.y, range, true);

        if(preDefRange.some(el => (el.x === x && el.y === y))) {
            return true;
        }else return false;
    }

    isPlayerInVisionRange = (e) => {
        let playerPos = this.player.getPosition();
        if(this.isInRange(e, playerPos.x, playerPos.y, 2)) {
            return true;
        }
        return false;
    }

    isWall = (x,y) => {
        let div = $('.grid-block#' + x + '-' + y);
        return div.hasClass('wall');
    }

    isDoor = (x,y) => {
        let div = $('.grid-block#' + x + '-' + y);
        return div.hasClass('door');
    }

    wait = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    enemyTurn = async () => {
        let entities = this.render.getRenderedEntities();
        for(let e of entities) {
            if(!(e instanceof PlayerEntity) && e !== null) {
                while(e !== null && e?.isEnoughAP() ) {
                    console.info(e.getEntityID() + " entity turning: ");

                    let entityPos = e.getPosition();
                    let validPositions = this.defineRange(entityPos.x, entityPos.y,1);

                    if(this.isInRange(e, this.player.getPosition().x, this.player.getPosition().y) && !this.player.isDead && e !== null) {
                        this.setGridColor(entityPos.x, entityPos.y, 'red');
                        console.info("Player in range to attack - attacking...");

                        await this.wait(500);

                        this.setSelectGrid(this.player.getPosition().x, this.player.getPosition().y);

                        await this.wait(200);
                        this.attackEntity(e);

                        this.setGridColor(entityPos.x, entityPos.y, -1); 
                        this.setSelectGrid(-1,-1);

                        this.setGridColor(entityPos.x, entityPos.y, -1); 

                    }else if (this.isPlayerInVisionRange(e) && !this.player.isDead) {
                       
                        this.setGridColor(entityPos.x, entityPos.y, 'red');
                        let shortestRoute = this.getClosestCoordFromPositions(validPositions, this.player.getPosition().x, this.player.getPosition().y);
                        console.info(`Player detected... moving `+`
                            towards selected pos from ${e.getPosition().x,e.getPosition().y} to ${ shortestRoute.pos.x, shortestRoute.pos.y}`);
                        await this.wait(500);

                        this.setSelectGrid(shortestRoute.pos.x, shortestRoute.pos.y);

                        await this.wait(200);
                        this.setGridColor(entityPos.x, entityPos.y, -1); 
                        this.moveEntity(e, shortestRoute.pos.x, shortestRoute.pos.y);
                        this.setSelectGrid(-1,-1);

                        this.setGridColor(entityPos.x, entityPos.y, -1); 
                    }else{
                        this.setGridColor(entityPos.x, entityPos.y, 'yellow');
                        let randomPos = await this.generateRandomPos(validPositions);

                        console.info(`Player not detected... moving to random position`+` 
                            from [${e.getPosition().x}, ${e.getPosition().y}] to [${ randomPos.x},${ randomPos.y}]`);
    
                        await this.wait(500);
    
                        this.setSelectGrid(randomPos.x, randomPos.y);
    
                        await this.wait(200);
                        this.setGridColor(entityPos.x, entityPos.y, -1); 
                        this.moveEntity(e, randomPos.x, randomPos.y);
                        this.setSelectGrid(-1,-1);
                   }
                    await this.wait(1000); 
                }
            }
        }

        this.endTurn();
    }

    refillEnemyAP = () => {
        const entities = this.render.getRenderedEntities();
        for(let e of entities) {
            if(!(e instanceof PlayerEntity) && e !== null) {
                e.refillActionPoints();
            }
        }
    }
    generateRandomPos = async (rangePool) => {
        let pos = null;
        while(pos === null) {
            let randomNum = Math.floor(Math.random() * rangePool.length);
            if(!this.render.isGridOccupied(rangePool[randomNum].x, rangePool[randomNum].y)){
                pos = rangePool[randomNum];
            }else{
                console.error(rangePool[randomNum], " is occupied by entity!");
            }
        }
        return pos;
    }

    setSelectGrid = (x,y) => {
        if(x === -1 && y === -1) {
            $('.grid-block').map((i,e) => $(e).removeClass('selectedGrid'));
            return;
        }

        if(!this.isWall(x,y)) {
            $('.grid-block').map((i,e) => $(e).removeClass('selectedGrid'));
            let div = $('.grid-block#' + x + '-' + y);
            div.addClass('selectedGrid');
        } 
    }

    setGridColor = (x,y,color) => {
        let div = $('.grid-block#' + x + '-' + y);
        if(color === -1) {
            div.css('background-color', 'transparent');
            return;
        }

        div.css('background-color', this.getColor(color));
    }

    getColor = (string) => {
        switch(string) {
            case 'red':
                return '#6e120d';
            case 'yellow':
                return '#c2bc02';
            case 'grey':
                return '#808080';
            case 'primary':
                return '#0d6efd';
            default:
                return 'transparent';
        }
    }

    generateGrid = (doors) => {
        this.gridHolder.children().remove();  
        for(let y = 12; y >= 0; --y) {
            for(let x = 0; x < 13; ++x) {
                let gridBlockDiv = $("<div class='grid-block'></div>");
                
                gridBlockDiv = this.setupWall(gridBlockDiv, x, y, doors);
                
                gridBlockDiv.attr('id', x+"-"+y);
                if((y === 0 && x === doors.in) || (y === 12 && x === doors.out)) {
                    gridBlockDiv.addClass('door');
                }
                this.gridHolder.append(gridBlockDiv);
            }
        }
    }

    setupWall = (gridDiv, coordX, coordY, doors) => {
        if(
            (coordY === 0 && coordX !== doors.in) || 
            (coordY === 12 && coordX !== doors.out) || 
            (coordX === 0 || coordX === 12)
        ) {
            gridDiv.addClass('wall');
        }
    
        return gridDiv;
    }

    static checkScreenSize = (needErrorMessage=true,force=false) => {
        if(this?.gameInfo?.endOfTheGame === false || force) {
            if(window.innerHeight < 802 || window.innerWidth < 992) {

                if(needErrorMessage) this.showMessageBox("This game can not be used smaller than a 802x992 (HxW) screen! :(", true);
                return false;
            }else{
                this.showMessageBox("", false);
                return true;
            }
        }
    }

    static showMessageBox = (message, show) => {
        const holder = $('#messageHolder');
        const box = $('#messageBox');
        $('#messageBody').text(message);
        if(show === true) {
            holder.removeClass('hidden');
            box.removeClass('hidden');
        }else{
            holder.addClass('hidden');
            box.addClass('hidden');
        }
    }

    showGridInfo = (e) => {
        const occupantDiv = $('#occupantInfo');
        if(e !== null) {
            const div = e;
    
            if(!$(div).hasClass('wall')) {
                const x = parseInt($(div).attr('id').split('-')[0]);
                const y = parseInt($(div).attr('id').split('-')[1]);
    
                if(this.isInRange(this.player, x,y) && this.player.isEnoughAP()) {
                    this.showAvailableActions(e);
                }else{
                    this.toggleButton(this.moveBtn, false);
                    this.toggleButton(this.attckBtn, false);
                }
    
        
                $('#gridPos').text("Grid: X: " + x + "; Y: " + y);
            
                this.setSelectGrid(x,y);
        
                this.gridInfoHolder.removeClass('hidden');
                occupantDiv.text("");
    
                if($(e).children().hasClass('entity')) {
                    const entityID = parseInt($(e).children().attr('id'));
        
                    const entityData = this.render.getEntityByID(entityID);
                    let actionPts = {
                        used: entityData.getActionPoints().used,
                        max: entityData.getActionPoints().base
                    }
                    let occupantInfoString = `
                        <p><b>${entityData.getEntityType()}(${entityData.getEntityID()})</b>.</p>
                        <p>Health: ${entityData.getHealth()} / ${entityData.getbaseHealth()}</p>
                        <p>Attack DMG: ${entityData.getAttack()}</p>
                        <p>AP: ${actionPts.max - actionPts.used}</p>
                    `;
                    occupantDiv.append(occupantInfoString);
                }else {
                    occupantDiv.text("");
                }
            }else{
                this.toggleButton(this.moveBtn, false);
                this.toggleButton(this.attckBtn, false);
                this.gridInfoHolder.addClass('hidden');
            }
        }else{
            this.gridInfoHolder.removeClass('hidden');
            occupantDiv.text("");
            $('#gridPos').text("");
        }
    }

    setTurn = () => {
        let turnString = (this.gameInfo.isPlayerTurn === true) ? 
        "<span class='text-primary'>Player's turn</span>"
        :
        "<span class='text-danger'>Enemy's turn</span>";

        this.turnInfo.text("Turn " + this.gameInfo.turn + " | ");
        this.turnInfo.append(turnString);
    }

    endTurn = () => {
        if(this.gameInfo.endOfTheGame === false) {
            this.gameInfo.selectEnabled = !this.gameInfo.selectEnabled;
            this.gameInfo.isPlayerTurn = !this.gameInfo.isPlayerTurn;
            console.info("Turn changed!");
            this.setSelectGrid(-1,-1);
            this.setTurn();

            if(this.gameInfo.isPlayerTurn === false) {
                this.toggleButton(this.attckBtn, false);
                this.toggleButton(this.moveBtn, false);
                this.toggleButton(this.endTurnBtn, false);
                this.showGridInfo(null);
                this.enemyTurn();
                this.gameInfo.turn++;
            }else{
                this.refillEnemyAP();
                this.player.refillActionPoints();
                this.toggleButton(this.endTurnBtn, true);
                this.updatePlayerStats();
            }
        }
    }

    moveEntity = (e, x, y) => {
        if(this.isInRange(e,x,y)){
          
            e.setPosition({x,y});
            if(!this.render.updateEntity(e)){
                return false;
            }
            e.setUsedActionPoints(1);
        }
    }

    spawnEnemy = (type) => {
        let entity = (type === 0) ? new Skeleton() : new Monster();
        this.render.initRenderEntity(entity);
        entity.setIsSpawned(true);
    }

    setupEnemies = (num) => {
        for(let i = 0; i <= num; ++i) {
            const type = Math.floor(Math.random() * 2);
            
            this.spawnEnemy(type);
            
        }
    }
    
    showAvailableActions = (e) => {
        if($(e).children().hasClass('entity')) {
            this.toggleButton(this.moveBtn, false);
            this.toggleButton(this.attckBtn, true);
        }else{
            this.toggleButton(this.attckBtn, false);
            this.toggleButton(this.moveBtn, true);
        }
    }

    updatePlayerStats = () => {
        const playerInfoHolder = $('#playerStat');
        playerInfoHolder.text("");
        let health = {
            val: this.player.getHealth(),
            max: this.player.getbaseHealth()
        }
        let actionPts = {
            used: this.player.getActionPoints().used,
            max: this.player.getActionPoints().base
        }

        let playerStatsString = `
            <p class="me-2" style="color: ${this.colorBasedOnValue(health.val, health.max)}">
                <img src='./images/health.png' style='width: 50px' >
                Health: ${health.val} / ${health.max}
            </p>
            
            <p class="ms-2 me-2">
                <img src='./images/sword.png' style='width: 30px' >
                Attack DMG: ${this.player.getAttack()}
            </p>

            <p class="ms-2 me-2" style="color: ${this.colorBasedOnValue(actionPts.max - actionPts.used, actionPts.max)}">
                <img src='./images/stamina.png' style='width: 25px' >
                Action Points(AP):
                ${actionPts.max - actionPts.used}
            </p>
        `;

        playerInfoHolder.append(playerStatsString);
    }

    colorBasedOnValue = (value, max) => {
        if((value / max) <= 0.25) {
            return this.getColor('red');
        }else if((value / max) <= 0.5) {
            return this.getColor('yellow');
        }else return this.getColor('grey');
    }


}