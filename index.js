/*** modules ***/
	var HTTP = require("http")
	var FS   = require("fs")
	var UTIL = require("util")
	var QS   = require("querystring")
	var WS   = require("websocket").server

	var MAIN = require("./main/logic")
	var GAME = require("./game/logic")
	var HOME = require("./home/logic")
	var DB   = {}

/*** maps ***/
	var MESSAGES   = MAIN.getAsset("messages")
	var CONFIGS    = MAIN.getAsset("configs")

/*** server ***/
	/* create server */
		var SERVER = HTTP.createServer(handleRequest)
			SERVER.listen(MAIN.getEnvironment("port"), function(error) {
				if (error) {
					MAIN.logError(error)
					return
				}
				MAIN.logStatus("listening on port " + MAIN.getEnvironment("port"))
			})

	/* handleRequest */
		function handleRequest(REQUEST, RESPONSE) {
			try {
				// collect data
					var data = ""
					REQUEST.on("data", function(chunk) { data += chunk })
					REQUEST.on("end", function() {
						parseRequest(REQUEST, RESPONSE, data)
					})
			}
			catch (error) {MAIN.logError("unable to handle request")}
		}

	/* parseRequest */
		function parseRequest(REQUEST, RESPONSE, data) {
			try {
				// get request info
					REQUEST.get    = QS.parse(REQUEST.url.split("?")[1]) || {}
					REQUEST.path   = REQUEST.url.split("?")[0].split("/") || []
					REQUEST.url    = REQUEST.url.split("?")[0] || "/"
					REQUEST.post   = data ? JSON.parse(data) : {}
					REQUEST.cookie = REQUEST.headers.cookie ? QS.parse(REQUEST.headers.cookie.replace(/; /g, "&")) : {}
					REQUEST.ip     = REQUEST.headers["x-forwarded-for"] || REQUEST.connection.remoteAddress || REQUEST.socket.remoteAddress || REQUEST.connection.socket.remoteAddress

				// log it
					if (REQUEST.url !== "/favicon.ico") {
						MAIN.logStatus((REQUEST.cookie.session || "new") + " @ " + REQUEST.ip + "\n[" + REQUEST.method + "] " + REQUEST.path.join("/") + "\n" + JSON.stringify(REQUEST.method == "GET" ? REQUEST.get : REQUEST.post))
					}

				// where next ?
					if ((/[.](ico|png|jpg|jpeg|gif|svg|pdf|txt|css|js)$/).test(REQUEST.url)) { // serve asset
						routeRequest(REQUEST, RESPONSE)
					}
					else { // get session and serve html
						MAIN.determineSession(REQUEST, RESPONSE, routeRequest)
					}
			}
			catch (error) {_403(REQUEST, RESPONSE, "unable to parse request")}
		}

	/* routeRequest */
		function routeRequest(REQUEST, RESPONSE) {
			try {
				// assets
					if (!REQUEST.session) {
						switch (true) {
							// icon
								case (/\/favicon[.]ico$/).test(REQUEST.url):
								case (/\/icon[.]png$/).test(REQUEST.url):
								case (/\/apple\-touch\-icon[.]png$/).test(REQUEST.url):
								case (/\/apple\-touch\-icon\-precomposed[.]png$/).test(REQUEST.url):
									try {
										RESPONSE.writeHead(200, {"Content-Type": "image/png"})
										FS.readFile("./main/images/icon.png", function(error, file) {
											if (error) {_404(REQUEST, RESPONSE, error)}
											else {
												RESPONSE.end(file, "binary")
											}
										})
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// logo
								case (/\/logo[.]png$/).test(REQUEST.url):
									try {
										RESPONSE.writeHead(200, {"Content-Type": "image/png"})
										FS.readFile("./main/images/logo.png", function(error, file) {
											if (error) {_404(REQUEST, RESPONSE, error)}
											else {
												RESPONSE.end(file, "binary")
											}
										})
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// banner
								case (/\/banner[.]png$/).test(REQUEST.url):
									try {
										RESPONSE.writeHead(200, {"Content-Type": "image/png"})
										FS.readFile("./main/images/banner.png", function(error, file) {
											if (error) {_404(REQUEST, RESPONSE, error)}
											else {
												RESPONSE.end(file, "binary")
											}
										})
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// x
								case (/\/x[.]png$/).test(REQUEST.url):
									try {
										RESPONSE.writeHead(200, {"Content-Type": "image/png"})
										FS.readFile("./main/images/x.png", function(error, file) {
											if (error) {_404(REQUEST, RESPONSE, error)}
											else {
												RESPONSE.end(file, "binary")
											}
										})
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// j
								case (/\/j[.]png$/).test(REQUEST.url):
									try {
										RESPONSE.writeHead(200, {"Content-Type": "image/png"})
										FS.readFile("./main/images/j.png", function(error, file) {
											if (error) {_404(REQUEST, RESPONSE, error)}
											else {
												RESPONSE.end(file, "binary")
											}
										})
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// stylesheet
								case (/\/(stylesheet|main|player)[.]css$/).test(REQUEST.url):
									try {
										RESPONSE.writeHead(200, {"Content-Type": "text/css"})
										FS.readFile("./main/stylesheet.css", CONFIGS.encoding, function(error, data) {
											if (error) {_404(REQUEST, RESPONSE, error)}
											else {
												FS.readFile("./" + REQUEST.path[1] + "/" + REQUEST.path[2], CONFIGS.encoding, function(error, file) {
													if (error) { _404(error) }
													else {
														RESPONSE.end(MAIN.getAsset("css variables") + "\n\n" + data + "\n\n" + file)
													}
												})
											}
										})
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// script
								case (/\/(script|main|player)[.]js$/).test(REQUEST.url):
									try {
										RESPONSE.writeHead(200, {"Content-Type": "text/javascript"})
										FS.readFile("./main/script.js", CONFIGS.encoding, function(error, data) {
											if (error) {_404(REQUEST, RESPONSE, error)}
											else {
												FS.readFile("./main/draw.js", CONFIGS.encoding, function(error, draw) {
													if (error) {_404(REQUEST, RESPONSE, error)}
													else {
														FS.readFile("./" + REQUEST.path[1] + "/" + REQUEST.path[2], CONFIGS.encoding, function(error, file) {
															if (error) { _404(REQUEST, RESPONSE, error) }
															else {
																RESPONSE.end(data + "\n\n" + draw + "\n\n" + file)
															}
														})
													}
												})
											}
										})
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// others
								default:
									_404(REQUEST, RESPONSE)
								break
						}
					}
					
				// get
					else if (REQUEST.method == "GET") {
						RESPONSE.writeHead(200, {
							"Set-Cookie": String("session=" + REQUEST.session.id + "; expires=" + (new Date(new Date().getTime() + MAIN.getEnvironment("cookie")).toUTCString()) + "; path=/; domain=" + MAIN.getEnvironment("domain")),
							"Content-Type": "text/html; charset=utf-8"
						})

						switch (true) {
							// home
								case (/^\/$/).test(REQUEST.url):
									try {
										MAIN.renderHTML(REQUEST, "./home/index.html", function(html) {
											RESPONSE.end(html)
										})
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// about
								case (/^\/about\/?$/).test(REQUEST.url):
									try {
										MAIN.renderHTML(REQUEST, "./about/index.html", function(html) {
											RESPONSE.end(html)
										})
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// game
								case (/^\/game\/[a-zA-Z0-9]{4}$/).test(REQUEST.url):
									try {
										var id = REQUEST.path[2].toLowerCase()
										REQUEST.game = DB[id] || false

										if (!REQUEST.game) {
											_302(REQUEST, RESPONSE, CONFIGS.redirect)
										}
										else if (REQUEST.game.players[REQUEST.session.id]) {
											MAIN.renderHTML(REQUEST, "./game/player.html", function(html) {
												RESPONSE.end(html)
											})
										}
										else {
											MAIN.renderHTML(REQUEST, "./game/main.html", function(html) {
												RESPONSE.end(html)
											})
										}
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// data
								case (/^\/data\/?$/).test(REQUEST.url):
									try {
										if (MAIN.getEnvironment("debug")) {
											RESPONSE.end("<pre>" + UTIL.inspect(DB, {depth: Infinity}) + "</pre>")
										}
										else {
											_404(REQUEST, RESPONSE)
										}
									}
									catch (error) {_404(REQUEST, RESPONSE, error)}
								break

							// others
								default:
									_404(REQUEST, RESPONSE)
								break
						}
					}

				// post
					else if (REQUEST.method == "POST" && REQUEST.post.action) {
						RESPONSE.writeHead(200, {"Content-Type": "text/json"})

						switch (REQUEST.post.action) {
							// home
								case "createGame":
									try {
										do {
											id = MAIN.generateRandom(CONFIGS.idSet, CONFIGS.idLength)
										}
										while (DB[id])

										HOME.createGame(REQUEST, id, function(data) {
											DB[id] = REQUEST.game
											RESPONSE.end(JSON.stringify(data))
										})
									}
									catch (error) {_403(REQUEST, RESPONSE, error)}
								break

								case "joinGame":
									try {
										if (!REQUEST.post.gameid || (REQUEST.post.gameid.length !== CONFIGS.idLength) || !MAIN.isNumLet(REQUEST.post.gameid)) {
											RESPONSE.end(JSON.stringify({success: false, message: MESSAGES["validation-gameid"]}))
										}
										else if (!DB[REQUEST.post.gameid]) {
											RESPONSE.end(JSON.stringify({success: false, message: MESSAGES["no-game"]}))
										}
										else {
											REQUEST.game = DB[REQUEST.post.gameid]

											HOME.joinGame(REQUEST, function(data) {
												RESPONSE.end(JSON.stringify(data))
											})
										}
									}
									catch (error) {_403(REQUEST, RESPONSE, error)}
								break

							// others
								default:
									_403(REQUEST, RESPONSE)
								break
						}
					}

				// others
					else {_403(REQUEST, RESPONSE, "unknown route")}
			}
			catch (error) {_403(REQUEST, RESPONSE, "unable to route request")}
		}

	/* _302 */
		function _302(REQUEST, RESPONSE, data) {
			MAIN.logStatus("redirecting to " + (data || "/"))
			RESPONSE.writeHead(302, {Location: data || CONFIGS.redirect})
			RESPONSE.end()
		}

	/* _403 */
		function _403(REQUEST, RESPONSE, data) {
			MAIN.logError(data)
			RESPONSE.writeHead(403, {"Content-Type": "text/json"})
			RESPONSE.end( JSON.stringify({success: false, error: data}) )
		}

	/* _404 */
		function _404(REQUEST, RESPONSE, data) {
			MAIN.logError(data)
			RESPONSE.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
			MAIN.renderHTML(REQUEST, "./main/_404.html", function(html) {
				RESPONSE.end(html)
			})
		}

/*** socket ***/
	/* create socket */
		var SOCKET = new WS({httpServer: SERVER, autoAcceptConnections: false})
			SOCKET.on("request", handleSocket)

	/* handleSocket */
		function handleSocket(REQUEST) {
			try {
				// collect data
					if ((REQUEST.origin.replace("https://","").replace("http://","") !== MAIN.getEnvironment("domain")) && (REQUEST.origin !== "http://" + MAIN.getEnvironment("domain") + ":" + MAIN.getEnvironment("port"))) {
						MAIN.logStatus("[REJECTED]: " + REQUEST.origin + " @ " + (REQUEST.socket._peername.address || "?"))
						REQUEST.reject()
						return
					}
				
				// new connection
					if (!REQUEST.connection) {
						REQUEST.connection = REQUEST.accept(null, REQUEST.origin)
					}
				
				// parse connection
					parseSocket(REQUEST)
			} catch (error) {MAIN.logError("unable to handle socket")}
		}

	/* parseSocket */
		function parseSocket(REQUEST) {
			try {
				// get request info
					REQUEST.url     = (REQUEST.httpRequest.headers.host || "") + (REQUEST.httpRequest.url || "")
					REQUEST.path    = REQUEST.httpRequest.url.split("?")[0].split("/") || []
					REQUEST.cookie  = REQUEST.httpRequest.headers.cookie ? QS.parse(REQUEST.httpRequest.headers.cookie.replace(/; /g, "&")) : {}
					REQUEST.headers = {}
					REQUEST.headers["user-agent"] = REQUEST.httpRequest.headers['user-agent']
					REQUEST.headers["accept-language"] = REQUEST.httpRequest.headers['accept-language']
					REQUEST.ip      = REQUEST.connection.remoteAddress || REQUEST.socket._peername.address

				// log it
					MAIN.logStatus((REQUEST.cookie.session || "new") + " @ " + REQUEST.ip + "\n[WEBSOCKET] " + REQUEST.path.join("/"))

				// get session and wait for messages
					MAIN.determineSession(REQUEST, null, routeSocket)
			}
			catch (error) {_400(REQUEST, "unable to parse socket")}
		}

	/* routeSocket */
		function routeSocket(REQUEST) {
			try {
				// on connect
					REQUEST.game = DB[REQUEST.path[2]] || false
					GAME.addPlayer(REQUEST, function(recipients, data) {
						if (!data.success) {
							REQUEST.connection.sendUTF(JSON.stringify({success: false, location: CONFIGS.redirect}))
							REQUEST.connection.close()
						}
						else {
							updateSocket(REQUEST, recipients, data)
						}
					})

				// on close
					REQUEST.connection.on("close", function(reasonCode, description) {
						GAME.removePlayer(REQUEST, function(recipients, data) {
							if (data.delete) {
								clearInterval(REQUEST.game.loop)
								delete DB[REQUEST.game.id]
							}
							else {
								updateSocket(REQUEST, recipients, data)
							}
						})
					})
				
				// on message
					REQUEST.connection.on("message", function(message) {
						// get post data
							REQUEST.post = null
							try {REQUEST.post = JSON.parse(message.utf8Data) || null}
							catch (error) {MAIN.logError(error)}

						if (REQUEST.post && REQUEST.post.action) {
							switch (REQUEST.post.action) {
								case "submitIssue":
									try {
										GAME.submitIssue(REQUEST, function(recipients, data) {
											updateSocket(REQUEST, recipients, data)
										})
									}
									catch (error) {_400(REQUEST, error)}
								break

								case "submitOption":
									try {
										GAME.submitOption(REQUEST, function(recipients, data) {
											updateSocket(REQUEST, recipients, data)
										})
									}
									catch (error) {_400(REQUEST, error)}
								break

								case "submitRecall":
									try {
										GAME.submitRecall(REQUEST, function(recipients, data) {
											updateSocket(REQUEST, recipients, data)
										})
									}
									catch (error) {_400(REQUEST, error)}
								break

								case "submitTally":
									try {
										GAME.submitTally(REQUEST, function(recipients, data) {
											updateSocket(REQUEST, recipients, data)
										})
									}
									catch (error) {_400(REQUEST, error)}
								break

								case "submitCampaign":
									try {
										GAME.submitCampaign(REQUEST, function(recipients, data) {
											updateSocket(REQUEST, recipients, data)
										})
									}
									catch (error) {_400(REQUEST, error)}
								break

								case "submitStart":
									try {
										GAME.submitStart(REQUEST, function(recipients, data) {
											updateSocket(REQUEST, recipients, data)
										})
									}
									catch (error) {_400(REQUEST, error)}
								break

								default:
									_400(REQUEST, "invalid action")
								break
							}
						}
					})

				// loop
					if (REQUEST.game && !REQUEST.game.loop) {
						REQUEST.game.loop = setInterval(function() {
							MAIN.logTime(REQUEST.game.id + ":l ", function() {
								GAME.updateTime(REQUEST, function(recipients, data) {
									updateSocket(REQUEST, recipients, data)
								})
							})
						}, CONFIGS.loopTime)
					}

			}
			catch (error) {_400(REQUEST, "unable to route socket")}
		}

	/* updateSocket */
		function updateSocket(REQUEST, recipients, data) {
			try {
				data = JSON.stringify(data)
				for (var r in recipients) {
					try {
						if (REQUEST.game.players[recipients[r]] && REQUEST.game.players[recipients[r]].connected) {
							REQUEST.game.players[recipients[r]].connection.sendUTF(data)
						}
						else if (REQUEST.game.observers[recipients[r]] && REQUEST.game.observers[recipients[r]].connected) {
							REQUEST.game.observers[recipients[r]].connection.sendUTF(data)
						}
					}
					catch (error) {MAIN.logError(error)}
				}
			}
			catch (error) {MAIN.logError(error)}
		}

	/* _400 */
		function _400(REQUEST, data) {
			MAIN.logError(data)
			REQUEST.connection.sendUTF(JSON.stringify({success: false, message: (data || "unknown websocket error")}))
		}

