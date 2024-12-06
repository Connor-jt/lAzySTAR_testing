

const rows = 16
const cols = 16

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

// commence pathfind
function run_pathfind(){
    let beg_pos = [     1, rows/2]
    let end_pos = [cols-2, rows/2]

    // function path_recurse(){

    // }

    get_tile(beg_pos).div.style.backgroundColor = 'green';
    get_tile(end_pos).div.style.backgroundColor = 'red';
}


let container = document.getElementById("container");
makeRows();
run_pathfind();