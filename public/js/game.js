

function Game(name, teams = [], pointsArray = [3, 1]) {
  this.name_ = name;
  this.teams_ = teams;
  this.currentTeam_ = 0;
  this.pointsArray_ = pointsArray;
};

Game.prototype.getName = function() {
  return this.name_;
};

Game.from = function(game_obj) {
  if(!game_obj) return null;
  return new Game(game_obj.name, game_obj.teams, game_obj.points);
};

Game.prototype.show = function(parent_element, allow_click = true) {
  const columnWidth = Math.floor(12 / this.teams_.length);
  const columnClass = "col-xs-"+columnWidth;
  for(let i = 0; i < this.teams_.length; i++) {
    $('#'+parent_element).append(this.createScorecard_(this.teams_[i], columnClass));
    const div_id = '#'+this.teams_[i].id;
    if (allow_click) {
    $(div_id).click(()=>{
      const prevActiveTeam = this.activeTeam_;
      this.activeTeam_ = i;
      $('#team-id')[0].value = i;
      $('#score-value')[0].value = "";
      $(div_id + " > .card").addClass('score-card-active');
      if(this.teams_[prevActiveTeam]){
        $('#'+this.teams_[prevActiveTeam].id + ' > .card').removeClass('score-card-active');
      }
    });
  }
  }
};

Game.prototype.createScorecard_ = function(team, className='') {
    let scoreDiv =
    `<div id={0} class="score-card {1}">
    <div class="card">
  <img class="card-img-top" src="{2}" style="background-color:{5}">
  <div class="card-body">
    <h2 class="card-title score-heading">{3}</h2>
    <p id="{0}-score-value" class="card-text score-value">{4}</p>
  </div>
</div> </div>`;
    let filledInDiv = scoreDiv.format(
      team.id, className, team.logo, team.name, team.score, team.color);
    return filledInDiv;
};

Game.prototype.updateTeamScore = function(teamId, score) {
  this.teams_[teamId].score = score;
  this.updateScore_(this.teams_[teamId]);
};

Game.prototype.updateScore = function(team_id, score = 0, dbase) {
  const scoresRef = dbase.child('scores/'+team_id);
  const teamRef = dbase.child('teams/'+team_id+'/score');
  this.teams_[team_id].score += isNaN(score) ? 0 : score;
  this.updateScore_(this.teams_[team_id]);
  scoresRef.transaction((score) => {return this.teams_[team_id].score;});
  // teamRef.transaction((score) => {return this.teams_[team_id].score;})
};

Game.prototype.updateScore_ = function(team) {
  const fullId = "#{0}-score-value".format(team.id);
  $(fullId)[0].innerText = team.score;
};

Game.loadGames = function(parent_element, dbase, callback) {
  dbase.once('value', callback);
};

Game.createTeam = function(name, logo, color) {
  return {
    "id" : name.replace(/\s+/g, "-"),
    "name": name,
    "color" : color,
    "score": 0,
    "logo" :  logo
  };
};

Game.prototype.updateMessage = function(msg, dbase) {
  const msgRef = dbase.child("message/");
  msgRef.transaction((message) => {return msg;});
};

Game.prototype.getPointsArray = function() {
  return this.pointsArray_;
}

Game.prototype.save = function(dbase) {
  const teamScores = this.teams_.map(x => x.score);
  const g = {
    "id": new Date().getTime(),
    "name": this.name_,
    "teams": this.teams_,
    "points": this.pointsArray_,
    "scores": teamScores,
    "message": "",
    "winner": "-1",
    "status": "started"
  };
  const name = this.name_;
  dbase.child(this.name_).set(g);
  console.log(g);
}
