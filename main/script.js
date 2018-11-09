/*** globals ***/
	/* triggers */
		if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent)) {
			var on = { click: "touchstart", mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" }
		}
		else {
			var on = { click:      "click", mousedown:  "mousedown", mousemove: "mousemove", mouseup:  "mouseup" }
		}


/*** tools ***/
	/* sanitizeString */
		function sanitizeString(string) {
			return (string.length ? string.replace(/[^a-zA-Z0-9_\s\!\@\#\$\%\^\&\*\(\)\+\=\-\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]/gi, "") : "")
		}

	/* isEmail */
		function isEmail(string) {
			return (/[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).test(string)
		}
	
	/* isNumLet */
		function isNumLet(string) {
			return (/^[a-z0-9A-Z_\s]+$/).test(string)
		}

	/* sendPost */
		function sendPost(post, callback) {
			var request = new XMLHttpRequest()
				request.open("POST", location.pathname, true)
				request.onload = function() {
					if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
						callback(JSON.parse(request.responseText) || {success: false, message: "unknown error"})
					}
					else {
						callback({success: false, readyState: request.readyState, message: request.status})
					}
				}
				request.send(JSON.stringify(post))
		}

	/* displayMessage */
		var message = document.getElementById("message")
		var messageFadein = null
		var messageFadeout = null

		function displayMessage(message) {
			message.textContent = message || "unknown error"
			message.className = ""
			message.style.opacity = 0
			
			if (typeof messageFadein  !== "undefined") { clearInterval(messageFadein)  }
			if (typeof messageFadeout !== "undefined") { clearInterval(messageFadeout) }

			messageFadein = setInterval(function() { // fade in
				message.className = ""
				var opacity = Number(message.style.opacity) * 100

				if (opacity < 100) {
					message.style.opacity = Math.ceil( opacity + ((100 - opacity) / 10) ) / 100
				}
				else {
					clearInterval(messageFadein)
					if (typeof messageFadeout !== "undefined") { clearInterval(messageFadeout) }
					
					messageFadeout = setInterval(function() { // fade out
						var opacity = Number(message.style.opacity) * 100

						if (opacity > 0.01) {
							message.style.opacity = Math.floor(opacity - ((101 - opacity) / 10) ) / 100
						}
						else {
							clearInterval(messageFadeout)
							if (typeof messageFadein !== "undefined") { clearInterval(messageFadein) }

							message.className = "hidden"
							message.style.opacity = 0
						}
					}, 100)
				}
			}, 100)
		}
