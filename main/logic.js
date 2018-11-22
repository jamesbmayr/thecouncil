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
					// site components
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
							// colors
								var colors = getAsset("colors")
								var cssColors = ""
								for (var hue in colors) {
									for (var shade in colors[hue]) {
										cssColors += "		--" + hue + "-" + shade + ": " + colors[hue][shade] + ";\n"
									}
								}

							// races
								var races = getAsset("races")
								for (var r in races) {
									cssColors += "		--race-" + races[r].short + ": " + races[r].color + ";\n"
								}

							// agencies
								var agencies = getAsset("agencies")
								for (var a in agencies) {
									cssColors += "		--agency-" + agencies[a].short + ": " + agencies[a].color + ";\n"
								}
							
							// data
								return ('/*** variables ***/\n' +
										'	:root {\n' +
										'		--font: "Cherry Swash", fantasy;\n' +
										'		--borderRadius: 10px;\n' +
												cssColors +
										'	}')
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

					// flag components
						case "symbols":
							return {
								none:           null,
								circle:         null,
								ring:           null,
								triangle: 		"50% 7%, 0% 93%, 100% 93%",
								square: 		"0% 0%, 100% 0%, 100% 100%, 0% 100%",
								diamond: 		"50% 0%, 100% 50%, 50% 100%, 0% 50%",
								parallelogram: 	"25% 0%, 100% 0%, 75% 100%, 0% 100%",
								rectangle: 		"0% 20%, 100% 20%, 100% 80%, 0% 80%",
								trapezoid: 		"20% 0%, 80% 0%, 100% 100%, 0% 100%",
								pentagon: 		"50% 1.5%, 100% 38%, 81% 96.5%, 19% 96.5%, 0% 38%",
								hexagon: 		"50% 0%, 93.5% 25%, 93.5% 75%, 50% 100%, 6.5% 75%, 6.5% 25%",
								septagon: 		"50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%",
								octagon: 		"30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%",
								nonagon: 		"50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%",
								decagon: 		"50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%",
								dodecagon: 		"38% 5%, 62% 5%, 82.5% 17.5%, 95% 38%, 95% 62%, 82.5% 82.5%, 62% 95%, 38% 95%, 17.5% 82.5%, 5% 62%, 5% 38%, 17.5% 17.5%",
								star: 			"50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%",
								chevron: 		"50% 0%, 100% 100%, 50% 75%, 0 100%",
								plus: 			"0% 33%, 33% 33%, 33% 0%, 67% 0%, 67% 33%, 100% 33%, 100% 67%, 67% 67%, 67% 100%, 33% 100%, 33% 67%, 0% 67%",
								cross: 			"40% 40%, 40% -150%, 60% -150%, 60% 40%, 250% 40%, 250% 60%, 60% 60%, 60% 250%, 40% 250%, 40% 60%, -150% 60%, -150% 40%, 40% 40%",
								x: 				"-170% -150%, -150% -170%, 50% 30%, 250% -170%, 270% -150%, 70% 50%, 270% 250%, 250% 270%, 50% 70%, -150% 270%, -170% 250%, 30% 50%",
								jack:           "-170% -150%, -150% -170%, 50% 30%, 250% -170%, 270% -150%, 70% 50%, 270% 250%, 250% 270%, 50% 70%, -150% 270%, -170% 250%, 30% 50%, 40% 40%, 40% -150%, 60% -150%, 60% 40%, 250% 40%, 250% 60%, 60% 60%, 60% 250%, 40% 250%, 40% 60%, -150% 60%, -150% 40%, 40% 40%, 30% 50%",
								arrow: 			"100% 50%, 67% 50%, 67% 100%, 33% 100%, 33% 50%, 0% 50%, 50% 0%",	
								rabbit: 		"29% 6%, 30% 13%, 30% 18%, 30% 23%, 30% 30%, 31% 36%, 34% 42%, 36% 49%, 34% 57%, 31% 65%, 30% 72%, 31% 80%, 34% 86%, 39% 90%, 45% 94%, 50% 95%, 55% 94%, 61% 90%, 66% 86%, 69% 80%, 70% 72%, 69% 65%, 66% 57%, 64% 49%, 66% 42%, 69% 36%, 70% 30%, 70% 23%, 70% 18%, 70% 13%, 71% 6%, 70.5% 5%, 69.5% 4%, 69% 4%, 66% 7%, 64% 11%, 61% 18%, 57% 27%, 56% 32%, 55% 39%, 54% 45%, 53% 44.5%, 50% 44%, 47% 44.5%, 46% 45%, 45% 39%, 44% 32%, 43% 27%, 39% 18%, 36% 11%, 34% 7%, 31% 4%, 30.5% 4%, 29.5% 5%",
								cat: 			"24% 10%, 17% 38%, 13% 46%, 13% 57%, 17% 65%, 25% 74%, 35% 82%, 47% 85%, 53% 85%, 65% 82%, 75% 74%, 83% 65%, 87% 57%, 87% 46%, 83% 38%, 76% 10%, 60% 31%, 40% 31%",
								dog: 			"46% 19%, 54% 19%, 57.75% 20%, 58% 19.5%, 60% 18.25%, 61% 18%, 74% 19.5%, 85% 18%, 88% 20%, 89.75% 22%, 87% 40%, 88% 54%, 87% 57%, 85% 58%, 81.75% 57.5%, 78.5% 55%, 79% 59%, 78.5% 62%, 71% 77%, 70% 80%, 69% 84%, 67% 87%, 64% 88.5%, 62% 88.8%, 61% 89%, 56% 88%, 50.13% 90.05% , 44% 88%, 39% 89%, 38% 88.8%, 36% 88.5%, 33% 87%, 31% 84%, 30% 80%, 29% 77%, 21.5% 62%, 21% 59%, 21.5% 55%, 19.25% 57.5%, 15% 58%, 13% 57%, 12% 54%, 13% 40%, 10.25% 22%, 12% 20%, 15% 18%, 26% 19.5%, 39% 18%, 40% 18.25%, 42% 19.5%, 42.25% 20%",
								heart:          "50% 100%, 16.61% 71.68%, 5.85% 59.18%, 1.27% 48.73%, 0% 39.24%, 1.27% 28.64%, 5.7% 16.93%, 13.45% 8.23%, 22.63% 4.59%, 32.28% 4.59%, 39.56% 7.12%, 43.99% 10.92%, 45.89% 14.08%, 47.78% 18.2%, 49.21% 22.94%, 49.68% 25%, 50% 27%, 50.32% 25%, 50.79% 22.94%, 52.22% 18.2%, 54.11% 14.08%, 56.01% 10.92%, 60.44% 7.12%, 67.72% 4.59%, 77.37% 4.59%, 86.55% 8.23%, 94.3% 16.93%, 98.73% 28.64%, 100% 39.24%, 98.73% 48.73%, 94.15% 59.18%, 83.39% 71.68%",
								snowflake:      "50% 50%, 47.83% 42.35%, 35.19% 39.25%, 31.02% 34.11%, 26.43% 35.11%, 15.13% 29.68%, 12.38% 24.63%, 7.21% 26.95%, 8.02% 32.52%, 13.7% 32.15%, 24.53% 38.4%, 26.25% 42.68%, 32.7% 43.86%, 42.6% 52.67%, 50% 50%, 42.29% 48.05%, 33.29% 57.45%, 26.75% 58.49%, 25.32% 62.97%, 14.97% 70.04%, 9.22% 69.89%, 8.64% 75.53%, 13.87% 77.62%, 16.39% 72.51%, 27.22% 66.26%, 31.79% 66.91%, 36.03% 61.91%, 48.61% 57.74%, 50% 50%, 44.46% 55.7%, 48.1% 68.2%, 45.73% 74.38%, 48.89% 77.86%, 49.84% 90.36%, 46.84% 95.26%, 51.43% 98.58%, 55.85% 95.1%, 52.69% 90.36%, 52.69% 77.86%, 55.54% 74.23%, 53.33% 68.05%, 56.01% 55.07%, 50% 50%, 52.17% 57.65%, 64.81% 60.75%, 68.98% 65.89%, 73.57% 64.89%, 84.87% 70.32%, 87.62% 75.37%, 92.79% 73.05%, 91.98% 67.48%, 86.3% 67.85%, 75.47% 61.6%, 73.75% 57.32%, 67.3% 56.14%, 57.4% 47.33%, 50% 50%, 57.71% 51.95%, 66.71% 42.55%, 73.25% 41.51%, 74.68% 37.03%, 85.03% 29.96%, 90.78% 30.11%, 91.36% 24.47%, 86.13% 22.38%, 83.61% 27.49%, 72.78% 33.74%, 68.21% 33.09%, 63.97% 38.09%, 51.39% 42.26%, 50% 50%, 55.54% 44.3%, 51.9% 31.8%, 54.27% 25.62%, 51.11% 22.14%, 50.16% 9.64%, 53.16% 4.74%, 48.57% 1.42%, 44.14% 4.9%, 47.31% 9.64%, 47.31% 22.14%, 44.46% 25.78%, 46.67% 31.95%, 43.99% 44.93%",
								teardrop:       "50% 0%, 61.55% 24.37%, 73.89% 50.32%, 79.43% 66.3%, 80.7% 73.73%, 79.75% 80.54%, 76.74% 86.87%, 72.31% 91.93%, 65.98% 96.2%, 57.91% 98.89%, 50% 100%, 42.09% 98.89%, 34.02% 96.2%, 27.69% 91.93%, 23.26% 86.87%, 20.25% 80.54%, 19.3% 73.73%, 20.57% 66.3%, 26.11% 50.32%, 38.45% 24.37%",
								burst:          "45% 35%, 50% 0%, 55% 35%, 51.12% 34.23%, 69.13% 3.81%, 60.36% 38.06%, 57.07% 35.86%, 85.35% 14.65%, 64.14% 42.93%, 61.94% 39.64%, 96.19% 30.87%, 65.77% 48.88%, 65% 45%, 99.99% 50%, 65% 55%, 65.77% 51.12%, 96.18% 69.13%, 61.94% 60.36%, 64.14% 57.07%, 85.34% 85.35%, 57.07% 64.14%, 60.36% 61.94%, 69.12% 96.18%, 51.12% 65.77%, 55% 65%, 49.99% 99.98%, 45% 65%, 48.88% 65.77%, 30.86% 96.17%, 39.64% 61.94%, 42.93% 64.14%, 14.65% 85.33%, 35.86% 57.07%, 38.06% 60.36%, 3.82% 69.11%, 34.23% 51.12%, 35% 55%, 0.02% 49.98%, 35% 45%, 34.23% 48.88%, 3.83% 30.86%, 38.06% 39.64%, 35.86% 42.93%, 14.67% 14.65%, 42.93% 35.86%, 39.64% 38.06%, 30.89% 3.82%, 48.88% 34.23%",
								compass:        "45% 35%, 50% 0%, 55% 35%, 57.07% 35.86%, 85.35% 14.65%, 64.14% 42.93%, 65% 45%, 99.99% 50%, 65% 55%, 64.14% 57.07%, 85.34% 85.35%, 57.07% 64.14%, 55% 65%, 49.99% 99.98%, 45% 65%, 42.93% 64.14%, 14.65% 85.33%, 35.86% 57.07%, 35% 55%, 0.02% 49.98%, 35% 45%, 35.86% 42.93%, 15.98% 14.4%, 42.93% 35.86%",
								flower:         "45% 35%, 47.15% 28.96% , 46.36% 24.68%, 45.41% 21.04%, 45.73% 16.93%, 47.31% 12.82%, 50% 10%, 53.48% 12.82%, 55.54% 17.41%, 55.54% 21.04%, 54.43% 24.37%, 53.32% 29.27%, 55% 35%, 51.12% 34.23%, 55.42% 29.47%, 56.33% 25.21%, 56.84% 21.49%, 58.71% 17.81%, 61.74% 14.62%, 65.31% 13.04%, 67.44% 16.98%, 67.59% 22.01%, 66.2% 25.36%, 63.9% 28.02%, 61% 32.12%, 60.36% 38.06%, 57.07% 35.86%, 62.86% 33.11%, 65.33% 29.52%, 67.23% 26.28%, 70.37% 23.59%, 74.39% 21.81%, 78.29% 21.71%, 78.75% 26.17%, 76.96% 30.87%, 74.4% 33.44%, 71.25% 35.01%, 67.01% 37.69%, 64.14% 42.93%, 61.94% 39.64%, 68.34% 39.32%, 72% 36.95%, 75% 34.68%, 78.93% 33.4%, 83.32% 33.29%, 86.96% 34.69%, 85.68% 38.99%, 82.23% 42.64%, 78.88% 44.04%, 75.37% 44.28%, 70.43% 45.14%, 65.77% 48.88%, 65% 45%, 71.03% 47.15%, 75.32% 46.36%, 78.96% 45.41%, 83.08% 45.73%, 87.18% 47.31%, 90.01% 50%, 87.18% 53.48%, 82.59% 55.53%, 78.96% 55.55%, 75.63% 54.42%, 70.73% 53.33%, 65% 55%, 65.77% 51.12%, 70.52% 55.41%, 74.79% 56.33%, 78.51% 56.84%, 82.2% 58.71%, 85.38% 61.74%, 86.96% 65.31%, 83.02% 67.44%, 77.99% 67.58%, 74.63% 66.21%, 71.99% 63.89%, 67.88% 61.01%, 61.94% 60.36%, 64.14% 57.07%, 66.89% 62.85%, 70.48% 65.33%, 73.72% 67.23%, 76.42% 70.37%, 78.19% 74.39%, 78.29% 78.29%, 73.83% 78.75%, 69.13% 76.95%, 66.55% 74.4%, 65% 71.25%, 62.31% 67.01%, 57.07% 64.14%, 60.36% 61.94%, 60.69% 68.34%, 63.05% 72%, 65.32% 75%, 66.61% 78.93%, 66.71% 83.32%, 65.31% 86.96%, 61.01% 85.68%, 57.36% 82.22%, 55.95% 78.88%, 55.73% 75.37%, 54.86% 70.43%, 51.12% 65.77%, 55% 65%, 52.86% 71.03%, 53.64% 75.32%, 54.59% 78.96%, 54.27% 83.08%, 52.69% 87.18%, 50% 90.01%, 46.52% 87.18%, 44.47% 82.58%, 44.45% 78.96%, 45.59% 75.63%, 46.67% 70.73%, 45% 65%, 48.88% 65.77%, 44.59% 70.52%, 43.67% 74.79%, 43.16% 78.51%, 41.29% 82.2%, 38.26% 85.38%, 34.69% 86.96%, 32.56% 83.02%, 32.42% 77.98%, 33.79% 74.63%, 36.12% 71.99%, 38.99% 67.88%, 39.64% 61.94%, 42.93% 64.14%, 37.15% 66.89%, 34.67% 70.48%, 32.77% 73.72%, 29.63% 76.42%, 25.61% 78.19%, 21.71% 78.29%, 21.25% 73.83%, 23.05% 69.12%, 25.6% 66.55%, 28.76% 65%, 32.99% 62.31%, 35.86% 57.07%, 38.06% 60.36%, 31.66% 60.69%, 28% 63.05%, 25% 65.32%, 21.07% 66.61%, 16.68% 66.71%, 13.04% 65.31%, 14.32% 61.01%, 17.78% 57.35%, 21.12% 55.95%, 24.64% 55.73%, 29.57% 54.86%, 34.23% 51.12%, 35% 55%, 28.97% 52.86%, 24.68% 53.64%, 21.04% 54.59%, 16.92% 54.27%, 12.82% 52.69%, 9.99% 50%, 12.82% 46.52%, 17.42% 44.46%, 21.04% 44.45%, 24.38% 45.59%, 29.27% 46.67%, 35% 45%, 34.23% 48.88%, 29.48% 44.59%, 25.21% 43.67%, 21.49% 43.16%, 17.8% 41.29%, 14.62% 38.26%, 13.04% 34.69%, 16.98% 32.56%, 22.02% 32.41%, 25.37% 33.79%, 28.02% 36.12%, 32.12% 38.99%, 38.06% 39.64%, 35.86% 42.93%, 33.11% 37.15%, 29.52% 34.67%, 26.28% 32.77%, 23.58% 29.63%, 21.81% 25.61%, 21.71% 21.71%, 26.17% 21.25%, 30.88% 23.04%, 33.45% 25.6%, 35% 28.77%, 37.69% 32.99%, 42.93% 35.86%, 39.64% 38.06%, 39.31% 31.66%, 36.95% 28%, 34.68% 25%, 33.39% 21.07%, 33.29% 16.68%, 34.69% 13.04%, 38.99% 14.32%, 42.65% 17.78%, 44.05% 21.12%, 44.27% 24.65%, 45.14% 29.57%, 48.88% 34.23%",
								leaf:           "50% 8%, 42.88% 24.68%, 34.49% 22.15%, 35.92% 35.76%, 24.05% 27.37%, 24.68% 36.23%, 11.71% 38.92%, 19.94% 46.52%, 13.92% 54.59%, 28.64% 53.64%, 24.05% 61.87%, 48.42% 59.49%, 47.78% 92.25%, 50% 92%, 52.22% 92.25%, 51.58% 59.49%, 75.95% 61.87%, 71.36% 53.64%, 86.08% 54.59%, 80.06% 46.52%, 88.29% 38.92%, 75.32% 36.23%, 75.95% 27.37%, 64.08% 35.76%, 65.51% 22.15%, 57.12% 24.68%",
								shield:         "50% 3%, 43.83% 5.86%, 34.02% 7.92%, 27.06% 7.13%, 20.09% 5.7%, 14.24% 4.12%, 11.71% 3.33%, 6.96% 8.39%, 2.37% 20.1%, 1.58% 33.55%, 4.43% 51.75%, 12.66% 66.62%, 19.3% 78.01%, 27.22% 87.66%, 38.45% 94.15%, 50% 97%, 61.55% 94.15%, 72.78% 87.66%, 80.7% 78.01%, 87.34% 66.62%, 95.57% 51.75%, 98.42% 33.55%, 97.63% 20.1%, 93.04% 8.39%, 88.29% 3.33%, 85.76% 4.12%, 79.91% 5.7%, 72.94% 7.13%, 65.98% 7.92%, 56.17% 5.86%",
								sword:          "50% 0%, 48% 15%, 48% 68%, 36% 68%, 33% 66%, 28% 66%, 26% 68%, 25% 70%, 26% 72%, 28% 74%, 33% 74%, 36% 72%, 48% 72%, 48% 87%, 46% 91%, 46% 96%, 48% 99%, 50% 100%, 52% 99%, 54% 96%, 54% 91%, 52% 87%, 52% 72%, 64% 72%, 67% 74%, 72% 74%, 74% 72%, 75% 70%, 74% 68%, 72% 66%, 67% 66%, 64% 68%, 52% 68%, 52% 15%",
								bell:           "50% 8%, 43.35% 9.49%, 38.29% 14.4%, 33.7% 23.26%, 31.65% 34.97%, 28.01% 47.31%, 22.31% 58.7%, 16.46% 67.56%, 9.97% 72.31%, 3.64% 74.84%, 1.27% 77.06%, 0.47% 79.75%, 1.42% 80.7%, 4.91% 81.49%, 12.03% 81.33%, 20.41% 81.49%, 28.16% 81.65%, 35.76% 81.65%, 40.98% 82.28%, 44.46% 84.65%, 45.73% 88.13%, 47.63% 90.98%, 50% 92%, 52.37% 90.98%, 54.27% 88.13%, 55.54% 84.65%, 59.02% 82.28%, 64.24% 81.65%, 71.84% 81.65%, 79.59% 81.49%, 87.97% 81.33%, 95.09% 81.49%, 98.58% 80.7%, 99.53% 79.75%, 98.73% 77.06%, 96.36% 74.84%, 90.03% 72.31%, 83.54% 67.56%, 77.69% 58.7%, 71.99% 47.31%, 68.35% 34.97%, 66.3% 23.26%, 61.71% 14.4%, 56.65% 9.49%",
								crescent:       "1% 50%, 3.48% 68.35%, 10.6% 83.23%, 24.84% 94.15%, 37.5% 97.47%, 51.11% 99.05%, 69.94% 97.31%, 80.85% 91.93%, 87.03% 84.97%, 91.77% 78.32%, 92.88% 73.42%, 92.41% 71.04%, 90.19% 69.46%, 87.03% 70.09%, 84.81% 72.78%, 83.07% 75.32%, 79.59% 78.8%, 74.05% 82.12%, 66.77% 84.65%, 58.7% 83.07%, 51.27% 79.43%, 44.78% 73.26%, 41.3% 67.25%, 39.72% 59.18%, 38.61% 50%, 39.72% 40.82%, 41.3% 32.75%, 44.78% 26.74%, 51.27% 20.57%, 58.7% 16.93%, 66.77% 15.35%, 74.05% 17.88%, 79.59% 21.2%, 83.07% 24.68%, 84.81% 27.22%, 87.03% 29.91%, 90.19% 30.54%, 92.41% 28.96%, 92.88% 26.58%, 91.77% 21.68%, 87.03% 15.03%, 80.85% 8.07%, 69.94% 2.69%, 51.11% 0.95%, 37.5% 2.53%, 24.84% 5.85%, 10.6% 16.77%, 3.48% 31.65%"
							}
						break

						case "structures":
							return ["solid", "horizontal-stripes", "vertical-stripes", "wedge-stripes", "diamond", "square", "rings", "x", "cross", "jack", "checkers"]
						break
						case "angles":
							return [0, 0, 0, 0, 30, 45, 60, 90, 90, 180, 180, 270, 270, 300, 315, 330]
						break

						case "positions":
							return [
								["4,4"],
								["4,4"],
								["4,4"],
								["4,4"],
								["0,8","8,8","1,7","7,7","2,6","6,6","3,5","5,5","4,4","3,3","5,3","2,2","6,2","1,1","7,1","0,0","8,0"],
								["4,8","4,7","4,6","4,5","0,4","1,4","2,4","3,4","4,4","5,4","6,4","7,4","8,4","4,3","4,2","4,1","4,0"],
								["0,8","8,8","1,7","7,7","2,6","6,6","3,5","5,5","4,4","3,3","5,3","2,2","6,2","1,1","7,1","0,0","8,0","4,8","4,7","4,6","4,5","0,4","1,4","2,4","3,4","5,4","6,4","7,4","8,4","4,3","4,2","4,1","4,0"],
								["3,5","4,5","5,5","3,4","4,4","5,4","3,3","4,3","5,3"],
								["0,8","2,8","4,8","6,8","8,8","1,7","3,7","5,7","7,7","0,6","2,6","4,6","6,6","8,6","1,5","3,5","5,5","7,5","0,4","2,4","4,4","6,4","8,4","1,3","3,3","5,3","7,3","0,2","2,2","4,2","6,2","8,2","1,1","3,1","5,1","7,1","0,0","2,0","4,0","6,0","8,0"],
								["4,6","3,5","4,5","5,5","2,4","3,4","4,4","5,4","6,4","3,3","4,3","5,3","4,2"],
								["4,6","2,4","4,4","6,4","4,2"],
								["4,6","2,4","6,4","4,2"],
								["0,8","1,8","2,8","3,8","0,7","1,7","2,7","3,7","0,6","1,6","2,6","3,6","0,5","1,5","2,5","3,5"],
								["0,7","0,6","1,6","0,5","1,5","2,5","0,4","1,4","2,4","3,4","0,3","1,3","2,3","0,2","1,2","0,1"],
								["1,6"],
								["1,4"],
								["2,6","6,6","4,4","2,2","6,2"],
								["2,6","6,6","2,2","6,2"],
								["1,7","7,7","4,4","1,1","7,1"],
								["1,7","7,7","1,1","7,1"],
								["1,8","3,8","5,8","7,8","0,7","2,7","4,7","6,7","8,7","1,6","3,6","5,6","7,6","0,5","2,5","4,5","6,5","8,5","1,4","3,4","5,4","7,4","0,3","2,3","4,3","6,3","8,3","1,2","3,2","5,2","7,2","0,1","2,1","4,1","6,1","8,1","1,0","3,0","5,0","7,0"]
							]
						break

						case "flags":
							return [
								{"fieldHue":"cerulean","fieldShade":4,"structure":"horizontal-stripes","sectionCount":3,"sectionFactor":-3,"sectionRotation":0,"primaryHue":"orange","primaryShade":3,"secondaryHue":"white","secondaryShade":4,"tertiaryHue":"transparent","tertiaryShade":0,"quarternaryHue":"transparent","quarternaryShade":4,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"transparent","sealShade":0,"sealSize":0,"sealLayers":0,"sealRotation":0,"sealPositions":[],"ring":"circle","ringHue":"white","ringShade":4,"ringCount":16,"ringSize":50,"ringRadius":600,"ringRotation":0,"ringPositions":["4,4"],"emblem":"compass","emblemHue":"cerulean","emblemShade":4,"emblemSize":150,"emblemRotation":0,"emblemPositions":["4,4"]},
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
								{"fieldHue":"black","fieldShade":4,"structure":"x","sectionCount":4,"sectionFactor":3,"sectionRotation":0,"primaryHue":"red","primaryShade":4,"secondaryHue":"red","secondaryShade":3,"tertiaryHue":"red","tertiaryShade":4,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"none","sealHue":"transparent","sealShade":0,"sealSize":0,"sealLayers":0,"sealRotation":0,"sealPositions":[],"ring":"none","ringHue":"transparent","ringShade":0,"ringCount":0,"ringSize":0,"ringRadius":0,"ringRotation":0,"ringPositions":[],"emblem":"none","emblemHue":"transparent","emblemShade":0,"emblemSize":0,"emblemRotation":0,"emblemPositions":[]},
								{"fieldHue":"browngray","fieldShade":4,"structure":"horizontal-stripes","sectionCount":3,"sectionFactor":-3,"sectionRotation":180,"primaryHue":"magenta","primaryShade":2,"secondaryHue":"beige","secondaryShade":0,"tertiaryHue":"cyan","tertiaryShade":3,"quarternaryHue":"transparent","quarternaryShade":0,"quintaryHue":"transparent","quintaryShade":0,"seal":"teardrop","sealHue":"magenta","sealShade":2,"sealSize":150,"sealLayers":2,"sealRotation":30,"sealPositions":["4,4"],"ring":"none","ringHue":"transparent","ringShade":0,"ringCount":0,"ringSize":0,"ringRadius":0,"ringRotation":0,"ringPositions":[],"emblem":"none","emblemHue":"transparent","emblemShade":0,"emblemSize":0,"emblemRotation":0,"emblemPositions":[]}
							]
						break

					// game components
						case "races":
							return [
								{
									singular:    "dwarf",
									plural:      "dwarves",
									altsingular: "dwarf",
									altplural:   "dwarfs",
									short:       "d",
									color:       "var(--yellow-3)"
								},
								{
									singular:    "elf",
									plural:      "elves",
									altsingular: "elf",
									altplural:   "elfs",
									short:       "e",
									color:       "var(--cerulean-2)"
								},
								{
									singular:    "fairy",
									plural:      "fairies",
									altsingular: "faery",
									altplural:   "faerys",
									short:       "f",
									color:       "var(--red-1)"
								},
								{
									singular:    "goblin",
									plural:      "goblins",
									altsingular: "goblin",
									altplural:   "goblins",
									short:       "g",
									color:       "var(--purple-1)"
								},
								{
									singular:    "lizardperson",
									plural:      "lizardfolk",
									altsingular: "sss",
									altplural:   "zzz",
									short:       "l",
									color:       "var(--greengray-3)"
								}
							]
						break

						case "agencies":
							return [
								{
									full:     "social & healthcare",
									short:    "s",
									color:    "var(--blue-3)"
								},
								{
									singular: "regulation & environment",
									short:   "r",
									color:    "var(--green-3)"
								},
								{
									singular: "technology & research",
									short:   "t",
									color:    "var(--orange-3)"
								},
								{
									singular: "military & police",
									short:   "m",
									color:    "var(--red-3)"
								}
							]
						break

						case "ideologies":
							return [
								{
									name:        "socialist",
									description: "build a large government that controls the means of production and distribution",
									s:           [80,100],
									r:           [80,100],
									t:           [80,100],
									m:           [ 0,100],
									other:       null
								},
								{
									name:        "liberal",
									description: "expand the size and scope of government, but with a minimal military force",
									s:           [60,100],
									r:           [60,100],
									t:           [60,100],
									m:           [ 0, 40],
									other:       null
								},
								{
									name:        "moderate",
									description: "keep all agencies of government somewhere in the middle",
									s:           [25, 75],
									r:           [25, 75],
									t:           [25, 75],
									m:           [25, 75],
									other:       null
								},
								{
									name:        "conservative",
									description: "limit the size and scope of government, but build a strong military force",
									s:           [ 0, 40],
									r:           [ 0, 40],
									t:           [ 0, 40],
									m:           [60,100],
									other:       null
								},
								{
									name:        "libertarian",
									description: "eliminate the social, regulatory, and technology expenditures of the state",
									s:           [ 0, 20],
									r:           [ 0, 20],
									t:           [ 0, 20],
									m:           [ 0,100],
									other:       null
								},
								{
									name:        "fascist",
									description: "become the council leader and suspend democracy as a military-backed dictator",
									s:           [ 0,100],
									r:           [ 0,100],
									t:           [ 0,100],
									m:           [80,100],
									other:       "be council leader"
								},
								{
									name:        "populist",
									description: "expand the scope of government as an autocratic champion of the people",
									s:           [80,100],
									r:           [ 0,100],
									t:           [ 0,100],
									m:           [ 0,100],
									other:       "80+ approval rating"
								},
								{
									name:        "weaken the military and let a rebellion overthrow the government",
									description: "",
									s:           [ 0,100],
									r:           [ 0,100],
									t:           [ 0,100],
									m:           [ 0, 20],
									other:       "successful rebellion"
								},
								{
									name:        "crook",
									description: "weaken regulation and amass a personal fortune in your campaign funds",
									s:           [ 0,100],
									r:           [ 0, 20],
									t:           [ 0,100],
									m:           [ 0,100],
									other:       "25000 in funds"
								}
							]
						break

						case "realms":
							return ["Caledonia", "Faerponia", "People's Republic of Democracy", "Carasune", "Laige", "Beltoc", "Edilar", "Corano", "Ariule", "Seraveru", "Seltin", "Strelt", "Ocrano", "Hovalith", "Rescoth", "Nadroc", "Anago", "Pexis", "Quaris", "Bellun", "Venemith", "Hogate", "Isk", "Lisbith", "Tringe", "Orenth", "Ain", "Meleth", "Mullwood", "Aloonic Republic", "Torstonia", "Cotyllia", "Uzia Confederacy", "Hydris States", "Marle", "Precine Republic", "Priosian Alliance", "States of Phaleed", "Ivenin Confederacy", "Whitesea Coast", "Firestorm Coast"]
						break

						case "issues":
							return {
								// mechanics
									leader:    [
										{name: "Leader: choose a member to select which issues are debated.", type: "leader", timeout: 60000}
									],
									austerity: [
										{name: "Austerity: the realm is bankrupt!", type: "austerity", timeout: 60000, options: [
											{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]},
											{name: "Tax the wealthy.", treasury: 10000, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}},
											{name: "Tax the populace.", treasury: 10000, funds: 1000, constituents: {d: {approval: -1}, e: {approval: -1}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}},
											{name: "Tax the politicians.", treasury: 10000, funds: -2000, constituents: {d: {approval: 2}, e: {approval: 2}, f: {approval: 2}, g: {approval: 2}, l: {approval: 2}}},
											{name: "Eliminate social programs.", treasury: 10000, agencies: {s: -5}, constituents: {d: {approval: 1}, e: {approval: -2}, f: {approval: -3}, g: {approval: -2}, l: {approval: 1}}},
											{name: "Cut back on regulation.", treasury: 10000, funds: 1000, agencies: {r: -5}, constituents: {d: {approval: 3}, e: {approval: -3}, f: {approval: -3}, g: {approval: 2}, l: {approval: 1}}},
											{name: "Limit education and technology funding.", treasury: 10000, agencies: {t: -5}, constituents: {d: {approval: -1}, e: {approval: -5}, f: {approval: -1}, g: {approval: 3}, l: {approval: 2}}},
											{name: "Reduce the size of the military.", treasury: 10000, agencies: {m: -5}, constituents: {d: {approval: -3}, e: {approval: 3}, f: {approval: 5}, g: {approval: -3}, l: {approval: -5}}},
										]}
									],
									rebellion: [
										{name: "Rebellion: a rebellion attempts to overthrow the council!", type: "rebellion", timeout: 60000, options: [
											{name: "Do nothing.", state: {default: true}},
											{name: "Meet the rebels' demands.", treasury: -25000, constituents: {d: {approval: 1}, e: {approval: 4}, f: {approval: 5}, g: {approval: 3}, l: {approval: 2}}},
											{name: "Suppress the rebels", treasury: -5000, agencies: {m: -20}, constituents: {d: {approval: 4}, e: {approval: 2}, f: {approval: 1}, g: {approval: 5}, l: {approval: 3}}}
										]}
									],

								// rule repeal
									repeal:    [
										{name: "Repeal: 5-minute term limits for council leader.",                                     type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", funds: 1000, constituents: {e: {approval: 1}, f: {approval: -1}, g: {approval: -1}}, rules: [{name: "term-limits", enact: false}]}]},
										{name: "Repeal: 5-minute minimum term for council leader.",                                    type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", rules: [{name: "term-length", enact: false}]}]},
										{name: "Repeal: council leader cannot unselect an issue.",                                     type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: -1}, g: {approval: -1}}, rules: [{name: "no-tabling", enact: false}]}]},
										{name: "Repeal: 1-minute voting period for all issues.",                                       type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {e: {approval: 1}, f: {approval: -1}, g: {approval: -1}}, rules: [{name: "quick-voting", enact: false}]}]},
										{name: "Repeal: options must have an outright majority to be enacted.",                        type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {g: {approval: -1}, l: {approval: -1}}, rules: [{name: "majority-threshold", enact: false}]}]},
										{name: "Repeal: council members can vote while campaigning.",                                  type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", rules: [{name: "absentee-voting", enact: false}]}]},
										{name: "Repeal: council leader cannot leave to campaign.",                                     type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", funds: 1000, rules: [{name: "leader-presence", enact: false}]}]},
										{name: "Repeal: the treasury must stay positive.",                                             type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", funds: 1000, constituents: {d: {approval: -2}, e: {approval: -1}, f: {approval: 1}, g: {approval: 1}}, rules: [{name: "balanced-budget", enact: false}]}]},
										{name: "Repeal: all present members must vote - no abstentions.",                              type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: -1}, e: {approval: 1}, f: {approval: 1}, g: {approval: -1}, l: {approval: -1}}, rules: [{name: "no-abstentions", enact: false}]}]},
										{name: "Repeal: council leader does not vote on issues.",                                      type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: 1}, e: {approval: -1}}, rules: [{name: "impartial-leader", enact: false}]}]},
										{name: "Repeal: council leader wields tiebreaking vote.",                                      type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: -1}, e: {approval: 1}}, rules: [{name: "tiebreaker-leader", enact: false}]}]},
										{name: "Repeal: council members barred from receiving corporate kickbacks.",                   type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", funds: 2000, agencies: {r: -3}, constituents: {d: {approval: 2}, e: {approval: -1}, f: {approval: -1}, g: {approval: 1}}, rules: [{name: "kickback-ban", enact: false}]}]},
										{name: "Repeal: council members barred from taking constituent donations.",                    type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", agencies: {r: -2}, constituents: {e: {approval: -1}, g: {approval: 2}, l: {approval: 2}}, rules: [{name: "donation-ban", enact: false}]}]},
										{name: "Repeal: the press has limited access to government, dampening approval swings.",       type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", agencies: {s: 2}, constituents: {e: {approval: 5}, f: {approval: 2}, g: {approval: -2}, l: {approval: -1}}, rules: [{name: "restricted-press", enact: false}]}]},
										{name: "Repeal: council members' votes undisclosed, so approvals reflect enacted option.",     type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: -2}, e: {approval: 4}, f: {approval: -1}, g: {approval: -1}, l: {approval: 1}}, rules: [{name: "secret-voting", enact: false}]}]},
										{name: "Repeal: voting age requirements are lowered.",                                         type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: -1, population: -1000}, e: {approval: 3}, f: {approval: -3, population: -2000}, g: {approval: -2, population: -2000}, l: {approval: -1, population: -1000}}, rules: [{name: "lower-age", enact: false}]}]},
										{name: "Repeal: there is a maximum voting age.",                                               type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: 1, population: 1000}, e: {approval: 5, population: 2000} g: {approval: -2}}, rules: [{name: "maximum-age", enact: false}]}]},
										{name: "Repeal: convicted criminals barred from voting.",                                      type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", agencies: {s: 2}, constituents: {d: {approval: -2}, e: {approval: 1}, f: {approval: -1}, g: {approval: 4, population: 2000}, l: {approval: 2, population: 1000}}, rules: [{name: "felon-disenfranchisement", enact: false}]}]},
										{name: "Repeal: poll tax for national elections.",                                             type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", treasury: -10000, agencies: {s: 1}, constituents: {d: {approval: -1}, e: {approval: 3}, f: {approval: 1, population: 1000}, g: {approval: 5, population: 2000}, l: {approval: 3, population: 1000}}, rules: [{name: "poll-tax", enact: false}]}]},
										{name: "Repeal: height restrictions for national elections.",                                  type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: 5, population: 2000}, e: {approval: -1}, f: {approval: 5, population: 2000}, g: {approval: 5, population: 2000}, l: {approval: -1}}, rules: [{name: "height-restrictions", enact: false}]}]},
										{name: "Repeal: elections have been delayed.",                                                 type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", rules: [{name: "delayed-elections", enact: false}]}]},
										{name: "Repeal: elections have been moved sooner.",                                            type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", rules: [{name: "snap-elections", enact: false}]}]},
										{name: "Repeal: council leaders cannot serve consecutive terms.",                              type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {e: {approval: -1}}, rules: [{name: "no-consecutives", enact: false}]}]},
										{name: "Repeal: council members cannot vote for themselves for leader.",                       type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: -1}, e: {approval: -1}, f: {approval: -1}, g: {approval: 2}, l: {approval: 2}}, rules: [{name: "no-self", enact: false}]}]},
										{name: "Repeal: campaigning is only allowed 5 minutes before the election.",                   type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", funds: 1000, constituents: {d: {approval: -3}, e: {approval: -1}, f: {approval: -1}, g: {approval: -1}, l: {approval: -1}}, rules: [{name: "short-season", enact: false}]}]},
										{name: "Repeal: council leader can make executive decisions on issues with < 2 minutes left.", type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", constituents: {d: {approval: -3}, e: {approval: 5}, f: {approval: 3}, g: {approval: -5}, l: {approval: -4}}, rules: [{name: "executive-decision", enact: false}]}]},
										{name: "Repeal: thorough polling presents accurate approval ratings.",                         type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", treasury: 5000, funds: 1000, agencies: {t: -2}, constituents: {d: {approval: 1}, e: {approval: -3}, f: {approval: 1}, g: {approval: 3}, l: {approval: 3}}, rules: [{name: "accurate-polling", enact: false}]}]},
										{name: "Repeal: government audits project accurate agency changes.",                           type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", treasury: 5000, agencies: {s: -2}, constituents: {d: {approval: -3}, e: {approval: -2}, f: {approval: 1}, g: {approval: 1}, l: {approval: 1}}, rules: [{name: "accurate-estimates", enact: false}]}]},
										{name: "Repeal: council members' campaign funds must be disclosed.",                           type: "repeal", timeout: 3600000, options: [{name: "Keep the rule.", state: {default: true}}, {name: "Repeal the rule.", funds: 2000, agencies: {r: -2}, constituents: {d: {approval: 3}, e: {approval: -4}, f: {approval: -2}, g: {approval: 2}, l: {approval: 2}}, rules: [{name: "financial-disclosure", enact: false}]}]}
									],

								// violence
									violence:  [
										{name: "Violence: poisoned wine in council members' chalices kills servants.",                          type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Research poison detection.", treasury: -1000, agencies: {r: 1, t: 2}, constituents: {e: {approval: 1}, l: {approval: -1}}}, {name: "Public execution of the likely culprits.", agencies: {m: 1}, constituents: {d: {approval: 1}, g: {approval: 1}}}]},
										{name: "Violence: arrows fired on the leader at night, narrowly miss.",                                 type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -1}, e: {approval: -1}, f: {approval: -1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Move the council to a secret location.", treasury: -2000, constituents: {d: {approval: 1}, e: {approval: -1}, f: {approval: -1}, g: {approval: -1}, l: {approval: 1}}}, {name: "Hire more guards to protect the council.", treasury: -1000, agencies: {m: 3}, constituents: {d: {approval: 2}, e: {approval: 1}, f: {approval: -1}, l: {approval: 1}}}]},
										{name: "Violence: assassin sneaks into leader's chamber, foiled by guards.",                            type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -1}, g: {approval: -1}, l: {approval: -1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Create a special palace for the leader.", treasury: -2000, funds: 1000, agencies: {s: 1}, constituents: {d: {approval: 1}, g: {approval: 1}}}, {name: "Create an elite force of guards for the leader.", treasury: -1000, agencies: {m: 3}, constituents: {d: {approval: 1}, e: {approval: 1}, f: {approval: -1}}}]},
										{name: "Violence: mysterious sorcerer casts lightning bolt at council members, no injuries sustained.", type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -2}, e: {approval: -1}, g: {approval: -1}, l: {approval: -1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Impose restrictions on magic usage in public.", funds: 1000, agencies: {r: 3}, constituents: {d: {approval: 3}, e: {approval: -1}, f: {approval: -2}, g: {approval: 1}, l: {approval: 1}}}, {name: "Infiltrate the cult of the Air Gods.", agencies: {m: 1}, constituents: {d: {approval: 1}, e: {approval: 1}, f: {approval: -1}, g: {approval: 1}, l: {approval: -1}}}]},
										{name: "Violence: capitol set on fire, no casualties.",                                                 type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -1}, e: {approval: -1}, f: {approval: -1}, g: {approval: -1}, l: {approval: -1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Create a public fire-fighting force.", treasury: -3000, funds: 1000, agencies: {s: 3, t: 1}, constituents: {d: {approval: 1}, e: {approval: 2}, f: {approval: 3}, g: {approval: -1}, l: {approval: 1}}}, {name: "Hire wizards to cast protection from fire on city structures.", treasury: -1000, agencies: {s: 1, t: 1}, constituents: {d: {approval: -1}, e: {approval: 2}, f: {approval: 1}}}]},
										
										{name: "Violence: aristocrats' children are killed by terrorists in the night.",                        type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -2}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Establish a curfew and restrict movements", treasury: -3000, agencies: {r: 3, m: 3}, constituents: {d: {approval: 1}, e: {approval: -2}, f: {approval: 2}, g: {approval: -3}, l: {approval: 1}}}, {name: "Torture and execute the terrorists.", agencies: {r: -2, m: 2}, constituents: {d: {approval: 2}, e: {approval: -1}, f: {approval: -2}, g: {approval: 3}, l: {approval: 2}}}]},
										{name: "Violence: protesters march on the capitol.",                                                    type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -1}, e: {approval: 1}, f: {approval: 1}, g: {approval: 1}, l: {approval: -1}}}, {name: "Ban public gatherings of large groups.", agencies: {r: 1, m: 1}, constituents: {d: {approval: 1}, e: {approval: -1}, f: {approval: -2}, g: {approval: -2}, l: {approval: 1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Send out the army to kill protestors who approach the council.", treasury: -1000, agencies: {m: 3}, constituents: {d: {approval: 2}, e: {approval: -3}, f: {approval: -2}, g: {approval: 1}, l: {approval: -1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}]},
										{name: "Violence: elves and dwarves clash in the streets.",                                             type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -5}, e: {approval: -5}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Blame it on the elves & imprison them.", funds: 1000, agencies: {m: 1}, constituents: {d: {approval: 5}, e: {approval: -5}}, {name: "Blame it on the dwarves & imprison them.", funds: 1000, agencies: {m: 1}, constituents: {d: {approval: -5}, e: {approval: 5}}}]},
										{name: "Violence: impoverished goblins eat nobles' pets.",                                              type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -3}, e: {approval: -3}, f: {approval: -2}, g: {approval: 1}, l: {approval: 1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Round up the goblins involved & burn them at the stake.", treasury: -1000, agencies: {r: -1, m: 3}, constituents: {d: {approval: 2}, e: {approval: 1}, g: {approval: -5}}}, {name: "Establish a welfare system for hungry goblins.", treasury: -3000, agencies: {s: 5}, constituents: {d: {approval: -4}, e: {approval: -3}, g: {approval: 5}}}]},
										{name: "Violence: angry lizardfolk riot and plunder.",                                                  type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -2}, e: {approval: -2}, f: {approval: -2}, g: {approval: 1}, l: {approval: 3}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Hire an ice witch to make the capitol too cold for lizardfolk.", treasury: -2000, agencies: {t: 1}, constituents: {d: {approval: 1}, f: {approval: -1}, l: {approval: -3}}}, {name: "Work with lizardfolk authorities to identify and prosecute the rioters.", treasury: -1000, agencies: {m: 2}, constituents: {d: {approval: -1}, e: {approval: 1}, g: {approval: 1}}}]},

										{name: "Violence: fairies flock to the capitol for a demonstration.",                                   type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {e: {approval: 3}, f: {approval: 3}, g: {approval: -1}}}, {name: "Establish a no-fly zone to restrict fairy movements.", treasury: -2000, agencies: {r: 2}, constituents: {d: {approval: 1}, e: {approval: 1}, f: {approval: -5}, g: {approval: 1}, l: {approval: 1}}}, {name: "Imprison the fairies involved.", agencies: {m: 1}, constituents: {d: {approval: 1}, f: {approval: -2}, g: {approval: 1}}}]},
										{name: "Violence: dwarven saboteurs literally undermine the capitol.",                                  type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: 1}, e: {approval: -4}, f: {approval: -2}, l: {approval: -1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Impose licensing requirements on mining equipment.", treasury: -2000, funds: 1000, agencies: {r: 3, t: 1}, constituents: {d: {approval: -5}, e: {approval: 1}, f: {approval: 1}, g: {approval: -2}}}, {name: "Hold a public stoning for the saboteurs.", treasury: -1000, agencies: {m: 2}, constituents: {d: {approval: -2}, e: {approval: 1}}}]},
										{name: "Violence: elf sorceress summons unicorn stampede to overrun goblins.",                          type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -1}, e: {approval: 1}, g: {approval: -5}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Restrict transporation to non-magical animals.", treasury: -1000, funds: 1000, agencies: {r: 3}, constituents: {d: {approval: 2}, e: {approval: -1}, f: {approval: -1}, g: {approval: 3}, l: {approval: -2}}}, {name: "Research anti-magic technology.", treasury: -2000, agencies: {r: 1, t: 4}, constituents: {d: {approval: 3}, e: {approval: -1}, f: {approval: -2}, g: {approval: 2}, l: {approval: -1}}}]},
										{name: "Violence: lizardfolk warlock summons a hydra to demolish fairy villages.",                      type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {f: {approval: -5}, g: {approval: 1}, l: {approval: 2}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Help the fairies rebuild.", treasury: -4000, funds: 1000, agencies: {s: 4, t: 1}, constituents: {e: {approval: 1}, f: {approval: 5}}}, {name: "Create a national register of lizardfolk wizards.", treasury: -1000, agencies: {r: 2}, constituents: {f: {approval: 3}, g: {approval: 1}, l: {approval: -4}}}]},
										{name: "Violence: ice witch hired by goblins freezes over the capitol.",                                type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {f: {approval: -2}, g: {approval: 1}, l: {approval: -4}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Ban the use of ice magic.", treasury: -1000, agencies: {r: 3}, constituents: {d: {approval: 2}, e: {approval: -1}, f: {approval: -1}, g: {approval: -3}, l: {approval: 5}}}, {name: "Offer free firewood and coal to citizens.", treasury: -3000, agencies: {s: 3}, constituents: {d: {approval: -1}, e: {approval: 1}, g: {approval: 2}, l: {approval: 4}}}]},

										{name: "Violence: an unhappy populace dumps market wares into the river.",                              type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -2}, e: {approval: -2}, f: {approval: 1}, g: {approval: 1}, l: {approval: 1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Hire a water wizard to recover the goods.", treasury: -1000, funds: 1000, agencies: {s: 2}, constituents: {d: {approval: 1}, e: {approval: 2}, l: {approval: 1}}}, {name: "Double the presence of armed guards in the markets.", treasury: -2000, funds: 1000, agencies: {s: 1, r: 1, m: 4}, constituents: {d: {approval: 3}, f: {approval: -1}, g: {approval: -2}}}]},
										{name: "Violence: political dissidents take minor officials hostage.",                                  type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {e: {approval: -1}, f: {approval: -1}, g: {approval: 1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Negotiate with the criminals to recover the hostages.", treasury: -5000, constituents: {d: {approval: -1}, e: {approval: -1}, f: {approval: 1}, g: {approval: -1}, l: {approval: -1}}}, {name: "Swarm the place with soldiers, killing everybody.", treasury: -1000, agencies: {m: 3}, constituents: {d: {approval: 2}, e: {approval: -2}, f: {approval: -3}, g: {approval: 1}, l: {approval: -1}}}]},
										{name: "Violence: working class protestors destroy the mansions of wealthy nobles.",                    type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -3}, e: {approval: -3}, g: {approval: 1}, l: {approval: 1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Pay for the damages and rebuild.", treasury: -5000, funds: 1000, agencies: {s: 3, t: 2}, constituents: {d: {approval: 1}, e: {approval: 1}, f: {approval: -1}, g: {approval: -2}, l: {approval: -1}}}, {name: "Meet the protestors' demands and improving working class wages.", agencies: {s: 1, r: 3}, constituents: {d: {approval: -3}, f: {approval: 1}, g: {approval: 4}, l: {approval: 2}}}]},
										{name: "Violence: tax collectors are rounded up by angry mobs.",                                        type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: 1}, e: {approval: -1}, f: {approval: 1}, g: {approval: 1}, l: {approval: -1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Hire new tax collectors.", treasury: -1000, agencies: {s: 1, r: 3}, constituents: {d: {approval: -3}, g: {approval: -2}, l: {approval: -1}}}, {name: "Lower taxes to secure the hostages' release.", treasury: -10000, agencies: {r: -1}, constituents: {d: {approval: 4}, e: {approval: 1}, f: {approval: 2}, g: {approval: 4}, l: {approval: 3}}}]},
										{name: "Violence: riots in the streets!",                                                               type: "violence", timeout: 120000, options: [{name: "Do nothing.", state: {default: true}, constituents: {d: {approval: -1}, e: {approval: -1}, f: {approval: -1}, g: {approval: -1}, l: {approval: -1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Send out the archers to kill the rioters.", treasury: -1000, agencies: {m: 3}, constituents: {d: {approval: 1}, e: {approval: -2}, f: {approval: -4}, g: {approval: -1}, l: {approval: 1}}, issues: [{timeout: 15000, type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}]}, {name: "Change the city street system to make future riots less likely.", treasury: -4000, agencies: {s: 2, r: 1, t: 4}, constituents: {d: {approval: 1}, e: {approval: 2}, g: {approval: -2}}}]},
									],
								
								// random issues
									small:     [
										{name: "Enact: 5-minute term limits for council leader.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", funds: -1000, constituents: {e: {approval: -1}, f: {approval: 1}, g: {approval: 1}}, rules: [{name: "term-limits", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: 5-minute term limits for council leader"}]}]},
										{name: "Enact: 5-minute minimum term for council leader.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", rules: [{name: "term-length", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: 5-minute minimum term for council leader"}]}]},
										{name: "Enact: council leader cannot unselect an issue.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: 1}, g: {approval: 1}}, rules: [{name: "no-tabling", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council leader cannot unselect an issue"}]}]},
										{name: "Enact: options must have an outright majority to be enacted.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {g: {approval: 1}, l: {approval: 1}}, rules: [{name: "majority-threshold", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: options must have an outright majority to be enacted"}]}]},
										{name: "Enact: council leader cannot leave to campaign.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", rules: [{name: "leader-presence", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council leader cannot leave to campaign"}]}]},
										{name: "Enact: council leader does not vote on issues.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: -1}, e: {approval: 1}}, rules: [{name: "impartial-leader", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council leader does not vote on issues"}]}]},
										{name: "Enact: council leaders cannot serve consecutive terms.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {e: {approval: 1}}, rules: [{name: "no-consecutives", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council leaders cannot serve consecutive terms"}]}]},
										{name: "Enact: council members cannot vote for themselves for leader.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: 1}, e: {approval: 1}, f: {approval: 1}, g: {approval: -2}, l: {approval: -2}}, rules: [{name: "no-self", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council members cannot vote for themselves for leader"}]}]},
										{name: "Enact: government audits project accurate agency changes.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", treasury: -5000, funds: 1000, agencies: {s: 2}, constituents: {d: {approval: 3}, e: {approval: 2}, f: {approval: -1}, g: {approval: -1}, l: {approval: -1}}, rules: [{name: "accurate-estimates", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: government audits project accurate agency changes"}]}]},
										{name: "Enact: council members' campaign funds must be disclosed.", type: "small", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", agencies: {r: 2}, constituents: {d: {approval: -3}, e: {approval: 4}, f: {approval: 2}, g: {approval: -2}, l: {approval: -2}}, rules: [{name: "financial-disclosure", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council members' campaign funds must be disclosed"}]}]}

									],
									medium:    [
										{name: "Enact: 1-minute voting period for all issues.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {e: {approval: -1}, f: {approval: 1}, g: {approval: 1}}, rules: [{name: "quick-voting", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: 1-minute voting period for all issues"}]}]},
										{name: "Enact: council members can vote while campaigning.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", funds: 1000, rules: [{name: "absentee-voting", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council members can vote while campaigning"}]}]},
										{name: "Enact: the treasury must stay positive.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: 2}, e: {approval: 1}, f: {approval: -1}, g: {approval: -1}}, rules: [{name: "balanced-budget", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: the treasury must stay positive"}]}]},
										{name: "Enact: all present members must vote - no abstentions.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: 1}, e: {approval: -1}, f: {approval: -1}, g: {approval: 1}, l: {approval: 1}}, rules: [{name: "no-abstentions", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: all present members must vote - no abstentions"}]}]},
										{name: "Enact: council leader wields tiebreaking vote.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: 1}, e: {approval: -1}}, rules: [{name: "tiebreaker-leader", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council leader wields tiebreaking vote"}]}]},
										{name: "Enact: council members barred from receiving corporate kickbacks.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", agencies: {r: 3}, constituents: {d: {approval: -2}, e: {approval: 1}, f: {approval: 1}, g: {approval: -1}}, rules: [{name: "kickback-ban", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council members barred from receiving corporate kickbacks"}]}]},
										{name: "Enact: council members barred from taking constituent donations.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", agencies: {r: 2}, constituents: {e: {approval: 1}, g: {approval: -2}, l: {approval: -2}}, rules: [{name: "donation-ban", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council members barred from taking constituent donations"}]}]},
										{name: "Enact: voting age requirements are lowered.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: 1, population: 1000}, e: {approval: -3}, f: {approval: 3, population: 2000}, g: {approval: 2, population: 2000}, l: {approval: 1, population: 1000}}, rules: [{name: "lower-age", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: voting age requirements are lowered"}]}]},
										{name: "Enact: there is a maximum voting age.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: -1, population: -1000}, e: {approval: -5, population: -2000} g: {approval: 2}}, rules: [{name: "maximum-age", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: there is a maximum voting age"}]}]},
										{name: "Enact: convicted criminals barred from voting.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", agencies: {s: -2}, constituents: {d: {approval: 2}, e: {approval: -1}, f: {approval: 1}, g: {approval: -4, population: -2000}, l: {approval: -2, population: -1000}}, rules: [{name: "felon-disenfranchisement", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: convicted criminals barred from voting"}]}]},
										{name: "Enact: height restrictions for national elections.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: -5, population: -2000}, e: {approval: 1}, f: {approval: -5, population: -2000}, g: {approval: -5, population: -2000}, l: {approval: -1}}, rules: [{name: "height-restrictions", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: height restrictions for national elections"}]}]},
										{name: "Enact: elections have been delayed.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", funds: 2000, rules: [{name: "delayed-elections", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: elections have been delayed"}]}]},
										{name: "Enact: elections have been moved sooner.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", rules: [{name: "snap-elections", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: elections have been moved sooner"}]}]},
										{name: "Enact: campaigning is only allowed 5 minutes before the election.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: 3}, e: {approval: 1}, f: {approval: 1}, g: {approval: 1}, l: {approval: 1}}, rules: [{name: "short-season", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: campaigning is only allowed 5 minutes before the election"}]}]},
										{name: "Enact: thorough polling presents accurate approval ratings.", type: "medium", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", treasury: -5000, agencies: {t: 2}, constituents: {d: {approval: -1}, e: {approval: 3}, f: {approval: -1}, g: {approval: -3}, l: {approval: -3}}, rules: [{name: "accurate-polling", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: thorough polling presents accurate approval ratings"}]}]}
									],
									large:     [
										{name: "Enact: the press has limited access to government, dampening approval swings.", type: "large", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", agencies: {s: -2}, constituents: {e: {approval: -5}, f: {approval: -2}, g: {approval: 2}, l: {approval: 1}}, rules: [{name: "restricted-press", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: the press has limited access to government, dampening approval swings"}]}]},
										{name: "Enact: council members' votes undisclosed, so approvals reflect enacted option.", type: "large", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: 2}, e: {approval: -4}, f: {approval: 1}, g: {approval: 1}, l: {approval: -1}}, rules: [{name: "secret-voting", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council members' votes undisclosed, so approvals reflect enacted option"}]}]},
										{name: "Enact: council leader can make executive decisions on issues with < 2 minutes left.", type: "large", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", constituents: {d: {approval: 3}, e: {approval: -5}, f: {approval: -3}, g: {approval: 5}, l: {approval: 4}}, rules: [{name: "executive-decision", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: council leader can make executive decisions on issues with < 2 minutes left"}]}]},
										{name: "Enact: poll tax for national elections.", type: "large", options: [{name: "Don't create the rule.", state: {default: true}}, {name: "Enact the rule.", treasury: 10000, agencies: {s: -1}, constituents: {d: {approval: 1}, e: {approval: -3}, f: {approval: -1, population: -1000}, g: {approval: -5, population: -2000}, l: {approval: -3, population: -1000}}, rules: [{name: "poll-tax", enact: true}], issues: [{timeout: 300000, type: "repeal", name: "Repeal: poll tax for national elections"}]}]}
									],

								// effects only
									effects:   [
									]
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
									exists:   true,
									flag:     createFlag()
								},
								treasury: 10000,
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
								achieved:  false,
								flag:      createFlag()
							},
							name:     null,
							district: 0,
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
							timeout:     300000,
							type:        null,
							options:     []
						}
					break

					case "option":
						return {
							id:          generateRandom(),
							name:        null,
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

					case "flag":
						return {
							// field
								fieldHue:  "transparent",
								fieldShade: 0,

							// structure
								structure: "solid",
								sectionCount: 0,
								sectionFactor: 0,
								sectionRotation: 0,

							// colors
								primaryHue: "transparent",
								primaryShade: 0,
								secondaryHue: "transparent",
								secondaryShade: 0,
								tertiaryHue: "transparent",
								tertiaryShade: 0,
								quarternaryHue: "transparent",
								quarternaryShade: 0,
								quintaryHue: "transparent",
								quintaryShade: 0,

							// seal
								seal: "none",
								sealHue: "transparent",
								sealShade: 0,
								sealSize: 0,
								sealLayers: 0,
								sealRotation: 0,
								sealPositions: [],

							// ring
								ring: "none",
								ringHue: "transparent",
								ringShade: 0,
								ringCount: 0,
								ringSize: 0,
								ringRadius: 0,
								ringRotation: 0,
								ringPositions: [],

							// emblem
								emblem: "none",
								emblemHue: "transparent",
								emblemShade: 0,
								emblemSize: 0,
								emblemRotation: 0,
								emblemPositions: [],
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

/*** flags ***/
	/* createFlag */
		module.exports.createFlag = createFlag
		function createFlag() {
			try {
				// starting data
					var data = getSchema("flag")

					var symbols = getAsset("symbols")
					var structures = getAsset("structures")
					var angles = getAsset("angles")
					var positions = getAsset("positions")
					var colors = getAsset("colors")
						colors.transparent = ["transparent", "transparent", "transparent", "transparent", "transparent"]

				// color pool
					var hues = [
						[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
						[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
						[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
						[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
						[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)],
						[chooseRandom(Object.keys(colors)), Math.floor(Math.random() * 5)]
					]

				// position
					var position = chooseRandom(positions)

				// field
					data.fieldHue = chooseRandom(hues)
					data.fieldShade = data.fieldHue[1]
					data.fieldHue = data.fieldHue[0]

				// structure
					data.structure = chooseRandom(structures)
					data.sectionCount = (data.structure == "solid") ? 1 : data.structure.includes("stripes") ? (Math.floor(Math.random() * 7) + 2) * (data.structure == "wedge-stripes" ? 2 : 1) : (data.structure == "checkers") ? Math.pow((Math.floor(Math.random() * 6) + 2), 2) : (Math.floor(Math.random() * 4) + 1)
					data.sectionFactor = Math.floor(Math.random() * 7) - 3
					data.sectionRotation = chooseRandom(angles)

				// colors
					data.primaryHue = chooseRandom(hues)
					data.primaryShade = data.primaryHue[1]
					data.primaryHue = data.primaryHue[0]

					data.secondaryHue = chooseRandom(hues)
					data.secondaryShade = data.secondaryHue[1]
					data.secondaryHue = data.secondaryHue[0]

					data.tertiaryHue = Math.floor(Math.random() * 2) ? null : chooseRandom(hues)
					data.tertiaryShade = data.tertiaryHue ? data.tertiaryHue[1] : 0
					data.tertiaryHue = data.tertiaryHue ? data.tertiaryHue[0] : "transparent"

					data.quarternaryHue = data.tertiaryHue && Math.floor(Math.random() * 4) ? null : chooseRandom(hues)
					data.quarternaryShade = data.quarternaryHue ? data.quarternaryHue[1] : 0
					data.quarternaryHue = data.quarternaryHue ? data.quarternaryHue[0] : "transparent"

					data.quintaryHue = data.quarternaryHue && Math.floor(Math.random() * 6) ? null : chooseRandom(hues)
					data.quintaryShade = data.quintaryHue ? data.quintaryHue[1] : 0
					data.quintaryHue = data.quintaryHue ? data.quintaryHue[0] : "transparent"

				// seal
					data.seal = Math.floor(Math.random() * 3) ? "none" : chooseRandom(Object.keys(symbols))
					data.sealHue = data.seal == "none" ? "transparent" : chooseRandom(hues)
					data.sealShade = data.seal == "none" ? 0 : data.sealHue[1]
					data.sealHue = data.seal == "none" ? "transparent" : data.sealHue[0]
					data.sealLayers = data.seal == "none" ? 0 : Math.floor(Math.random() * 2) + 1
					data.sealSize = data.seal == "none" ? 0 : Math.floor(Math.random() * 5) * 50 + 50
					data.sealRotation = data.seal == "none" ? 0 : chooseRandom(angles)
					data.sealPositions = data.seal == "none" ? [] : position

				// ring
					data.ring = Math.floor(Math.random() * 5) ? "none" : chooseRandom(Object.keys(symbols))
					data.ringHue = data.ring == "none" ? "transparent" : chooseRandom(hues)
					data.ringShade = data.ring == "none" ? 0 : data.ringHue[1]
					data.ringHue = data.ring == "none" ? "transparent" : data.ringHue[0]
					data.ringCount = data.ring == "none" ? 0 : Math.floor(Math.random() * 20) + 4
					data.ringSize = data.ring == "none" ? 0 : Math.floor(Math.random() * 3) * 50 + 50
					data.ringRadius = data.ring == "none" ? 0 : Math.floor(Math.random() * 2) * 50 + 100
					data.ringRotation = data.ring == "none" ? 0 : chooseRandom(angles)
					data.ringPositions = data.ring == "none" ? [] : position

				// emblems
					data.emblem = Math.floor(Math.random() * 4) ? "none" : chooseRandom(Object.keys(symbols))
					data.emblemHue = data.emblem == "none" ? "transparent" : chooseRandom(hues)
					data.emblemShade = data.emblem == "none" ? 0 : data.emblemHue[1]
					data.emblemHue = data.emblem == "none" ? "transparent" : data.emblemHue[0]
					data.emblemSize = data.emblem == "none" ? 0 : Math.floor(Math.random() * 4) * 50 + 50
					data.emblemRotation = data.emblem == "none" ? 0 : chooseRandom(angles)
					data.emblemPositions = data.emblem == "none" ? [] : position

				// next steps
					if ((data.structure == "solid" ||  data.secondaryHue == data.primaryHue || data.sectionCount == 1 || data.secondaryHue == "transparent")
					&& ((data.seal      == "none") || (data.sealHue      == data.primaryHue && data.sectionCount == 1))
					&& ((data.ring      == "none") || (data.ringHue      == data.primaryHue && data.sectionCount == 1))
					&& ((data.emblem    == "none") || (data.emblemHue    == data.primaryHue && data.sectionCount == 1))) {
						return createFlag()
					}
					else {
						return data
					}
			}
			catch (error) {
				logError(error)
				return null
			}
		}
