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
						return '<link href="https://fonts.googleapis.com/css?family=Cherry+Swash" rel="stylesheet">'
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
								'		--font: "Cherry Swash", fantasy;\n' +
								'		--borderRadius: 10px;\n' +
										cssColors +
								'	}')
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
								plural:      "goblins",
								altsingular: "goblin",
								altplural:   "goblins",
								short:       "g"
							},
							{
								singular:    "lizardperson",
								plural:      "lizardfolk",
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

					case "realms":
						return ["Caledonia", "Faerponia", "People's Republic of Democracy", "Carasune", "Laige", "Beltoc", "Edilar", "Corano", "Ariule", "Seraveru", "Seltin", "Strelt", "Ocrano", "Hovalith", "Rescoth", "Nadroc", "Anago", "Pexis", "Quaris", "Bellun", "Venemith", "Hogate", "Isk", "Lisbith", "Tringe", "Orenth", "Ain", "Meleth", "Mullwood", "Aloonic Republic", "Torstonia", "Cotyllia", "Uzia Confederacy", "Hydris States", "Marle", "Precine Republic", "Priosian Alliance", "States of Phaleed", "Ivenin Confederacy"]
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

					case "flags":
						return [
							{"fieldHue":"magenta","fieldShade":1,"structure":"wedge-stripes","sectionCount":4,"sectionFactor":2,"sectionRotation":45,"primaryHue":"magenta","primaryShade":1,"secondaryHue":"bluegray","secondaryShade":0,"tertiaryHue":"bluegray","tertiaryShade":0,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"septagon","sealHue":"magenta","sealShade":1,"sealSize":150,"sealLayers":2,"sealRotation":270,"sealPositions":["0,8","8,8","1,7","7,7","2,6","6,6","3,5","5,5","4,4","3,3","5,3","2,2","6,2","1,1","7,1","0,0","8,0","4,8","4,7","4,6","4,5","0,4","1,4","2,4","3,4","5,4","6,4","7,4","8,4","4,3","4,2","4,1","4,0"],"ring":"none","ringHue":"transparent","ringShade":0,"ringCount":0,"ringSize":0,"ringRadius":0,"ringRotation":0,"ringPositions":[],"emblem":"teardrop","emblemHue":"bluegray","emblemShade":0,"emblemSize":100,"emblemRotation":0,"emblemPositions":["0,8","8,8","1,7","7,7","2,6","6,6","3,5","5,5","4,4","3,3","5,3","2,2","6,2","1,1","7,1","0,0","8,0","4,8","4,7","4,6","4,5","0,4","1,4","2,4","3,4","5,4","6,4","7,4","8,4","4,3","4,2","4,1","4,0"]},
							{"fieldHue":"green","fieldShade":3,"structure":"horizontal-stripes","sectionCount":5,"sectionFactor":3,"sectionRotation":326,"primaryHue":"green","primaryShade":3,"secondaryHue":"green","secondaryShade":3,"tertiaryHue":"white","tertiaryShade":3,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"transparent","sealShade":0,"sealSize":0,"sealLayers":0,"sealRotation":0,"sealPositions":[],"ring":"none","ringHue":"transparent","ringShade":0,"ringCount":0,"ringSize":0,"ringRadius":0,"ringRotation":0,"ringPositions":[],"emblem":"burst","emblemHue":"purple","emblemShade":3,"emblemSize":200,"emblemRotation":0,"emblemPositions":["7,7","6,6","5,5","4,4","3,3","2,2","1,1"]},
							{"fieldHue":"transparent","fieldShade":4,"structure":"wedge-stripes","sectionCount":16,"sectionFactor":4,"sectionRotation":0,"primaryHue":"bluegray","primaryShade":4,"secondaryHue":"cyan","secondaryShade":4,"tertiaryHue":"transparent","tertiaryShade":4,"quarternaryHue":"transparent","quarternaryShade":1,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"cyan","sealShade":4,"sealSize":150,"sealLayers":1,"sealRotation":315,"sealPositions":["0,6","2,6","4,6","6,6","1,5","3,5","5,5","0,4","2,4","4,4","6,4","1,3","3,3","5,3","0,2","2,2","4,2","6,2","1,1","3,1","5,1","0,0","2,0","4,0","6,0"],"ring":"none","ringHue":"bluegray","ringShade":4,"ringCount":3,"ringSize":100,"ringRadius":50,"ringRotation":270,"ringPositions":["0,6","2,6","4,6","6,6","1,5","3,5","5,5","0,4","2,4","4,4","6,4","1,3","3,3","5,3","0,2","2,2","4,2","6,2","1,1","3,1","5,1","0,0","2,0","4,0","6,0"],"emblem":"flower","emblemHue":"bluegray","emblemShade":2,"emblemSize":150,"emblemRotation":0,"emblemPositions":["0,8","2,8","4,8","6,8","8,8","1,7","3,7","5,7","7,7","0,6","2,6","4,6","6,6","8,6","1,5","3,5","5,5","7,5","0,4","2,4","4,4","6,4","8,4","1,3","3,3","5,3","7,3","0,2","2,2","4,2","6,2","8,2","1,1","3,1","5,1","7,1","0,0","2,0","4,0","6,0","8,0"]},
							{"fieldHue":"orange","fieldShade":2,"structure":"cross","sectionCount":3,"sectionFactor":0,"sectionRotation":0,"primaryHue":"bluegray","primaryShade":1,"secondaryHue":"white","secondaryShade":1,"tertiaryHue":"beige","tertiaryShade":2,"quarternaryHue":"purple","quarternaryShade":2,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"white","sealShade":4,"sealSize":150,"sealLayers":2,"sealRotation":270,"sealPositions":["3,3"],"ring":"none","ringHue":"bluegray","ringShade":1,"ringCount":13,"ringSize":100,"ringRadius":50,"ringRotation":270,"ringPositions":["3,3"],"emblem":"none","emblemHue":"white","emblemShade":4,"emblemSize":200,"emblemRotation":300,"emblemPositions":["3,3"]},
							{"fieldHue":"cyan","fieldShade":3,"structure":"horizontal-stripes","sectionCount":3,"sectionFactor":10,"sectionRotation":90,"primaryHue":"cyan","primaryShade":3,"secondaryHue":"black","secondaryShade":4,"tertiaryHue":"transparent","tertiaryShade":4,"quarternaryHue":"transparent","quarternaryShade":4,"quintaryHue":"transparent","quintaryShade":0,"seal":"compass","sealHue":"cyan","sealShade":0,"sealSize":150,"sealLayers":1,"sealRotation":0,"sealPositions":["3,3","4,3","5,3","3,4","4,4","5,4","3,5","4,5","5,5"],"ring":"none","ringHue":"cyan","ringShade":0,"ringCount":14,"ringSize":100,"ringRadius":150,"ringRotation":90,"ringPositions":["2,4","3,4","4,4","2,3","3,3","4,3","2,2","3,2","4,2"],"emblem":"trapezoid","emblemHue":"transparent","emblemShade":2,"emblemSize":250,"emblemRotation":0,"emblemPositions":["2,4","3,4","4,4","2,3","3,3","4,3","2,2","3,2","4,2"]},
							{"fieldHue":"blue","fieldShade":4,"structure":"checkers","sectionCount":9,"sectionFactor":5,"sectionRotation":0,"primaryHue":"blue","primaryShade":1,"secondaryHue":"orange","secondaryShade":0,"tertiaryHue":"browngray","tertiaryShade":1,"quarternaryHue":"orange","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"orange","sealShade":0,"sealSize":100,"sealLayers":1,"sealRotation":315,"sealPositions":[],"ring":"none","ringHue":"browngray","ringShade":1,"ringCount":18,"ringSize":200,"ringRadius":250,"ringRotation":90,"ringPositions":[],"emblem":"none","emblemHue":"blue","emblemShade":0,"emblemSize":100,"emblemRotation":0,"emblemPositions":[]},
							{"fieldHue":"beige","fieldShade":0,"structure":"vertical-stripes","sectionCount":12,"sectionFactor":-2,"sectionRotation":270,"primaryHue":"blue","primaryShade":2,"secondaryHue":"red","secondaryShade":1,"tertiaryHue":"orange","tertiaryShade":4,"quarternaryHue":"blue","quarternaryShade":2,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"red","sealShade":1,"sealSize":250,"sealLayers":2,"sealRotation":90,"sealPositions":["1,3"],"ring":"none","ringHue":"red","ringShade":1,"ringCount":11,"ringSize":200,"ringRadius":250,"ringRotation":315,"ringPositions":["1,3"],"emblem":"none","emblemHue":"beige","emblemShade":0,"emblemSize":50,"emblemRotation":330,"emblemPositions":["1,3"]},
							{"fieldHue":"orange","fieldShade":0,"structure":"diamond","sectionCount":1,"sectionFactor":0,"sectionRotation":90,"primaryHue":"cyan","primaryShade":4,"secondaryHue":"orange","secondaryShade":1,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"orange","quarternaryShade":1,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"cyan","sealShade":4,"sealSize":150,"sealLayers":2,"sealRotation":0,"sealPositions":["3,3"],"ring":"none","ringHue":"orange","ringShade":0,"ringCount":6,"ringSize":250,"ringRadius":100,"ringRotation":270,"ringPositions":["3,3"],"emblem":"arrow","emblemHue":"transparent","emblemShade":4,"emblemSize":250,"emblemRotation":330,"emblemPositions":["3,3"]},
							{"fieldHue":"bluegray","fieldShade":4,"structure":"jack","sectionCount":4,"sectionFactor":5,"sectionRotation":270,"primaryHue":"bluegray","primaryShade":4,"secondaryHue":"greengray","secondaryShade":0,"tertiaryHue":"brown","tertiaryShade":4,"quarternaryHue":"red","quarternaryShade":1,"quintaryHue":"bluegray","quintaryShade":4,"seal":"none","sealHue":"green","sealShade":0,"sealSize":100,"sealLayers":2,"sealRotation":90,"sealPositions":[],"ring":"none","ringHue":"green","ringShade":0,"ringCount":14,"ringSize":250,"ringRadius":250,"ringRotation":270,"ringPositions":[],"emblem":"diamond","emblemHue":"green","emblemShade":0,"emblemSize":200,"emblemRotation":0,"emblemPositions":[]},
							{"fieldHue":"yellow","fieldShade":1,"structure":"rings","sectionCount":3,"sectionFactor":-3,"sectionRotation":90,"primaryHue":"yellow","primaryShade":1,"secondaryHue":"bluegray","secondaryShade":0,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"purple","sealShade":1,"sealSize":150,"sealLayers":2,"sealRotation":270,"sealPositions":["3,3"],"ring":"none","ringHue":"yellow","ringShade":2,"ringCount":21,"ringSize":50,"ringRadius":100,"ringRotation":315,"ringPositions":["3,3"],"emblem":"diamond","emblemHue":"purple","emblemShade":1,"emblemSize":250,"emblemRotation":0,"emblemPositions":["4,4"]},
							{"fieldHue":"bluegray","fieldShade":1,"structure":"horizontal-stripes","sectionCount":8,"sectionFactor":-1,"sectionRotation":60,"primaryHue":"cerulean","primaryShade":1,"secondaryHue":"greengray","secondaryShade":2,"tertiaryHue":"cerulean","tertiaryShade":1,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"bell","sealHue":"greengray","sealShade":2,"sealSize":50,"sealLayers":2,"sealRotation":0,"sealPositions":[],"ring":"star","ringHue":"bluegray","ringShade":4,"ringCount":5,"ringSize":110,"ringRadius":100,"ringRotation":56,"ringPositions":["2,6","4,4","6,2"],"emblem":"none","emblemHue":"cerulean","emblemShade":1,"emblemSize":200,"emblemRotation":315,"emblemPositions":["3,3"]},
							{"fieldHue":"greengray","fieldShade":4,"structure":"horizontal-stripes","sectionCount":2,"sectionFactor":1,"sectionRotation":135,"primaryHue":"blue","primaryShade":2,"secondaryHue":"greengray","secondaryShade":4,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"white","quarternaryShade":3,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"brown","sealShade":1,"sealSize":100,"sealLayers":1,"sealRotation":180,"sealPositions":["0,6","6,6","1,5","5,5","2,4","4,4","3,3","2,2","4,2","1,1","5,1","0,0","6,0"],"ring":"none","ringHue":"blue","ringShade":3,"ringCount":3,"ringSize":100,"ringRadius":150,"ringRotation":180,"ringPositions":["0,6","6,6","1,5","5,5","2,4","4,4","3,3","2,2","4,2","1,1","5,1","0,0","6,0"],"emblem":"leaf","emblemHue":"white","emblemShade":3,"emblemSize":250,"emblemRotation":0,"emblemPositions":["1,5","3,5","2,6","2,4"]},
							{"fieldHue":"magenta","fieldShade":0,"structure":"vertical-stripes","sectionCount":2,"sectionFactor":0,"sectionRotation":180,"primaryHue":"cyan","primaryShade":4,"secondaryHue":"magenta","secondaryShade":0,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"cyan","quarternaryShade":4,"quintaryHue":"transparent","quintaryShade":0,"seal":"chevron","sealHue":"cyan","sealShade":4,"sealSize":350,"sealLayers":2,"sealRotation":0,"sealPositions":["1,6"],"ring":"none","ringHue":"black","ringShade":4,"ringCount":7,"ringSize":100,"ringRadius":50,"ringRotation":315,"ringPositions":["1,6"],"emblem":"sword","emblemHue":"cyan","emblemShade":4,"emblemSize":200,"emblemRotation":0,"emblemPositions":["1,6"]},
							{"fieldHue":"transparent","fieldShade":3,"structure":"horizontal-stripes","sectionCount":3,"sectionFactor":1,"sectionRotation":0,"primaryHue":"cerulean","primaryShade":3,"secondaryHue":"cerulean","secondaryShade":3,"tertiaryHue":"greengray","tertiaryShade":2,"quarternaryHue":"transparent","quarternaryShade":1,"quintaryHue":"transparent","quintaryShade":0,"seal":"burst","sealHue":"white","sealShade":4,"sealSize":150,"sealLayers":1,"sealRotation":0,"sealPositions":["4,6","2,4","6,4"],"ring":"circle","ringHue":"greengray","ringShade":2,"ringCount":100,"ringSize":250,"ringRadius":80,"ringRotation":0,"ringPositions":["0,1","1,1","2,1","3,1","4,1","5,1","6,1","7,1","8,1"],"emblem":"triangle","emblemHue":"white","emblemShade":4,"emblemSize":547,"emblemRotation":0,"emblemPositions":["4,3","3,2","4,2","5,2","2,1","3,1","4,1","5,1","6,1","1,0","2,0","3,0","4,0","5,0","6,0","7,0"]},
							{"fieldHue":"green","fieldShade":4,"structure":"cross","sectionCount":4,"sectionFactor":-1,"sectionRotation":300,"primaryHue":"green","primaryShade":4,"secondaryHue":"green","secondaryShade":2,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"ring","sealHue":"green","sealShade":2,"sealSize":150,"sealLayers":2,"sealRotation":180,"sealPositions":["7,6","4,4","1,2"],"ring":"none","ringHue":"green","ringShade":4,"ringCount":5,"ringSize":150,"ringRadius":150,"ringRotation":0,"ringPositions":["1,5","5,5","3,3","1,1","5,1"],"emblem":"none","emblemHue":"orange","emblemShade":3,"emblemSize":150,"emblemRotation":0,"emblemPositions":["1,5","5,5","3,3","1,1","5,1"]},
							{"fieldHue":"green","fieldShade":1,"structure":"horizontal-stripes","sectionCount":8,"sectionFactor":-3,"sectionRotation":316,"primaryHue":"blue","primaryShade":4,"secondaryHue":"green","secondaryShade":1,"tertiaryHue":"white","tertiaryShade":1,"quarternaryHue":"blue","quarternaryShade":4,"quintaryHue":"transparent","quintaryShade":0,"seal":"octagon","sealHue":"yellow","sealShade":3,"sealSize":200,"sealLayers":1,"sealRotation":180,"sealPositions":["1,7","7,7","4,4","1,1","7,1"],"ring":"none","ringHue":"greengray","ringShade":2,"ringCount":17,"ringSize":150,"ringRadius":150,"ringRotation":0,"ringPositions":["1,5","5,5","3,3","1,1","5,1"],"emblem":"none","emblemHue":"yellow","emblemShade":3,"emblemSize":150,"emblemRotation":330,"emblemPositions":["1,5","5,5","3,3","1,1","5,1"]},
							{"fieldHue":"bluegray","fieldShade":2,"structure":"checkers","sectionCount":9,"sectionFactor":0,"sectionRotation":0,"primaryHue":"purple","primaryShade":1,"secondaryHue":"transparent","secondaryShade":1,"tertiaryHue":"transparent","tertiaryShade":1,"quarternaryHue":"black","quarternaryShade":3,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"beige","sealShade":0,"sealSize":100,"sealLayers":1,"sealRotation":60,"sealPositions":[],"ring":"none","ringHue":"black","ringShade":3,"ringCount":0,"ringSize":200,"ringRadius":100,"ringRotation":270,"ringPositions":["0,4","1,4","2,4","0,3","1,3","2,3","0,2","1,2","2,2"],"emblem":"arrow","emblemHue":"beige","emblemShade":0,"emblemSize":100,"emblemRotation":45,"emblemPositions":["0,8","1,8","2,8","0,7","1,7","2,7","0,6","1,6","2,6"]},
							{"fieldHue":"white","fieldShade":1,"structure":"solid","sectionCount":1,"sectionFactor":0,"sectionRotation":330,"primaryHue":"blue","primaryShade":2,"secondaryHue":"red","secondaryShade":0,"tertiaryHue":"blue","tertiaryShade":3,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"cross","sealHue":"red","sealShade":0,"sealSize":50,"sealLayers":2,"sealRotation":180,"sealPositions":["0,8","2,8","4,8","6,8","8,8","1,7","3,7","5,7","7,7","0,6","2,6","4,6","6,6","8,6","1,5","3,5","5,5","7,5","0,4","2,4","4,4","6,4","8,4","1,3","3,3","5,3","7,3","0,2","2,2","4,2","6,2","8,2","1,1","3,1","5,1","7,1","0,0","2,0","4,0","6,0","8,0"],"ring":"none","ringHue":"blue","ringShade":2,"ringCount":24,"ringSize":250,"ringRadius":50,"ringRotation":0,"ringPositions":["0,6","2,6","4,6","6,6","1,5","3,5","5,5","0,4","2,4","4,4","6,4","1,3","3,3","5,3","0,2","2,2","4,2","6,2","1,1","3,1","5,1","0,0","2,0","4,0","6,0"],"emblem":"none","emblemHue":"blue","emblemShade":3,"emblemSize":100,"emblemRotation":270,"emblemPositions":["0,6","2,6","4,6","6,6","1,5","3,5","5,5","0,4","2,4","4,4","6,4","1,3","3,3","5,3","0,2","2,2","4,2","6,2","1,1","3,1","5,1","0,0","2,0","4,0","6,0"]},
							{"fieldHue":"brown","fieldShade":2,"structure":"wedge-stripes","sectionCount":12,"sectionFactor":2,"sectionRotation":0,"primaryHue":"brown","primaryShade":2,"secondaryHue":"browngray","secondaryShade":3,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"white","quarternaryShade":2,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"magenta","sealShade":1,"sealSize":50,"sealLayers":1,"sealRotation":300,"sealPositions":["3,5","1,3","5,3","3,1"],"ring":"none","ringHue":"magenta","ringShade":1,"ringCount":19,"ringSize":50,"ringRadius":200,"ringRotation":90,"ringPositions":["3,5","1,3","5,3","3,1"],"emblem":"none","emblemHue":"browngray","emblemShade":3,"emblemSize":150,"emblemRotation":330,"emblemPositions":["3,5","1,3","5,3","3,1"]},
							{"fieldHue":"blue","fieldShade":4,"structure":"horizontal-stripes","sectionCount":6,"sectionFactor":2,"sectionRotation":0,"primaryHue":"black","primaryShade":1,"secondaryHue":"greengray","secondaryShade":2,"tertiaryHue":"black","tertiaryShade":1,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"cerulean","sealShade":2,"sealSize":100,"sealLayers":1,"sealRotation":300,"sealPositions":["3,3"],"ring":"none","ringHue":"cerulean","ringShade":2,"ringCount":9,"ringSize":50,"ringRadius":200,"ringRotation":60,"ringPositions":["3,3"],"emblem":"jack","emblemHue":"blue","emblemShade":4,"emblemSize":250,"emblemRotation":45,"emblemPositions":["4,4"]},
							{"fieldHue":"beige","fieldShade":2,"structure":"diamond","sectionCount":1,"sectionFactor":-3,"sectionRotation":0,"primaryHue":"green","primaryShade":4,"secondaryHue":"black","secondaryShade":0,"tertiaryHue":"black","tertiaryShade":0,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"cerulean","sealShade":2,"sealSize":50,"sealLayers":2,"sealRotation":270,"sealPositions":["4,4"],"ring":"shield","ringHue":"beige","ringShade":2,"ringCount":23,"ringSize":150,"ringRadius":250,"ringRotation":270,"ringPositions":["4,4"],"emblem":"none","emblemHue":"beige","emblemShade":2,"emblemSize":250,"emblemRotation":30,"emblemPositions":["4,4"]},
							{"fieldHue":"cerulean","fieldShade":4,"structure":"x","sectionCount":4,"sectionFactor":-3,"sectionRotation":180,"primaryHue":"red","primaryShade":2,"secondaryHue":"red","secondaryShade":2,"tertiaryHue":"white","tertiaryShade":4,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"greengray","sealShade":3,"sealSize":250,"sealLayers":1,"sealRotation":90,"sealPositions":["3,3"],"ring":"none","ringHue":"red","ringShade":2,"ringCount":9,"ringSize":250,"ringRadius":200,"ringRotation":0,"ringPositions":["3,3"],"emblem":"none","emblemHue":"red","emblemShade":2,"emblemSize":50,"emblemRotation":315,"emblemPositions":["3,3"]},
							{"fieldHue":"blue","fieldShade":1,"structure":"cross","sectionCount":2,"sectionFactor":3,"sectionRotation":0,"primaryHue":"transparent","primaryShade":0,"secondaryHue":"black","secondaryShade":4,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"red","sealShade":0,"sealSize":200,"sealLayers":1,"sealRotation":60,"sealPositions":["4,4"],"ring":"chevron","ringHue":"white","ringShade":4,"ringCount":21,"ringSize":200,"ringRadius":200,"ringRotation":0,"ringPositions":["4,4"],"emblem":"none","emblemHue":"black","emblemShade":4,"emblemSize":150,"emblemRotation":300,"emblemPositions":["4,4"]},
							{"fieldHue":"cerulean","fieldShade":3,"structure":"rings","sectionCount":10,"sectionFactor":-6,"sectionRotation":90,"primaryHue":"yellow","primaryShade":1,"secondaryHue":"orange","secondaryShade":3,"tertiaryHue":"yellow","tertiaryShade":1,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"green","sealShade":0,"sealSize":100,"sealLayers":1,"sealRotation":30,"sealPositions":["3,3"],"ring":"none","ringHue":"orange","ringShade":3,"ringCount":22,"ringSize":150,"ringRadius":100,"ringRotation":0,"ringPositions":["3,3"],"emblem":"none","emblemHue":"magenta","emblemShade":2,"emblemSize":250,"emblemRotation":180,"emblemPositions":["3,3"]},
							{"fieldHue":"orange","fieldShade":0,"structure":"jack","sectionCount":3,"sectionFactor":2,"sectionRotation":33.333,"primaryHue":"browngray","primaryShade":3,"secondaryHue":"orange","secondaryShade":0,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"greengray","sealShade":0,"sealSize":50,"sealLayers":2,"sealRotation":90,"sealPositions":[],"ring":"none","ringHue":"browngray","ringShade":3,"ringCount":18,"ringSize":200,"ringRadius":100,"ringRotation":270,"ringPositions":[],"emblem":"burst","emblemHue":"greengray","emblemShade":2,"emblemSize":150,"emblemRotation":0,"emblemPositions":[]},
							{"fieldHue":"black","fieldShade":4,"structure":"wedge-stripes","sectionCount":6,"sectionFactor":4,"sectionRotation":330,"primaryHue":"transparent","primaryShade":3,"secondaryHue":"black","secondaryShade":4,"tertiaryHue":"yellow","tertiaryShade":3,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"transparent","sealShade":0,"sealSize":0,"sealLayers":0,"sealRotation":0,"sealPositions":[],"ring":"cat","ringHue":"red","ringShade":3,"ringCount":20,"ringSize":150,"ringRadius":150,"ringRotation":270,"ringPositions":["4,4"],"emblem":"none","emblemHue":"transparent","emblemShade":0,"emblemSize":0,"emblemRotation":0,"emblemPositions":[]},
							{"fieldHue":"red","fieldShade":2,"structure":"cross","sectionCount":4,"sectionFactor":-3,"sectionRotation":90,"primaryHue":"white","primaryShade":2,"secondaryHue":"transparent","secondaryShade":0,"tertiaryHue":"white","tertiaryShade":0,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"dodecagon","sealHue":"cyan","sealShade":2,"sealSize":100,"sealLayers":1,"sealRotation":90,"sealPositions":["4,6","2,4","6,4","4,2"],"ring":"none","ringHue":"transparent","ringShade":0,"ringCount":0,"ringSize":0,"ringRadius":0,"ringRotation":0,"ringPositions":[],"emblem":"none","emblemHue":"transparent","emblemShade":0,"emblemSize":0,"emblemRotation":0,"emblemPositions":[]},
							{"fieldHue":"orange","fieldShade":1,"structure":"horizontal-stripes","sectionCount":6,"sectionFactor":-1,"sectionRotation":0,"primaryHue":"transparent","primaryShade":1,"secondaryHue":"brown","secondaryShade":4,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"cerulean","quarternaryShade":4,"quintaryHue":"orange","quintaryShade":3,"seal":"none","sealHue":"transparent","sealShade":0,"sealSize":0,"sealLayers":0,"sealRotation":0,"sealPositions":[],"ring":"none","ringHue":"transparent","ringShade":0,"ringCount":0,"ringSize":0,"ringRadius":0,"ringRotation":0,"ringPositions":[],"emblem":"heart","emblemHue":"orange","emblemShade":1,"emblemSize":50,"emblemRotation":0,"emblemPositions":["1,7","7,7","4,4","1,1","7,1"]},
							{"fieldHue":"transparent","fieldShade":2,"structure":"checkers","sectionCount":36,"sectionFactor":1,"sectionRotation":0,"primaryHue":"cerulean","primaryShade":0,"secondaryHue":"beige","secondaryShade":3,"tertiaryHue":"blue","tertiaryShade":3,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"transparent","sealShade":0,"sealSize":0,"sealLayers":0,"sealRotation":0,"sealPositions":[],"ring":"none","ringHue":"transparent","ringShade":0,"ringCount":0,"ringSize":0,"ringRadius":0,"ringRotation":0,"ringPositions":[],"emblem":"none","emblemHue":"transparent","emblemShade":0,"emblemSize":0,"emblemRotation":0,"emblemPositions":[]},
							{"fieldHue":"black","fieldShade":4,"structure":"x","sectionCount":4,"sectionFactor":3,"sectionRotation":0,"primaryHue":"red","primaryShade":4,"secondaryHue":"red","secondaryShade":3,"tertiaryHue":"red","tertiaryShade":4,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"transparent","sealShade":0,"sealSize":0,"sealLayers":0,"sealRotation":0,"sealPositions":[],"ring":"none","ringHue":"transparent","ringShade":0,"ringCount":0,"ringSize":0,"ringRadius":0,"ringRotation":0,"ringPositions":[],"emblem":"none","emblemHue":"transparent","emblemShade":0,"emblemSize":0,"emblemRotation":0,"emblemPositions":[]}
						]
					break

					case "issues":
						return {
							repeal:    ["term-limits", "term-length", "no-tabling", "quick-voting", "majority-threshold", "absentee-voting", "leader-presence", "balanced-budget", "no-abstentions", "impartial-leader", "tiebreaker-leader", "kickback-ban", "donation-ban", "restricted-press", "secret-voting", "lower-age", "maximum-age", "felon-disenfranchisement", "poll-tax", "height-restrictions", "delayed-elections", "snap-elections", "no-consecutives", "no-self", "short-season", "executive-decision", "accurate-polling", "accurate-estimates", "financial-disclosure", "Whitesea Coast", "Firestorm Coast"],
							violence:  [],
							rebellion: [],
							austerity: [],
							effects:   [],
							small:     [],
							medium:    [],
							large:     []
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
									term:     0,
									issue:    null,
									cooldown: 0,
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
							type:        null,
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
