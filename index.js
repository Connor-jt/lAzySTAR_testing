

const rows = 16
const cols = 16

const beg_pos = [     1, rows/2]
const end_pos = [cols-2, rows/2]

tile_dict = {}
// struct:
// tile {
//      div: null
//      cost: 0
//      dbg_dist: 0
//      dbg_times_accessed: 0
//      dbg_deviance: 0
// }


function makeRows() {
    container.style.setProperty('--grid-rows', rows); // row = Y
    container.style.setProperty('--grid-cols', cols); // col = X
    for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
            let cell = document.createElement("div");
            cell.innerText = ((r*rows) + c);

            let id = "" + c + "," + r;
            cell.setAttribute("coords", id);
            cell.onclick = click_node;

            container.appendChild(cell).className = "grid-item";
            tile_dict[id] = {div: cell, cost: 0};
        }
    }
}

function click_node(event){
    let sender = event.srcElement;
    let coords = sender.getAttribute("coords");
    let entry = tile_dict[coords];
    entry.cost += 1
    // cap out at 5 cost
    if (entry.cost >= 5) entry.cost = 0;
    // then recalc
    run_pathfind();
}
function get_tile(pos_arr){
    let str_id = "" + pos_arr[0] + "," + pos_arr[1];
    return tile_dict[str_id]
}
function get_tile2(x, y){
    let str_id = "" + x + "," + y;
    return tile_dict[str_id]
}

function tiles_dist(origin_arr, dest_arr){
    return (dest_arr[0] - origin_arr[0]) + (dest_arr[1] - origin_arr[1]);
}


let curr_node_value = 9999;
let next_tiles = []
function root_pathfind(x,y, step_count){

    step_count += 1;
    // create all neighbor nodes
    let pos1 = {pos:[x+1,y], dist:tiles_dist([x+1,y] + step_count, end_pos), steps:step_count  };
    let pos2 = {pos:[x-1,y], dist:tiles_dist([x-1,y] + step_count, end_pos), steps:step_count  };
    let pos3 = {pos:[x,y+1], dist:tiles_dist([x,y+1] + step_count, end_pos), steps:step_count  };
    let pos4 = {pos:[x,y-1], dist:tiles_dist([x,y-1] + step_count, end_pos), steps:step_count  };

    // get tile cost and add that to the step_count
    // sort
    if (pos1.dist > pos2.dist){ let a = pos1; pos1 = pos2; pos2 = a; }
    if (pos3.dist > pos4.dist){ let a = pos3; pos3 = pos4; pos4 = a; }
    if (pos1.dist > pos3.dist){ let a = pos1; pos1 = pos3; pos3 = a; }
    if (pos2.dist > pos4.dist){ let a = pos2; pos2 = pos4; pos4 = a; }
    if (pos2.dist > pos3.dist){ let a = pos2; pos2 = pos3; pos3 = a; }

    // config iteration values
    curr_node_value = pos1.dist

    if (pos4.dist > curr_node_value)
        next_tiles.push(pos4);
    else recurse_pathfind(pos4.pos[0], pos4.pos[1]);
    if (pos3.dist > curr_node_value)
        next_tiles.push(pos3)
    if (pos2.dist > curr_node_value)
        next_tiles.push(pos2)
    

    recurse_pathfind()

    
    let lowest_dist = c1_dist


    // check direction ths one came from, so we can skip checking that connection
}
function recurse_pathfind(x,y,step_count, next_best){
    
}
// commence pathfind
function run_pathfind(){
    
    root_pathfind(beg_pos[0], beg_pos[1], 0);

    // display all the tile costs via color
    for (key in tile_dict){
        let tile = tile_dict[key];
        tile.div.style.backgroundColor = '#FFFFFF';
        if (tile.cost > 0){
            tile.div.style.backgroundColor = '#C0C0C0';
            if (tile.cost > 1){
                tile.div.style.backgroundColor = '#808080';
                if (tile.cost > 2){
                    tile.div.style.backgroundColor = '#404040';
                    if (tile.cost > 3){
                        tile.div.style.backgroundColor = '#000000';
    }}}}}

    // display enter/exit tiles
    get_tile(beg_pos).div.style.backgroundColor = 'green';
    get_tile(end_pos).div.style.backgroundColor = 'red';
}


let container = document.getElementById("container");
makeRows();
run_pathfind();