import Render from "./Render.js";
import Monster from "./MonsterEntity.js";
import Skeleton from "./SkeletonEntity.js";
import PlayerEntity from "./PlayerEntity.js";

export default class Game {
    constructor() {
        this.gridHolder = $('#gridHolder');
        this.mainLayer = $('#mainLayer');
        this.gridInfoHolder = $('#gridInformationHolder');
        this.turnInfo = $('#turnInfo');

        this.attckBtn = $('#attckBtn');
        this.moveBtn = $('#moveBtn');
        this.endTurnBtn = $('#endTurnBtn');

        this.toggleButton(this.attckBtn, false);
        this.toggleButton(this.moveBtn, false);

        this.gameInfo = {
            turn: 1,
            isPlayerTurn: true,
            selectEnabled: true
        };
        this.randomDoorLocations = {
            in: Math.floor((Math.random() * 11) + 1),
            out: Math.floor((Math.random() * 11) + 1)
        };

        this.render = new Render();

        this.gridInfoHolder.addClass('hidden');

        this.generateGrid();

        this.numberOfEnemies = Math.floor(Math.random() * 5 + 1);

        this.setupEnemies(this.numberOfEnemies);

        this.player = new PlayerEntity(this.randomDoorLocations.in);
        this.render.renderEntity(this.player);

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

        $('#actionPool button').click(e => {
            switch($(e.target).attr('id')) {
                case 'moveBtn':
                    this.moveAction();
                    break;
                case 'attckBtn':
                    
                    break;
                case 'endTurnBtn':
                    this.endTurn();
                    break;
            }

            if(!this.isEnoughAP(this.player)) {
               this.endTurn();
              
            }
        })
        //end of listeners
    }

    moveAction = () => {
        const selectedDiv = $('.grid-block.selectedGrid');
        const x = parseInt(selectedDiv.attr('id').split('-')[0]);
        const y = parseInt(selectedDiv.attr('id').split('-')[1]);
        if(this.isEnoughAP(this.player)) {
            this.moveEntity(this.player,x,y);
            this.updatePlayerStats();
            this.showGridInfo(selectedDiv);
        }
    }

    toggleButton = (btn, t) => {
        (t) ? btn.removeClass('disabled').removeAttr('disabled') : btn.addClass('disabled').attr('disabled', '1');
    }

    defineRange = (x,y,range) => {
       let rangeArray = [
            { x: x-range, y: y}, { x: x+range, y: y}, //x axis
            { x: x, y: y-range}, { x: x, y: y+range}, //y axis
            //diagonals
            { x: x-range, y: y+range}, //a
            { x: x+range, y: y-range}, //b
            { x:x-range, y: y-range}, //c
            { x: x+range, y: y+range}, //d
            /*
                -----------
                | a  -  b |         p - central
                | -  p  - |         a,b,c,d diagonal positions
                | c  -  d |
                -----------
            */
        ];
        let returnArray = [];
        rangeArray.forEach((e,i) => {
            if(!this.isWall(e.x,e.y)) {
                returnArray.push(e);
            }
        });

        return returnArray;
    }

    isInRange = (e,x,y, rangeMultiplier=null) => {
        let entityPos = e.getPosition();
        let range = 1;
        if(rangeMultiplier !== null && parseInt(rangeMultiplier)) {
            range = range * rangeMultiplier;
        }

        let preDefRange = this.defineRange(entityPos.x, entityPos.y, range);

        if(preDefRange.some(el => (el.x === x && el.y === y))) {
            return true;
        }else return false;
    }

    isPlayerInVisionRange = (e) => {
        let playerPos = this.player.getPosition();

        if(this.isInRange(e, playerPos.x, playerPos.y) || this.isInRange(e, playerPos.x, playerPos.y, 2)) {
            return true;
        }
        return false;
    }

    isWall = (x,y) => {
        let div = $('.grid-block#' + x + '-' + y);
        return div.hasClass('wall');
    }

