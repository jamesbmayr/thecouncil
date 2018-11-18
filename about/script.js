09/*** actions ***/
	/* submitFeedback */
		document.getElementById("feedback-submit").addEventListener(on.click, submitFeedback)
		document.getElementById("feedback-email").addEventListener("keyup", function(event) { if (event.which == 13) { submitFeedback() } })
		function submitFeedback() {
			var text  = document.getElementById("feedback-text").value  || false
			var email = document.getElementById("feedback-email").value || false

			if (!text || !text.length) {
				displayMessage("No text was entered.")
			}
			else if (!email || !isEmail(email)) {
				displayMessage("Please enter a valid email.")
			}
			else {
				try {
					var time = new Date()
					var text = sanitizeString(text).replace(/\&/gi, "%26")

					var request = new XMLHttpRequest()
						request.open("GET", "https://script.google.com/macros/s/AKfycbzfQhGlEqH9aQiYaHMYR1-c7BRnSDY2YACWk7GSzkQs2zPNLoc/exec?project=melodemons&time=" + time + "&email=" + email + "&text=" + text, true)
						request.onload = function() {
							if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
								displayMessage("Thanks! Feedback sent!")
								document.getElementById("feedback-text").value  = ""
								document.getElementById("feedback-email").value = ""
							}
							else {
								displayMessage("Unable to send feedback at this time.")
							}
						}
					request.send()
				} catch (error) {
					displayMessage("Unable to send feedback at this time.")
				}
			}
		}

/*** details ***/
	/* createFlags */
		document.querySelectorAll("canvas.flag").forEach(createFlag)

	/* cycleColors */
		var backgroundLoop = setInterval(cycleColors, 100)
		cycleColors()
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
