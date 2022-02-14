import Render from './Render.js';
import MonsterEntity from './MonsterEntity.js';
import SkeletonEntity from './SkeletonEntity.js';

const holder = $('#gridHolder');
const mainLayer = $('#mainLayer');

const setup = () => {
    generateGrid();
    checkScreenSize();

    const renderer = new Render(holder);

    let skeleton = new SkeletonEntity();
    let monster = new MonsterEntity();
    let monster1 = new MonsterEntity();

    renderer.initRenderEntity(skeleton);
    renderer.initRenderEntity(monster);
    renderer.initRenderEntity(monster1);
}

const checkScreenSize = () => {
    if(window.innerHeight < 802 || window.innerWidth < 992) {
        mainLayer.addClass('hidden');
        showMessageBox("This game can not be used smaller than a 802x992 (HxW) screen! :(", true);
    }else{
        mainLayer.removeClass('hidden');
        showMessageBox("", false);
    }
}

const showMessageBox = (message, show) => {
    const box = $('#messageBox');
    $('#messageBody').text(message);
    if(show === true) {
        box.removeClass('hidden');
    }else{
        box.addClass('hidden');
    }
}

const showGridInfo = () => {

}

const setupWall = (gridDiv, coordX, coordY, doors) => {
    if(
        (coordX === 0 && coordY !== doors.out) || 
        (coordX === 12 && coordY !== doors.in) || 
        (coordY === 0 || coordY === 12)
    ) {
        gridDiv.addClass('wall');
    }

    return gridDiv;
}

const generateGrid = () => {
    let randomDoorLocations = {
        in: Math.floor((Math.random() * 11) + 1),
        out: Math.floor((Math.random() * 11) + 1)
    };

    for(let i = 0; i < 13; ++i) {
        for(let j = 0; j < 13; ++j) {
            let gridBlockDiv = $("<div class='grid-block'></div>");
            
            gridBlockDiv = setupWall(gridBlockDiv, i, j, randomDoorLocations);
            
            gridBlockDiv.attr('id', i+"-"+j);
            holder.append(gridBlockDiv);
        }
    }
}

setup();

$(window).resize(() => {
    checkScreenSize();
});

$('.grid-block').click((e)=> {
    $('.grid-block').map((i,e) => $(e).removeClass('selectedGrid'));
    const div = e.currentTarget;
    if(!$(div).hasClass('wall')) {
        const x = $(div).attr('id').split('-')[0];
        const y = $(div).attr('id').split('-')[1];
    
        $(div).addClass('selectedGrid');
    }
});