    wait = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    enemyTurn = async () => {
        let entities = this.render.getRenderedEntities();
        for(let e of entities) {
            if(!(e instanceof PlayerEntity)) {
                let entityPos = e.getPosition();
                this.setGridColor(entityPos.x, entityPos.y, '#6e120d');
                if(this.isPlayerInVisionRange(e)) {
                    //player fele lepkedunk
                }else{
                    let randomPos = this.generateRandomPos(this.defineRange(entityPos.x, entityPos.y,1));
                    console.log(e.getEntityID(), randomPos);

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

    generateRandomPos = (rangePool) => {
        let pos = null;
        while(pos === null) {
            let randomNum = Math.floor(Math.random() * rangePool.length);
            if(!this.render.isGridOccupied(rangePool[randomNum].x, rangePool[randomNum].x)){
                pos = rangePool[randomNum];
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

        div.css('background-color', color);
    }

    generateGrid = () => {    
        for(let i = 0; i < 13; ++i) {
            for(let j = 0; j < 13; ++j) {
                let gridBlockDiv = $("<div class='grid-block'></div>");
                
                gridBlockDiv = this.setupWall(gridBlockDiv, i, j, this.randomDoorLocations);
                
                gridBlockDiv.attr('id', i+"-"+j);
                this.gridHolder.append(gridBlockDiv);
            }
        }
    }

    setupWall = (gridDiv, coordX, coordY, doors) => {
        if(
            (coordX === 0 && coordY !== doors.out) || 
            (coordX === 12 && coordY !== doors.in) || 
            (coordY === 0 || coordY === 12)
        ) {
            gridDiv.addClass('wall');
        }
    
        return gridDiv;
    }

    checkScreenSize = () => {
        if(window.innerHeight < 802 || window.innerWidth < 992) {
            this.mainLayer.addClass('hidden');
            this.showMessageBox("This game can not be used smaller than a 802x992 (HxW) screen! :(", true);
        }else{
            this.mainLayer.removeClass('hidden');
            this.showMessageBox("", false);
        }
    }

    showMessageBox = (message, show) => {
        const box = $('#messageBox');
        $('#messageBody').text(message);
        if(show === true) {
            box.removeClass('hidden');
        }else{
            box.addClass('hidden');
        }
    }

    showGridInfo = (e) => {
        const div = e;
        const occupantDiv = $('#occupantInfo');

        if(!$(div).hasClass('wall')) {
            const x = parseInt($(div).attr('id').split('-')[0]);
            const y = parseInt($(div).attr('id').split('-')[1]);

            if(this.isInRange(this.player, x,y) && this.isEnoughAP(this.player)) {
                this.showAvailableActions(e);
            }else{
                this.toggleButton(this.moveBtn, false);
                this.toggleButton(this.attckBtn, false);
            }

    
            $('#gridPos').text("X: " + x + "; Y: " + y);
        
            this.setSelectGrid(x,y);
    
            this.gridInfoHolder.removeClass('hidden');
            occupantDiv.text("");

            if($(e).children().hasClass('entity')) {
                const entityID = parseInt($(e).children().attr('id'));
    
                const entityData = this.render.getEntityByID(entityID);
    
                let occupantInfoString = `
                    <p>Entity: <b>${entityData.getEntityType()}(${entityData.getEntityID()})</b>.</p>
                    <p>Health: ${entityData.getHealth()} / ${entityData.getbaseHealth()}</p>
                    <p>Attack DMG: ${entityData.getAttack()}</p>
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
        this.gameInfo.selectEnabled = false;
        this.gameInfo.isPlayerTurn = false;
        this.toggleButton(this.attckBtn, false);
        this.toggleButton(this.moveBtn, false);
        this.toggleButton(this.endTurnBtn, false);
        this.setSelectGrid(-1,-1);
        this.setTurn();
        this.enemyTurn();
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
    
    isEnoughAP = (e) => {
        return e.getActionPoints().used < e.getActionPoints().base;
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
        if($(e.target).hasClass('entity')) {
            //enemy
        }else{
            this.toggleButton(this.moveBtn, true);
        }
    }

    updatePlayerStats = () => {
        const playerInfoHolder = $('#playerInfo');
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
            <p style="color: ${this.colorBasedOnValue(health.val, health.max)}">
                Health: ${health.val} / ${health.max}
            </p>
            <p>Attack DMG: ${this.player.getAttack()}</p>
            <p style="color: ${this.colorBasedOnValue(actionPts.max - actionPts.used, actionPts.max)}">
                Action Points(AP): ${actionPts.max - actionPts.used}
            </p>
        `;

        playerInfoHolder.append(playerStatsString);
    }

    colorBasedOnValue = (value, max) => {
        if((value / max) <= 0.25) {
            return "#c91208";
        }else if((value / max) <= 0.5) {
            return "#ede609";
        }else return "#808080";
    }


}