
var colors = ['#ffc107', '#007bff', '#f60', '#117a8b'];

function createGameLink(game) {
  return "<a href='#' class='btn btn-primary game-button' onClick='startGame({0})'>{1}</a>"
  .format(JSON.stringify(game), game.name);
};

function createNewGameButton() {
  const button= "<button id='new-game-button' type='button'>New game ...</button>"
  return button;
};

function createInputWithDelete(id, parent) {
  const inputId = id || new Date().getTime();
  const spanId = "span-"+inputId;
  const mainDiv = "<div id='{0}-main-div'></div>".format(inputId);
  const input =
  "<input type='text' id='{0}' class='{1}' placeholder='Team name' class='team-info'>".format(inputId, 'team-field');
 const logo = "<input type='text' id='{0}-logo' class='logo-field'>"
  const button = "<button id='{0}' style='cursor:pointer'>&#x2717;</button><br/>"
      .format(spanId) ;
  if (parent) {
    parent.append(mainDiv);
    const mainDivEl = $('#'+inputId+'-main-div');
    mainDivEl.append(input);
    mainDivEl.append(logo);
    mainDivEl.append(button);
    $('#'+spanId).on('click', function() {
        $('#'+inputId+'-main-div').remove();

    }
  );
  }

}

function createGameForm() {
  const form =
      "<div id='new-game-form'>" +
      "<input type='text' id='game-name-field' placeholder='Game name'><br>"+
      "<input type='text' id='game-scores-field' placeholder='Scores'><br>"+
      "</div>" +
      "<button id='add-team-button' type='button'>Add team</button>"+
      "<button id='start-game-button' type='button'>Start game </button>";
  return form;
};

function saveTeams() {
  const gameRef = firebase.database().ref("games/");

    const teamFields = $('.team-field');
    const logoFields = $('.logo-field');
    let teams = [];
    for(let i = 0; i < teamFields.length; i++) {
      teams.push(Game.createTeam(teamFields[i].value, logoFields[i].value, colors[i%colors.length]));
    }
    const gameName = $('#game-name-field')[0].value;
    const values = $('#game-scores-field')[0].value.split(",");
    const game = new Game(gameName, teams, values);
    game.save(gameRef);
    return game;
}

function updateGame() {

}

function startGame(opt_game) {
  const gameRef = firebase.database().ref("games/");
   $('#game-list').hide();
   $('#new-game').hide();
   // First store the game details
   const game = Game.from(opt_game)|| saveTeams();
   game.show('score-board');
   $('#score-update-button').click(()=>{
     const updateValue = $('#score-value')[0].value.trim();
     const teamId = $('#team-id')[0].value;
     game.updateScore(teamId, parseInt(updateValue == "" ? 0 : updateValue),
     gameRef.child(game.getName()));
   });
   // Update scoreboard
   const scoresRef = gameRef.child(game.getName()).child("scores");
   scoresRef.on('value', (data) => {
     const scoreDict = data.val();
     for (key in scoreDict) {
       game.updateTeamScore(key, scoreDict[key])
     }
   });
   $('#points').removeClass('hide-score-entry');
   $('#points').addClass('show-score-entry');
   $('#points').addClass('form-group');
   // Add buttons for the possible Scores
   const values = game.getPointsArray();
   console.log(values);
   // For each value create a button
   for (let i = 0; i < values.length; i++) {
     const button = `<button class='score-point-button btn btn-primary' value='{0}'
        type='button' id='score-button-{0}'>{0}</button>`.format(values[i]);
     $('#point-buttons').append(button);
     $('#score-button-'+values[i]).click(()=>{
       const teamId = $('#team-id')[0].value;
       const updateValue = values[i];
       game.updateScore(teamId, parseInt(updateValue == "" ? 0 : updateValue),
       gameRef.child(game.getName()));
     });
   }
   $('#message-button').click(() => {
     const msg = $('#message-input')[0].value;
     game.updateMessage(msg, gameRef.child(game.getName()));
   });
};

function loadGames() {
  console.log("Loading games");
  const gameRef = firebase.database().ref("games/");
  Game.loadGames("game-list", gameRef, loadCallback);
};

function loadCallback(data) {
  const games = data.val();
  console.log(games);
  $('#game-list').append("<li>");
  for (key in games) {
    $('#game-list').append("<ul>" + createGameLink(games[key]) + "</ul>");
  }
  $('#game-list').append("</li>");
  $('#game-list').append(createNewGameButton());
  $('#new-game-button').click(function() {
    $('#new-game').append(createGameForm());
    createInputWithDelete(new Date().getTime(), $('#new-game-form'));
    createInputWithDelete(new Date().getTime(), $('#new-game-form'));
    $('#add-team-button').click(
      function() {
        createInputWithDelete(new Date().getTime(), $('#new-game-form'));
      }
    );
    $('#start-game-button').click(function() {
      startGame();
    });
  });
}
