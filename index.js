

const rows = 16;
const cols = 16;

const beg_pos = [     1, rows/2];
const end_pos = [cols-2, rows/2];

const invalid_dist = 1000;

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

function get_tile_steps(pos_arr, curr_steps){
    // get tile from our map
    let tile = get_tile(pos_arr);

    // if tile doesn't exist on the map, then return infinite cost
    if (typeof tile == 'undefined') return invalid_dist;

    // otherwise sum the cost of this tile
    let tile_step_count = curr_steps;
    tile_step_count += 1;
    tile_step_count += tile.cost;
    return tile_step_count;
}
function create_tile_marker(pos_arr, curr_steps){
    let c = get_tile_steps(pos_arr, curr_steps);
    return {pos:pos_arr, value:tiles_dist(pos_arr, end_pos) + c, steps:c};
}

function process_neighbor(node){
    // if invalid, skip
    if (node.value >= invalid_dist) return;
    // if more expensive than next best options, skip
    if (node.value > curr_node_value) next_tiles.push(node);
    // otherwise, start checking out where it leads
    else recurse_pathfind(node.pos[0], node.pos[1], node.steps);
}

let curr_node_value = 0; // gets overwritten by root pathfind func
let next_tiles = []
function root_pathfind(x,y){

    // create all neighbor nodes
    let pos1 = create_tile_marker([x+1,y], 0);
    let pos2 = create_tile_marker([x-1,y], 0);
    let pos3 = create_tile_marker([x,y+1], 0);
    let pos4 = create_tile_marker([x,y-1], 0);

    // sort
    if (pos1.value > pos2.value){ let a=pos1; pos1 = pos2; pos2=a; }
    if (pos3.value > pos4.value){ let a=pos3; pos3 = pos4; pos4=a; }
    if (pos1.value > pos3.value){ let a=pos1; pos1 = pos3; pos3=a; }
    if (pos2.value > pos4.value){ let a=pos2; pos2 = pos4; pos4=a; }
    if (pos2.value > pos3.value){ let a=pos2; pos2 = pos3; pos3=a; }

    // config iteration values
    curr_node_value = pos1.value

    // start pathfinding from all child nodes
    process_neighbor(pos4);
    process_neighbor(pos3);
    process_neighbor(pos2);
    // shortcut bit of code for pos1, since we know for a fact its our best path
    recurse_pathfind(pos1.pos[0], pos1.pos[1], pos1.steps);

    
}
function recurse_pathfind(x,y,step_count){
    // DEBUG: mark this node that we've stepped here
    

}


// commence pathfind
function run_pathfind(){
    
    next_tiles = []; // clear
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