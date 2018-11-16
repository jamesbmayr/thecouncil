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
				var name     = sanitizeString(document.getElementById("name").value) || null

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

/*** flags ***/
	/* populateFlags */
		populateFlags()
		function populateFlags() {
			var flags = document.getElementById("flags")
			var width = window.innerWidth / 6
			for (var i = 1; i < 6; i++) {
				// container
					var outer = document.createElement("div")
						outer.id = "flag-outer-" + i
						outer.className = "flag-outer"
						outer.style.top = (window.innerHeight - (i % 2 == 0 ? 125 : 150)) + "px"
						outer.style.left = "calc(100vw / 6 * " + (i - 0.5) + ")"
					flags.appendChild(outer)

				// flag
					var flag = document.createElement("canvas")
						flag.className = "flag"
						flag.height = 1000
						flag.width = 1500
						flag.style.height = "100px"
						flag.style.width = "150px"
						createFlag(flag)
					outer.appendChild(flag)

				// pole
					var pole = document.createElement("div")
						pole.className = "flag-pole"
					outer.appendChild(pole)
			}
		}
