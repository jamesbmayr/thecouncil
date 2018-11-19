/*** modules ***/
	var main = require("../main/logic")
	var game = require("../game/logic")
	module.exports = {}

/*** creates ***/
	/* createGame */
		module.exports.createGame = createGame
		function createGame(request, id, callback) {
			try {
				// create game
					request.game    = main.getSchema("game")
					request.game.id = id					

				callback({success: true, message: "game created", location: "../../game/" + request.game.id})
			}
			catch (error) {
				main.logError(error)
				callback({success: false, message: "unable to create game"})
			}
		}
	
	/* createPlayer */
		module.exports.createPlayer = createPlayer
		function createPlayer(request) {
			try {
				// create player
					var player      = main.getSchema("player")
						player.id   = request.session.id

					if (request.post.name) {
						player.name = main.sanitizeString(request.post.name)
					}

				// other players
					var otherNames = Object.keys(request.game.players).map(function(p) {
						return request.game.players[p].name
					}) || []

				// return value
					if (!otherNames.length || !otherNames.includes(player.name)) {
						return player
					}
			}
			catch (error) {main.logError(error)}
		}

/*** joins ***/
	/* joinGame */
		module.exports.joinGame = joinGame
		function joinGame(request, callback) {
			try {
				if (request.game.data.state.end) {
					callback({success: false, message: "game already ended"})
				}
				else if (!request.game.players[request.session.id] && (Object.keys(request.game.players).length >= 25)) {
					callback({success: false, message: "game is at capacity"})
				}
				else if (!request.game.players[request.session.id] && request.game.data.state.start) {
					callback({success: false, message: "game already started"})
				}
				else if (request.game.players[request.session.id]) {
					callback({success: true, message: "rejoining game", location: "../../game/" + request.game.id})
				}
				else if (!request.post.name || !request.post.name.length || request.post.name.length > 12) {
					callback({success: false, message: "Enter a name between 1 and 12 characters."})
				}
				else if (!main.isNumLet(request.post.name)) {
					callback({success: false, message: "Your name can be letters and numbers only."})
				}
				else {
					var player = createPlayer(request)

					if (!player) {
						callback({success: false, message: "Name already taken."})
					}
					else {
						request.game.players[request.session.id] = player
						callback({success: true, message: "game joined", location: "../../game/" + request.game.id})
					}
				}
			}
			catch (error) {
				main.logError(error)
				callback({success: false, message: "unable to join game"})
			}
		}
