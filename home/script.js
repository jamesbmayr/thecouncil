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

/*** details ***/
	/* updateBackground */
		var backgroundLoop = setInterval(updateBackground, 100)
		updateBackground()
		function updateBackground() {
			cycleColors()
			moveFlags()
		}

	/* moveFlags */
		function moveFlags() {
			document.querySelectorAll("#flags-background .flag-outer").forEach(function(outer) {
				// get data
					var bottom = Number(outer.style.bottom.replace("px", ""))
					var direction = Number(outer.getAttribute("direction"))
						direction = (bottom > 300) ? -1 : (bottom < -300) ? 1 : direction
					if (bottom == 0 && direction == 1) {
						createFlag(outer.querySelector(".flag"))
					}

				// move
					bottom = bottom + ((direction == 1) ? 5 : -5)
					outer.style.bottom = bottom + "px"
					outer.setAttribute("direction", direction)
			})
		}

	/* cycleColors */
		function cycleColors() {
			// get color & direction
				var colors = document.body.style["background-color"]
					colors = colors ? colors.replace("rgb(", "").replace(")", "").split(",").map(function(c) { return Number(c) }) : [Math.floor(Math.random() * 100) + 50, Math.floor(Math.random() * 100) + 100, Math.floor(Math.random() * 100) + 150]
				var r = Number(document.body.getAttribute("r"))
				var g = Number(document.body.getAttribute("g"))
				var b = Number(document.body.getAttribute("b"))

				if (!r) { r = 1 }
				if (!g) { g = 1 }
				if (!b) { b = 1 }

			// set colors
				colors[0] = (r == 1) ? (colors[0] + (Math.floor(Math.random() * 2) + 1)) : (colors[0] - (Math.floor(Math.random() * 2) + 1))
				colors[1] = (g == 1) ? (colors[1] + (Math.floor(Math.random() * 2) + 1)) : (colors[1] - (Math.floor(Math.random() * 2) + 1))
				colors[2] = (b == 1) ? (colors[2] + (Math.floor(Math.random() * 2) + 1)) : (colors[2] - (Math.floor(Math.random() * 2) + 1))

			// set direction
				r = (colors[0] <  50) ? 1 : (colors[0] > 150) ? -1 : r
				g = (colors[1] < 100) ? 1 : (colors[1] > 200) ? -1 : g
				b = (colors[2] < 150) ? 1 : (colors[2] > 250) ? -1 : b

			// update values
				document.body.style["background-color"] = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"
				document.body.setAttribute("r", r)
				document.body.setAttribute("g", g)
				document.body.setAttribute("b", b)
		}
