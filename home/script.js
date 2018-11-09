/*** actions ***/
	/* createGame */
		document.getElementById("createGame").addEventListener(on.click, createGame)
		function createGame() {
			// data
				var post = {
					action: "createGame"
				}

			// submit
				sendPost(post, function(data) {
					if (!data.success) {
						displayMessage(data.message || "Unable to create a game...")
					}
					else {
						window.location = data.location
					}
				})
		}

	/* joinGame */
		document.getElementById("joinGame").addEventListener(on.click, joinGame)
		document.getElementById("gameCode").addEventListener("keyup", function (event) { if (event.which == 13) { joinGame() } })
		function joinGame() {
			// get values
				var gameCode = document.getElementById("gameCode").value.replace(" ","").trim().toLowerCase() || false
				var name     = sanitizeString(document.getElementById("createName").value) || null

			if (gameCode.length !== 4) {
				displayMessage("The game code must be 4 characters.")
			}
			else if (!isNumLet(gameCode)) {
				displayMessage("The game code can be letters only.")
			}
			else if (!name || !name.length || name.length > 12) {
				displayMessage("Enter a name between 1 and 12 characters.")
			}
			else if (!isNumLet(name)) {
				displayMessage("Your name can be letters and numbers only.")
			}
			else {
				// data
					var post = {
						action: "joinGame",
						gameid: gameCode,
						name:   name
					}

				// submit
					sendPost(post, function(data) {
						if (!data.success) {
							displayMessage(data.message || "Unable to join this game...")
						}
						else {
							window.location = data.location
						}
					})
			}
		}
