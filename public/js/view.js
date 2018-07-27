
function createGameLink(game) {
  return "<a href='#' class='btn btn-primary game-button' onClick='showGame(\"{0}\")'>{1}</a>"
  .format(game.name, game.name);
};

var games = {};
function loadGames() {
  const gameRef = firebase.database().ref("games/");
  Game.loadGames('game-list', gameRef, viewCallback);
};
function viewCallback(data) {
  games = data.val();
  const gameListDiv = $('#game-list');
  gameListDiv.append('<li>');
  for (key in games) {
    gameListDiv.append('<ul>' + createGameLink(games[key]) + '</ul>');
  }
  gameListDiv.append('</li>');
}

function  showGame(index) {
  $('#game-panel')[0].style = 'display:block';
  $('#game-container')[0].style = 'display:none';
  // Show Heading
  $('#' + 'game-heading')[0].innerHTML = games[index].name;
  const game = Game.from(games[index]);
  game.show('game-score-board', false /* allow_click*/);
  // Listen for changes in the scores
  const gameRef = firebase.database().ref("games/").child(game.getName()).child("scores");
  gameRef.on('value', (data) => {
    const scoreDict = data.val();
    for (key in scoreDict) {
      game.updateTeamScore(key, scoreDict[key])
    }
  });
  const msgRef = firebase.database().ref("games/").child(game.getName()).child("message");
  msgRef.on('value', (data) => {
    $('#game-message')[0].innerText = data.val();
  });
}
