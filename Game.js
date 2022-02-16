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

        $(this.moveBtn).click((e) => {
            const selectedDiv = $('.grid-block.selectedGrid');
            const x = parseInt(selectedDiv.attr('id').split('-')[0]);
            const y = parseInt(selectedDiv.attr('id').split('-')[1]);

            if(this.isInrange(this.player, x,y) && 
                (this.player.getActionPoints().used < this.player.getActionPoints().base)){
                this.player.setUsedActionPoints(1);

                this.player.setPosition({x,y});
                this.render.updateEntity(this.player);
                this.updatePlayerStats();
                this.showGridInfo(selectedDiv);
            }
        });

        $(this.endTurnBtn).click((e) => {
            this.gameInfo.selectEnabled = false;
            this.gameInfo.isPlayerTurn = false;
            this.setTurn();
        });
        //end of listeners
    }

    toggleButton = (btn, t) => {
        (t) ? btn.removeClass('disabled') : btn.addClass('disabled');
    }

    isInrange = (e,x,y) => {
        let entityPos = e.getPosition();
        let preDefRange = [
            { x: entityPos.x-1, y: entityPos.y}, { x: entityPos.x+1, y: entityPos.y}, //x axis
            { x: entityPos.x, y: entityPos.y-1}, { x: entityPos.x, y: entityPos.y+1}, //y axis
            //diagonals
            { x: entityPos.x-1, y: entityPos.y+1}, //a
            { x: entityPos.x+1, y: entityPos.y-1}, //b
            { x: entityPos.x-1, y: entityPos.y-1}, //c
            { x: entityPos.x+1, y: entityPos.y+1}, //d
            /*
                -----------
                | a  -  b |         p - player
                | -  p  - |         a,b,c,d diagonal positions
                | c  -  d |
                -----------
            */
        ];
        
        if(preDefRange.some(el => (el.x === x && el.y === y))) {
            return true;
        }else return false;

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
        $('.grid-block').map((i,e) => $(e).removeClass('selectedGrid'));
        const div = e;
        const occupantDiv = $('#occupantInfo');

        if(!$(div).hasClass('wall')) {
            const x = parseInt($(div).attr('id').split('-')[0]);
            const y = parseInt($(div).attr('id').split('-')[1]);

            if(this.isInrange(this.player, x,y) && (this.player.getActionPoints().used < this.player.getActionPoints().base)) {
                this.showAvailableActions(e);
            }else{
                this.toggleButton(this.moveBtn, false);
                this.toggleButton(this.attckBtn, false);
            }

    
            $('#gridPos').text("X: " + x + "; Y: " + y);
        
            $(div).addClass('selectedGrid');
    
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
            this.gridInfoHolder.addClass('hidden');
        }
    }

    setTurn = () => {
        console.log(this.gameInfo.isPlayerTurn)
        let turnString = (this.gameInfo.isPlayerTurn === true) ? 
        "<span class='text-primary'>Player's turn</span>"
        :
        "<span class='text-danger'>Enemy's turn</span>";

        this.turnInfo.text("Turn " + this.gameInfo.turn + " | ");
        this.turnInfo.append(turnString);
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
        if((max / value) <= 0.5) {
            return "#ede609";
        }else if((max / value) <= 0.25) {
            return "#c91208";
        }else return "#808080";
    }


}