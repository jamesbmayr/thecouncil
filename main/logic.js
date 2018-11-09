/*** modules ***/
	var http       = require("http")
	var fs         = require("fs")
	var debug      = getEnvironment("debug")
	module.exports = {}

/*** logs ***/
	/* logError */
		module.exports.logError = logError
		function logError(error) {
			if (debug) {
				console.log("\n*** ERROR @ " + new Date().toLocaleString() + " ***")
				console.log(" - " + error)
				console.dir(arguments)
			}
		}

	/* logStatus */
		module.exports.logStatus = logStatus
		function logStatus(status) {
			if (debug) {
				console.log("\n--- STATUS @ " + new Date().toLocaleString() + " ---")
				console.log(" - " + status)

			}
		}

	/* logMessage */
		module.exports.logMessage = logMessage
		function logMessage(message) {
			if (debug) {
				console.log(" - " + new Date().toLocaleString() + ": " + message)
			}
		}

	/* logTime */
		module.exports.logTime = logTime
		function logTime(flag, callback) {
			if (debug) {
				var before = process.hrtime()
				callback()
				
				var after = process.hrtime(before)[1] / 1e6
				if (after > 5) {
					logMessage(flag + " " + after)
				}
			}
			else {
				callback()
			}
		}

/*** maps ***/
	/* getEnvironment */
		module.exports.getEnvironment = getEnvironment
		function getEnvironment(index) {
			try {
				if (process.env.DOMAIN !== undefined) {
					var environment = {
						port:   process.env.PORT,
						domain: process.env.DOMAIN,
						debug:  (process.env.DEBUG || false)
					}
				}
				else {
					var environment = {
						port:   3000,
						domain: "localhost",
						debug:  true
					}
				}

				return environment[index]
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* getAsset */
		module.exports.getAsset = getAsset
		function getAsset(index) {
			try {
				switch (index) {
					case "logo":
						return "logo.png"
					break
					case "google fonts":
						return '<link href="https://fonts.googleapis.com/css?family=Orbitron" rel="stylesheet">'
					break
					case "meta":
						return '<meta charset="UTF-8"/>\
								<meta name="description" content="Keep the republic from crumbling - rule the fantasy realm together in The Council, a card game of politics and persuasion."/>\
								<meta name="keywords" content="game,council,politics,fantasy,decision,vote,election,multiplayer"/>\
								<meta name="author" content="James Mayr"/>\
								<meta property="og:title" content="Keep the republic from crumbling - rule the fantasy realm together in The Council, a card game of politics and persuasion."/>\
								<meta property="og:url" content="https://thecouncil.herokuapp.com"/>\
								<meta property="og:description" content="Keep the republic from crumbling - rule the fantasy realm together in The Council, a card game of politics and persuasion."/>\
								<meta property="og:image" content="https://thecouncil.herokuapp.com/banner.png"/>\
								<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>'
					break
					case "css variables":
						var colors = getAsset("colors")
						var cssColors = ""
						for (var hue in colors) {
							for (var shade in colors[hue]) {
								cssColors += "		--" + hue + "-" + shade + ": " + colors[hue][shade] + ";\n"
							}
						}
						
						return ('/*** variables ***/\n' +
								'	:root {\n' +
								'		--font: Orbitron, sans-serif;\n' +
								'		--borderRadius: 10px;\n' +
										cssColors +
								'	}')
					break
					case "js variables":
						var colors = getAsset("colors")
						var jsColors = ""
						for (var hue in colors) {
							for (var shade in colors[hue]) {
								jsColors += "	--" + hue + "-" + shade + ": " + colors[hue][shade] + ";\n"
							}
						}
						
						return ('/*** variables ***/\n' +
								'	var font   = window.font   = "Orbitron"\n' +
								'	var borderRadius = window.borderRadius = 10\n' +
								'	var colors = window.colors = ' + JSON.stringify(getAsset("colors"), null, "\t"))
					break

					case "races":
						return [
							{
								singular:    "dwarf",
								plural:      "dwarves",
								altsingular: "dwarf",
								altplural:   "dwarfs",
								short:       "d"
							},
							{
								singular:    "elf",
								plural:      "elves",
								altsingular: "elf",
								altplural:   "elfs",
								short:       "e"
							},
							{
								singular:    "fairy",
								plural:      "fairies",
								altsingular: "faery",
								altplural:   "faerys",
								short:       "f"
							},
							{
								singular:    "goblin",
								plural:      "goblins"
								altsingular: "goblin",
								altplural:   "goblins",
								short:       "g"
							},
							{
								singular:    "lizardperson",
								plural:      "lizardfolk"
								altsingular: "sss",
								altplural:   "zzz",
								short:       "l"
							}
						]
					break

					case "agencies":
						return [
							{
								full:  "social & healthcare",
								short: "s"
							},
							{
								singular: "regulation & environment",
								plural:   "r"
							},
							{
								singular: "technology & research",
								plural:   "t"
							},
							{
								singular: "military & police",
								plural:   "m"
							}
						]
					break

					case "ideologies":
						return [
							{
								name:        "socialist",
								description: "build a large government with a strong safety net, strict regulation, and investment in technology and education",
								s:           [80,100],
								r:           [80,100],
								t:           [80,100],
								m:           [ 0,100],
								other:       null
							},
							{
								name:        "liberal",
								description: "",
								s:           [60,100],
								r:           [60,100],
								t:           [60,100],
								m:           [ 0, 40],
								other:       null
							},
							{
								name:        "moderate",
								description: "",
								s:           [25, 75],
								r:           [25, 75],
								t:           [25, 75],
								m:           [25, 75],
								other:       null
							},
							{
								name:        "conservative",
								description: "",
								s:           [ 0, 40],
								r:           [ 0, 40],
								t:           [ 0, 40],
								m:           [60,100],
								other:       null
							},
							{
								name:        "libertarian",
								description: "",
								s:           [ 0, 20],
								r:           [ 0, 20],
								t:           [ 0, 20],
								m:           [ 0,100],
								other:       null
							},
							{
								name:        "fascist",
								description: "",
								s:           [ 0,100],
								r:           [ 0,100],
								t:           [ 0,100],
								m:           [80,100],
								other:       "be council leader"
							},
							{
								name:        "populist",
								description: "",
								s:           [80,100],
								r:           [ 0,100],
								t:           [ 0,100],
								m:           [ 0,100],
								other:       "80+ approval rating"
							},
							{
								name:        "anarchist",
								description: "",
								s:           [ 0,100],
								r:           [ 0,100],
								t:           [ 0,100],
								m:           [ 0, 20],
								other:       "successful rebellion"
							},
							{
								name:        "crook",
								description: "",
								s:           [ 0,100],
								r:           [ 0, 20],
								t:           [ 0,100],
								m:           [ 0,100],
								other:       "100000 in funds"
							}
						]
					break

					case "names":
						return ["Caledonia"]
					break

					case "colors":
						return {
							magenta:    ["#ffcce6","#ff66b3","#e60073","#99004d","#33001a"],
							red:        ["#fab7b7","#f66f6f","#d80e0e","#7c0808","#300303"],
							brown:      ["#e09b06","#ae7804","#7c5603","#513802","#191101"],
							browngray:  ["#d5cac3","#b6a196","#a18778","#786154","#4f4037"],
							orange:     ["#fde4ce","#f9ae6c","#f68523","#ab5407","#442103"],
							beige:      ["#f7f4ed","#e0d3b8","#c1a871","#91773f","#6a572f"],
							yellow:     ["#f6f4d5","#e5dd80","#d8cb41","#beb227","#7f771a"],
							green:      ["#a9d3ab","#539e57","#1a661e","#074f0b","#053007"],
							greengray:  ["#d3ded4","#99b29b","#6a8c6c","#4d664e","#374938"],
							cyan:       ["#e6ffff","#b3ffff","#33ffff","#00cccc","#008080"],
							cerulean:   ["#dae7f1","#90b8d5","#4689b9","#2b5572","#1c374a"],
							bluegray:   ["#dee9ed","#adc8d2","#7ba7b7","#487484","#2d4852"],
							blue:       ["#d0e0fb","#7a9bd3","#2b76ef","#0b3d8e","#04142f"],
							purple:     ["#dac0f7","#b08bda","#7b3dc2","#4a2574","#180c26"],
							black:      ["#e4e6e7","#a2a7a9","#6e7477","#3d4142","#232526"],
							white:      ["#c0dee5","#cee2e8","#dcf1f7","#e3f5f9","#f9fdff"]
						}
					break

					case "issues":
						return {

						}
					break

					default:
						return null
					break
				}
			}
			catch (error) {logError(error)}
		}

	/* getSchema */
		module.exports.getSchema = getSchema
		function getSchema(index) {
			try {
				switch (index) {
					case "game":
						return {
							id:        null,
							created:   (new Date().getTime()),
							loop:      null,
							observers: {},
							players:   {},
							data: {
								state: {
									start:    false,
									end:      false,
									time:     0,
									election: 1800000,
									name:     null,
									leader:   null,
									term:     0
									issue:    null,
									exists:   true
								},
								treasury: 1000000,
								agencies: {
									s: 50,
									r: 50,
									t: 50,
									m: 50
								},
								constituents: {
									d: {
										population: 0,
										approval:   50
									},
									e: {
										population: 0,
										approval:   50
									},
									f: {
										population: 0,
										approval:   50
									},
									g: {
										population: 0,
										approval:   50
									},
									l: {
										population: 0,
										approval:   50
									}
								},
								members: {},
								rules:   [],
								issues:  []
							},
							past:   [],
							future: []
						}
					break

					case "player":
						return {
							id:         null,
							name:       null,
							created:    (new Date().getTime()),
							connected:  false,
							connection: null
						}
					break

					case "member":
						return {
							id:            null,
							state: {
								leader:    false,
								campaign:  false,
								selection: null,
								reelected: false,
								achieved:  false
							},
							name:     null,
							race:     null,
							ideology: null,
							funds:    1000,
							constituents: {
								d: {
									population: 0,
									approval:   50
								},
								e: {
									population: 0,
									approval:   50
								},
								f: {
									population: 0,
									approval:   50
								},
								g: {
									population: 0,
									approval:   50
								},
								l: {
									population: 0,
									approval:   50
								}
							}
						}
					break

					case "issue":
						return {
							id:          generateRandom(),
							name:        null,
							description: null,
							timeout:     300000,
							intensity:   1,
							options:     []
						}
					break

					case "option":
						return {
							id:          generateRandom(),
							name:        null,
							description: null,
							state: {
								default:  false,
								selected: false,
								votes:    []
							},
							treasury:    0,
							funds:       0,
							agencies: {
								s: 0,
								r: 0,
								t: 0,
								m: 0
							},
							constituents: {
								d: {
									population: 0,
									approval:   0
								},
								e: {
									population: 0,
									approval:   0
								},
								f: {
									population: 0,
									approval:   0
								},
								g: {
									population: 0,
									approval:   0
								},
								l: {
									population: 0,
									approval:   0
								}
							},
							rules:  [],
							issues: []
						}
					break

					case "rule":
						return {
							id:          null,
							name:        null,
							description: null
						}
					break

					default:
						return null
					break
				}
			}
			catch (error) {logError(error)}
		}

/*** checks ***/
	/* isNumLet */
		module.exports.isNumLet = isNumLet
		function isNumLet(string) {
			try {
				return (/^[a-z0-9A-Z_\s]+$/).test(string)
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* isBot */
		module.exports.isBot = isBot
		function isBot(agent) {
			try {
				switch (true) {
					case (typeof agent == "undefined" || !agent):
						return "no-agent"
					break
					
					case (agent.indexOf("Googlebot") !== -1):
						return "Googlebot"
					break
				
					case (agent.indexOf("Google Domains") !== -1):
						return "Google Domains"
					break
				
					case (agent.indexOf("Google Favicon") !== -1):
						return "Google Favicon"
					break
				
					case (agent.indexOf("https://developers.google.com/+/web/snippet/") !== -1):
						return "Google+ Snippet"
					break
				
					case (agent.indexOf("IDBot") !== -1):
						return "IDBot"
					break
				
					case (agent.indexOf("Baiduspider") !== -1):
						return "Baiduspider"
					break
				
					case (agent.indexOf("facebook") !== -1):
						return "Facebook"
					break

					case (agent.indexOf("bingbot") !== -1):
						return "BingBot"
					break

					case (agent.indexOf("YandexBot") !== -1):
						return "YandexBot"
					break

					default:
						return null
					break
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

/*** tools ***/		
	/* renderHTML */
		module.exports.renderHTML = renderHTML
		function renderHTML(request, path, callback) {
			try {
				var html = {}
				fs.readFile(path, "utf8", function (error, file) {
					if (error) {
						logError(error)
						callback("")
					}
					else {
						html.original = file
						html.array = html.original.split(/<script\snode>|<\/script>node>/gi)

						for (html.count = 1; html.count < html.array.length; html.count += 2) {
							try {
								html.temp = eval(html.array[html.count])
							}
							catch (error) {
								html.temp = ""
								logError("<sn>" + Math.ceil(html.count / 2) + "</sn>\n" + error)
							}
							html.array[html.count] = html.temp
						}

						callback(html.array.join(""))
					}
				})
			}
			catch (error) {
				logError(error)
				callback("")
			}
		}

	/* sanitizeString */
		module.exports.sanitizeString = sanitizeString
		function sanitizeString(string) {
			try {
				return string.replace(/[^a-zA-Z0-9_\s\!\@\#\$\%\^\&\*\(\)\+\=\-\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]/gi, "")
			}
			catch (error) {
				logError(error)
				return ""
			}
		}

	/* duplicateObject */
		module.exports.duplicateObject = duplicateObject
		function duplicateObject(object) {
			try {
				return JSON.parse(JSON.stringify(object))
			}
			catch (error) {
				logError(error)
				return null
			}
		}

/*** randoms ***/
	/* generateRandom */
		module.exports.generateRandom = generateRandom
		function generateRandom(set, length) {
			try {
				set = set || "0123456789abcdefghijklmnopqrstuvwxyz"
				length = length || 32
				
				var output = ""
				for (var i = 0; i < length; i++) {
					output += (set[Math.floor(Math.random() * set.length)])
				}

				if ((/[a-zA-Z]/).test(set)) {
					while (!(/[a-zA-Z]/).test(output[0])) {
						output = (set[Math.floor(Math.random() * set.length)]) + output.substring(1)
					}
				}

				return output
			}
			catch (error) {
				logError(error)
				return null
			}
		}

	/* chooseRandom */
		module.exports.chooseRandom = chooseRandom
		function chooseRandom(options) {
			try {
				if (!Array.isArray(options)) {
					return false
				}
				else {
					return options[Math.floor(Math.random() * options.length)]
				}
			}
			catch (error) {
				logError(error)
				return false
			}
		}

	/* sortRandom */
		module.exports.sortRandom = sortRandom
		function sortRandom(array) {
			try {
				// duplicate array
					var output = duplicateObject(array)

				// fisher-yates shuffle
					var x = output.length
					while (x > 0) {
						var y = Math.floor(Math.random() * x)
						x = x - 1
						var temp = output[x]
						output[x] = output[y]
						output[y] = temp
					}

				return output
			}
			catch (error) {
				logError(error)
				return null
			}
		}

/*** database ***/
	/* determineSession */
		module.exports.determineSession = determineSession
		function determineSession(request, callback) {
			try {
				if (isBot(request.headers["user-agent"])) {
					request.session = null
				}
				else if (!request.cookie.session || request.cookie.session == null || request.cookie.session == 0) {
					request.session = {
						id: generateRandom(),
						updated: new Date().getTime(),
						info: {
							"ip":         request.ip,
				 			"user-agent": request.headers["user-agent"],
				 			"language":   request.headers["accept-language"],
						}
					}
				}
				else {
					request.session = {
						id: request.cookie.session,
						updated: new Date().getTime(),
						info: {
							"ip":         request.ip,
				 			"user-agent": request.headers["user-agent"],
				 			"language":   request.headers["accept-language"],
						}
					}
				}

				callback()
			}
			catch (error) {
				logError(error)
				callback(false)
			}
		}
