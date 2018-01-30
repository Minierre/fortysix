var gameOfLife = {
  width: 10,
  height: 10, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game
  chromo: '',
  turn: 0,

  createAndShowBoard: function () {
    // create <table> element
    var goltable = document.createElement("tbody");

    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {

    /*
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
    var self = this;
    Array.from(document.getElementsByTagName('td')).forEach(function(cell){
      var coords = self.getCoordsOfCell(cell);
      iteratorFunc(cell, coords[0], coords[1]);
    })
    // Alternative approach with for loops
    // var cell;
    // for(var i = 0; i < this.height; i++){
    //   for(var j = 0; j < this.width; j++){
    //     cell = document.getElementById(`${j}-${i}`);
    //     iteratorFunc(cell, i, j);
    //   }
    // }


  },

  // Utility functions
  getCoordsOfCell: function(cell){
    var cellId = cell.id;  // '0-0'
    var idSplit = cellId.split('-'); // ['0', '0']

    return idSplit.map(function(str){
      return parseInt(str,10);
    })

  },
  getCellStatus: function(cell){
    return cell.getAttribute('data-status');
  },
  setCellStatus: function(cell, status){
    cell.className = status;
    cell.setAttribute('data-status', status)
  },
  toggleCellStatus: function(cell){
    if (this.getCellStatus(cell) == 'dead') {
        this.setCellStatus(cell,"alive");
      } else {
        this.setCellStatus(cell,"dead");
      }
  },
  getNeighbors: function(cell){
    var neighbors = [];
    var thisCellCoords = this.getCoordsOfCell(cell);
    var cellX = thisCellCoords[0];
    var cellY = thisCellCoords[1];

    // Directly to left and right
    neighbors.push(this.selectCell(cellX-1, cellY));
    neighbors.push(this.selectCell(cellX+1, cellY));

    // Row Above
    neighbors.push(this.selectCell(cellX, cellY-1));
    neighbors.push(this.selectCell(cellX+1, cellY-1));
    neighbors.push(this.selectCell(cellX-1, cellY-1));

    // Row Below
    neighbors.push(this.selectCell(cellX, cellY+1));
    neighbors.push(this.selectCell(cellX+1, cellY+1));
    neighbors.push(this.selectCell(cellX-1, cellY+1));

    return neighbors.filter(function(neighbor){
      return neighbor !== null;
    })

  },
  getAliveNeighbors: function(cell){
    var allNeighbors = this.getNeighbors(cell);
    var gameOfLifeObj = this;
    return allNeighbors.filter(function(neighbor){
      return gameOfLifeObj.getCellStatus(neighbor) === "alive";
    })
  },
  selectCell: function(x,y){
    return document.getElementById(`${x}-${y}`);
  },

  // Game
  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "on-click" events that allow a user to click on
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white

    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board
    var gameOfLifeObj = this;

    var onCellClick = function (e) {
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?

      // how to set the style of the cell when it's clicked
      gameOfLifeObj.toggleCellStatus(this);
    };

    this.forEachCell(function(cell){
      cell.onclick = onCellClick;
    });

    // Buttons

    document.getElementById("step_btn").addEventListener('click', function(e){
      gameOfLifeObj.step();
    });
    document.getElementById("clear_btn").addEventListener('click', function(e){
      gameOfLifeObj.clearBoard();
    });
    document.getElementById("play_btn").addEventListener('click', function(e){
      gameOfLifeObj.enableAutoPlay();
    });
    document.getElementById("set_up_btn").addEventListener('click', function (e) {
      gameOfLifeObj.setUpChromosome();
    });
    document.getElementById("input").addEventListener('change', function (e) {
      gameOfLifeObj.setChromosome(e.target.value);
    });

  },

  setUpChromosome: function() {
    this.forEachCell(function (cell) {
      let i = parseInt(cell.id.split('-')[0]) + 10 * (parseInt(cell.id.split('-')[1]))
      this.setCellStatus(cell, (this.chromo[i] === '1') ? "alive":"dead");
    }.bind(this));
  },

  setChromosome: function (value) {
    this.chromo = value
    console.log(this.chromo)
  },

  step: function () {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game.
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    this.turn ++
    document.getElementById("turn").innerHTML = this.turn

    var gameOfLifeObj = this;
    var cellsToToggle = [];
    this.forEachCell(function(cell, x, y){
      var countLiveNeighbors = gameOfLifeObj.getAliveNeighbors(cell).length;

      if(gameOfLifeObj.getCellStatus(cell) === "alive"){
        if(countLiveNeighbors !== 2 && countLiveNeighbors !==3){
          cellsToToggle.push(cell);
        }
      } else {
        if(countLiveNeighbors === 3) {
          cellsToToggle.push(cell);
        }
      }
    })

    // We have taken a snapshot of everything we need to toggle, now we will apply these changes all at once for the entire board
    cellsToToggle.forEach(function(cellToToggle){
      gameOfLifeObj.toggleCellStatus(cellToToggle);
    })

  },
  clearBoard: function(){
    // var gameOfLifeObj = this;
    this.forEachCell(function(cell){
      this.setCellStatus(cell, "dead");
    }.bind(this));
    this.turn = 0
    document.getElementById("turn").innerHTML = this.turn
  },
  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    if(this.stepInterval){
      return this.stopAutoPlay();
    }
    this.stepInterval = setInterval(this.step.bind(this), 75);
  },
  stopAutoPlay: function(){
    clearInterval(this.stepInterval);
    this.stepInterval = null;
  }

};

gameOfLife.createAndShowBoard();
