/*** modules ***/
	var MAIN = require("../main/logic")
	var GAME = require("../game/logic")
	module.exports = {}

/*** maps ***/
	var MESSAGES = MAIN.getAsset("messages")
	var CONFIGS = MAIN.getAsset("configs")

/*** creates ***/
	/* createGame */
		module.exports.createGame = createGame
		function createGame(REQUEST, id, callback) {
			try {
				// create game
					REQUEST.game    = MAIN.getSchema("game")
					REQUEST.game.id = id				

				callback({success: true, message: MESSAGES["create"], location: "../../game/" + REQUEST.game.id})
			}
			catch (error) {
				MAIN.logError(error)
				callback({success: false, message: "unable to create game"})
			}
		}
	
	/* createPlayer */
		module.exports.createPlayer = createPlayer
		function createPlayer(REQUEST) {
			try {
				// create player
					var player      = MAIN.getSchema("player")
						player.id   = REQUEST.session.id

					if (REQUEST.post.name) {
						player.name = MAIN.sanitizeString(REQUEST.post.name)
					}

				// other players
					var otherNames = Object.keys(REQUEST.game.players).map(function(p) {
						return REQUEST.game.players[p].name
					}) || []

				// return value
					if (!otherNames.length || !otherNames.includes(player.name)) {
						return player
					}
			}
			catch (error) {MAIN.logError(error)}
		}

/*** joins ***/
	/* joinGame */
		module.exports.joinGame = joinGame
		function joinGame(REQUEST, callback) {
			try {
				if (REQUEST.game.data.state.end) {
					callback({success: false, message: MESSAGES["already-ended"]})
				}
				else if (!REQUEST.game.players[REQUEST.session.id] && (Object.keys(REQUEST.game.players).length >= CONFIGS.playerCountMaximum)) {
					callback({success: false, message: MESSAGES["at-capacity"]})
				}
				else if (!REQUEST.game.players[REQUEST.session.id] && REQUEST.game.data.state.start) {
					callback({success: false, message: MESSAGES["already-started"]})
				}
				else if (REQUEST.game.players[REQUEST.session.id]) {
					callback({success: true, message: MESSAGES["rejoin"], location: "../../game/" + REQUEST.game.id})
				}
				else if (!REQUEST.post.name || !REQUEST.post.name.length || REQUEST.post.name.length < CONFIGS.playerNameMinimum || REQUEST.post.name.length > CONFIGS.playerNameMaximum) {
					callback({success: false, message: MESSAGES["validation-name-length"]})
				}
				else if (!MAIN.isNumLet(REQUEST.post.name)) {
					callback({success: false, message: MESSAGES["validation-name-set"]})
				}
				else {
					var player = createPlayer(REQUEST)

					if (!player) {
						callback({success: false, message: MESSAGES["validation-name-unique"]})
					}
					else {
						REQUEST.game.players[REQUEST.session.id] = player
						callback({success: true, message: MESSAGES["join"], location: "../../game/" + REQUEST.game.id})
					}
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback({success: false, message: "unable to join game"})
			}
		}
