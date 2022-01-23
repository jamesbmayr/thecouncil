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

	/* chooseRandom */
		function chooseRandom(options) {
			if (!Array.isArray(options)) {
				return false
			}
			else {
				return options[Math.floor(Math.random() * options.length)]
			}
		}

	/* getMinSec */
		function getMinSec(ms) {
			if (isNaN(ms)) {
				return ms
			}
			else {
				var seconds = Math.floor(ms / 1000)
				var minutes = Math.floor(seconds / 60)
				seconds -= (minutes * 60)

				return (minutes || "0") + ":" + (String(seconds).length == 1 ? "0" : "") + seconds
			}
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
		var messageLoop = null
		var messageTime = 0
		function displayMessage(message) {
			var element = document.getElementById("message")
				element.innerHTML = message || "unknown error"
				element.className = ""
				element.style.opacity = 0
			
			if (typeof messageLoop !== "undefined") {
				clearInterval(messageLoop)
				messageTime = 0
			}

			messageLoop = setInterval(function() { // fade in
				if (messageTime < 5) {
					messageTime += 0.1
					element.style.opacity = (-0.5 * Math.pow(messageTime, 2)) + (2.5 * messageTime)
				}
				else {
					clearInterval(messageLoop)
					messageTime = 0
					element.className = "hidden"
					element.style.opacity = 0
				}			
			}, 100)
		}
