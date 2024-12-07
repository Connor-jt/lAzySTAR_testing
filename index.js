

const rows = 16;
const cols = 16;

const beg_pos = [     1, rows/2];
const end_pos = [cols-2, rows/2];

const invalid_dist = 1000;

tile_dict = {}
// {
//      div: null
//      cost: 0
//      dbg_dist: 0
//      dbg_times_accessed: 0
//      dbg_deviance: 0
// }

/////////////////// ---------------------------------------------------------
// UI GENREATION //
/////////////////// 
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
                tile_dict[id] = {div: cell, cost: 0, dbg_times_accessed: 0};
            }
        }
    }
// ------------------------------------------------------------------------------

//////////////////// ---------------------------------------------------------
// UI INTERACTION //
//////////////////// 
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
// ------------------------------------------------------------------------------

////////////////////// ---------------------------------------------------------
// TILE INTERFACING //
////////////////////// 
    function get_tile(pos_arr){
        let str_id = "" + pos_arr[0] + "," + pos_arr[1];
        return tile_dict[str_id]
    }
    function get_tile2(x, y){
        let str_id = "" + x + "," + y;
        return tile_dict[str_id];
    }
// ------------------------------------------------------------------------------

//////////////////////// -----------------------------------------------------------
// HEAT MAPPING STUFF //
////////////////////////
    function componentToHex(c) { var h = c.toString(16); return h.length == 1 ? "0" + h : h; }
    function rgbToHex(r, g, b) { return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b); }
    function create_heatmap_hex(value, max){
        const heatmax = 1792
        let heat_value = Math.trunc((value / max) * heatmax);
        let heat_step_value = Math.trunc(heat_value % 256);
        let inverse_heat_step_value = Math.trunc(255 - heat_step_value);
        if (heat_value <  256) return rgbToHex(0, 0, heat_step_value);           // blue
        if (heat_value <  512) return rgbToHex(0, heat_step_value, 255);         // greenish
        if (heat_value <  768) return rgbToHex(0, 255, inverse_heat_step_value); // green
        if (heat_value < 1024) return rgbToHex(heat_step_value, 255, 0);         // yellow
        if (heat_value < 1280) return rgbToHex(255, inverse_heat_step_value, 0); // red
        if (heat_value < 1536) return rgbToHex(255, 0, heat_step_value);         // pink
        if (heat_value < 1792) return rgbToHex(255, heat_step_value, 255);       // white
        // this runs for the highest value
        return "#FFFFFF";
    }
    function invert_hexcode(tile_color){
        let hex1 = parseInt(tile_color.substring(1, 3), 16);
        let hex2 = parseInt(tile_color.substring(3, 5), 16);
        let hex3 = parseInt(tile_color.substring(5, 7), 16);
        return rgbToHex( 255-hex1, 255-hex2, 255-hex3);
    }
    
    function polar_invert_hexcode(tile_color){
        let hex1 = parseInt(tile_color.substring(1, 3), 16);
        let hex2 = parseInt(tile_color.substring(3, 5), 16);
        let hex3 = parseInt(tile_color.substring(5, 7), 16);
        let result_hex = "#FFFFFF";
        if (hex1 > 196 || hex2 > 196 || hex3 > 196)
            result_hex = "#000000";
        return result_hex;
    }
// ------------------------------------------------------------------------------


function tiles_dist(origin_arr, dest_arr){
    let x_diff = Math.abs(dest_arr[0] - origin_arr[0]);
    let y_diff = Math.abs(dest_arr[1] - origin_arr[1]);
    let total_diff = x_diff + y_diff;
    return total_diff;
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



function create_tile_marker(pos_arr, curr_steps, dir){
    let c = get_tile_steps(pos_arr, curr_steps);
    return {pos:pos_arr, value:tiles_dist(pos_arr, end_pos) + c, steps:c, src_dir:dir};
}

function process_neighbor(node){
    // if invalid, skip
    if (node.value >= invalid_dist) return;
    // if more expensive than next best options, skip
    if (node.value > curr_node_value) next_tiles.push(node);
    // otherwise, start checking out where it leads
    else recurse_pathfind(node.pos[0], node.pos[1], node.steps, node.src_dir);
}



let curr_node_value = 0; // gets overwritten by root pathfind func
let next_tiles = []

function recurse_pathfind(x,y,step_count, src_direction){ // this takes everything except the tile value?
    // check if this is the destination??
    if (x === end_pos[0] && y === end_pos[1]){
        // TODO: route found
        let route = "found";
    }
    // DEBUG: mark this node that we've stepped here
        let test = get_tile2(x,y);
        if (test != null){
            test.dbg_times_accessed += 1;
        }

    // create the 3 neighbor nodes, skipping the node that we came from
    let pos1 = null;
    let pos2 = null;
    let pos3 = null;
    if        (src_direction === 0){ // skip x-1
        pos1 = create_tile_marker([x+1,y], step_count, 0);
        pos2 = create_tile_marker([x,y+1], step_count, 2);
        pos3 = create_tile_marker([x,y-1], step_count, 3);
    } else if (src_direction === 1){ // skip x+1
        pos1 = create_tile_marker([x-1,y], step_count, 1);
        pos2 = create_tile_marker([x,y+1], step_count, 2);
        pos3 = create_tile_marker([x,y-1], step_count, 3);
    } else if (src_direction === 2){ // skip y-1
        pos1 = create_tile_marker([x+1,y], step_count, 0);
        pos2 = create_tile_marker([x-1,y], step_count, 1);
        pos3 = create_tile_marker([x,y+1], step_count, 2);
    } else if (src_direction === 3){ // skip y+1
        pos1 = create_tile_marker([x+1,y], step_count, 0);
        pos2 = create_tile_marker([x-1,y], step_count, 1);
        pos3 = create_tile_marker([x,y-1], step_count, 3);
    }

    // sort
    if (pos1.value > pos2.value){ let a=pos1; pos1 = pos2; pos2=a; }
    if (pos2.value > pos3.value){ let a=pos2; pos2 = pos3; pos3=a; }
    if (pos1.value > pos2.value){ let a=pos1; pos1 = pos2; pos2=a; }

    // pathfind from all neighbors
    process_neighbor(pos3);
    process_neighbor(pos2);
    process_neighbor(pos1);

}



function root_pathfind(x,y){

    // create all neighbor nodes
    let pos1 = create_tile_marker([x+1,y], 0, 0); // x-1
    let pos2 = create_tile_marker([x-1,y], 0, 1); // x+1
    let pos3 = create_tile_marker([x,y+1], 0, 2); // y-1
    let pos4 = create_tile_marker([x,y-1], 0, 3); // y+1

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
    recurse_pathfind(pos1.pos[0], pos1.pos[1], pos1.steps, pos1.src_dir);

    // we have to then loop through all the ones we deemed as too expensive to try
}


// commence pathfind
function run_pathfind(){
    
    next_tiles = []; // clear all queued tile checks
    // reset per tile data
    for (let key in tile_dict){
        let tile = tile_dict[key];
        tile.dbg_times_accessed = 0;
    }

    root_pathfind(beg_pos[0], beg_pos[1], 0);

    // display all the tile costs via border color
    for (key in tile_dict){
        let tile = tile_dict[key];
        tile.div.style.borderColor = '#FFFFFF';
        if (tile.cost > 0){
            tile.div.style.borderColor = '#C0C0C0';
            if (tile.cost > 1){
                tile.div.style.borderColor = '#808080';
                if (tile.cost > 2){
                    tile.div.style.borderColor = '#404040';
                    if (tile.cost > 3){
                        tile.div.style.borderColor = '#000000';
    }}}}}

    // get the highest access value
    let highest_access_count = 1;
    for (let key in tile_dict){
        let tile = tile_dict[key];
        if (tile.dbg_times_accessed > highest_access_count)
            highest_access_count = tile.dbg_times_accessed;
    }

    // update tile visuals
    for (let key in tile_dict){
        let tile = tile_dict[key];
        tile.div.innerText = tile.dbg_times_accessed;
        let tile_color = create_heatmap_hex(tile.dbg_times_accessed, highest_access_count);
        tile.div.style.backgroundColor = tile_color;
        // we need to invert the text color
        tile.div.style.color = polar_invert_hexcode(tile_color);
    }

    // display enter/exit tiles
    get_tile(beg_pos).div.style.backgroundColor = 'green';
    get_tile(end_pos).div.style.backgroundColor = 'red';
}


let container = document.getElementById("container");
makeRows();
run_pathfind();