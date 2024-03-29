/*** modules ***/
	var HTTP       = require("http")
	var FS         = require("fs")
	var DEBUG      = getEnvironment("debug")
	module.exports = {}

/*** logs ***/
	/* logError */
		module.exports.logError = logError
		function logError(error) {
			if (DEBUG) {
				console.log("\n*** ERROR @ " + new Date().toLocaleString() + " ***")
				console.log(" - " + error)
				console.dir(arguments)
			}
		}

	/* logStatus */
		module.exports.logStatus = logStatus
		function logStatus(status) {
			if (DEBUG) {
				console.log("\n--- STATUS @ " + new Date().toLocaleString() + " ---")
				console.log(" - " + status)

			}
		}

	/* logMessage */
		module.exports.logMessage = logMessage
		function logMessage(message) {
			if (DEBUG) {
				console.log(" - " + new Date().toLocaleString() + ": " + message)
			}
		}

	/* logTime */
		module.exports.logTime = logTime
		function logTime(flag, callback) {
			if (DEBUG) {
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
						cookie: (1000 * 60 * 60 * 24 * 7),
						debug:  (process.env.DEBUG || false)
					}
				}
				else {
					var environment = {
						port:   3000,
						domain: "localhost",
						cookie: (1000 * 60 * 60 * 24 * 7),
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
									<meta property="og:url" content="https://jamesmayr.com/thecouncil"/>\
									<meta property="og:description" content="Keep the republic from crumbling - rule the fantasy realm together in The Council, a card game of politics and persuasion."/>\
									<meta property="og:image" content="https://jamesmayr.com/thecouncil/banner.png"/>\
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
						case "configs": 
							return {
								redirect: "../../../../",
								encoding: "utf8",
								idSet: "abcdefghijklmnopqrstuvwxyz",
								idLength: 4,
								playerCountMaximum: 16,
								playerCountMinimum: 4,
								playerNameMaximum: 12,
								playerNameMinimum: 3,
								loopTime: 1000,
								launchSequenceTime: 60000,
								defaultIssueTimeout: 300000,
								defaultIssueDelay: 15000,
								startingFunds: 1000,
								startingTreasuryAmounts: [15000, 20000, 25000, 30000, 35000],
								issueCountRecall: 5,
								issueCountCampaign: 2,
								recallTimeMinimum: 60000,
								campaignCost: 1000,
								campaignTime: 30000,
								campaignApprovalBumps: [5,5,10,10,15,20],
								midPoint: 100 / 2,
								agencyStep: 5,
								agencyStartingMinimum: 30,
								agencyStartingMaximum: 70,
								populationStep: 1000,
								populationStartingMinimum: 5000,
								populationStartingMaximum: 25000,
								minimumPopulation: 1000 * 5 * 2,
								approvalStep: 5,
								approvalStartingMinimum: 30,
								approvalStartingMaximum: 60,
								approvalRaceBonus: 15,
								leaderVoteRaceBonus: 5,
								firstIssueDelay: 15000,
								failedVoteFundsMultiplier: 0.5,
								rebellionApproval: 10,
								protestApproval: 25,
								donationApproval: 75,
								donationTimeModulo: 300000,
								donationPerPopulation: 0.1,
								minimumIssuesResolvedBeforeMore: 2,
								minimumIssuesPresent: 3,
								desiredIssuesPresent: 4,
								messageDelay: 3000,
								betweenIssueCooldown: 7000,
								issueTypes: ["small", "small", "small", "small", "medium", "medium", "medium", "large"],
								issueRetries: 10,
								issueChances: {
									"300000": 1,    // 5 minutes 
									"120000": 0.5,  // 2 minutes
									"60000": 0.333, // 1 minute
									"30000": 0.25,  // 30 seconds
									"15000": 0.125  // 15 seconds
								},
								playerIdeologies: {
									poolA: ["liberal", "moderate", "conservative"], // normal
									poolB: ["socialist", "libertarian", "technocrat"], // extreme
									poolC: ["fascist", "populist", "anarchist", "crook", "bureaucrat", "monarchist", "factionalist", "apocalyptist"], // special
									poolD: ["moderate"], // normal
									poolE: ["liberal", "liberal", "moderate", "conservative", "conservative"], // normal
									counts: {
										"0": "a", "1": "a", "2": "a", // 3 normal
										"3": "b", "4": "c", "5": "d", "6": "c", "7": "b", // 1 normal, 2 special, 2 extreme
										"8": "e", "9": "c", "10": "e", "11": "c", "12": "e", "13": "c", "14": "e", "15": "c" // 4 normal, 4 special
									}
								},
								electionTime: 1800000,
								electionSequenceTime: 15000,
							}
						break

						case "messages":
							var configs = getAsset("configs")
							return {
								"create": "Game created.",
								"already-ended": "Game already ended.",
								"at-capacity": "Game is at capacity.",
								"already-started": "Game already started.",
								"rejoin": "Rejoining game...",
								"validation-name-length": "Enter a name between " + configs.playerNameMinimum + " and " + configs.playerNameMaximum + " characters.",
								"validation-name-set": "Your name can be letters and numbers only.",
								"validation-name-unique": "Name already taken.",
								"join": "Game joined.",
								"validation-gameid": "gameid must be " + configs.idLength + " letters.",
								"no-game": "Game not found.",
								"player-count": "Must be " + configs.playerCountMinimum + " - " + configs.playerCountMaximum + " players.",
								"not-started": "Game has not started.",
								"not-playing": "Not a player.",
								"starting": "Starting the game!",
								"ongoing-event": "Something else is happening.",
								"recall-no-leader": "No leader to recall.",
								"recall-self": "Cannot recall yourself.",
								"recall-too-soon": "Leader was just elected.",
								"recall-called": " calls for new leadership!",
								"recall-requires-all": "A leadership vote requires all members.",
								"not-leader": "Not the leader.",
								"issue-none-selected": "No issue selected.",
								"issue-already-selected": "Issue already selected.",
								"issue-none": "Issue not found.",
								"option-none-selected": "No option selected.",
								"option-already-selected": "Option already selected.",
								"option-none": "Option not found.",
								"campaign-already": "Already campaigning.",
								"campaign-too-soon": "Not enough issues to campaign on.",
								"campaign-insufficient-funds": "Campaigning requires " + configs.campaignCost + " from funds.",
								"consequence-rebellion-insufficient-treasury": "Not enough treasury to meet the rebels' demands!",
								"consequence-rebellion-insufficient-military": "The military is too weak to stop the rebels!",
								"consequence-protest-insufficient-treasury": "Not enough treasury to meet the protestors' demands!",
								"consequence-protest-insufficient-military": "The military is too weak to suppress the protest!",
								"consequence-cutbacks-insufficient-s": "Cutbacks to social services are not enough!",
								"consequence-cutbacks-insufficient-r": "Cutbacks to regulation are not enough!",
								"consequence-cutbacks-insufficient-t": "Cutbacks to tech & education are not enough!",
								"consequence-cutbacks-insufficient-m": "Cutbacks to military are not enough!",
								"tie": "No option had a plurality of votes.",
								"plurality": "A plurality has decided.",
								"issue-between": "<br>&darr;<br>",
								"campaigning": "Campaigning to boost ratings.",
								"timeout": "Time's up!<br><br>An issue is resolving itself...",
								"launch-sequence": {
									"2000": {
										observers: {success: true, show: ["government-flag"], message: "Welcome to The Council!"}
									},
									"5000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name"], message: "In this game, each player represents a district of the realm."}
									},
									"10000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies"], message: "Vote on how to spend the treasury. There are 4 main agencies..."}
									},
									"15000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s"], message: "Social Services"}
									},
									"17000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r"], message: "Regulation"}
									},
									"19000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t"], message: "Tech & Education"}
									},
									"21000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m"], message: "Military"}
									},
									"25000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents"], message: "Every vote affects your approval ratings with..."}
									},
									"29000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d"]}
									},
									"30000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e"]}
									},
									"31000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f"]}
									},
									"32000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f", "government-constituents-g"]}
									},
									"33000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f", "government-constituents-g", "government-constituents-l"]}
									},
									"35000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f", "government-constituents-g", "government-constituents-l"], message: "Look at your device."},
										players: {success: true, show: ["action-bar", "member", "member-info", "member-name", "member-district", "member-race"], message: "..."}
									},
									"40000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f", "government-constituents-g", "government-constituents-l"], message: "Look at your device."},
										players: {success: true, show: ["action-bar", "member", "member-info", "member-name", "member-district", "member-race", "member-ideology"], message: "Enact your secret ideology to win."}
									},
									"48000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f", "government-constituents-g", "government-constituents-l"], message: "Look at your device."},
										players: {success: true, show: ["action-bar", "member", "member-info", "member-name", "member-district", "member-race", "member-ideology", "member-constituents-line", "member-constituents", "member-constituents-d", "member-constituents-e", "member-constituents-f", "member-constituents-g", "member-constituents-l"], message: "Also: get reelected! Different groups have different opinions."}
									},
									"53000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f", "government-constituents-g", "government-constituents-l", "government-election", "government-election-label"], message: "Look at your device."},
										players: {success: true, show: ["action-bar", "member", "member-info", "member-name", "member-district", "member-race", "member-ideology", "member-constituents-line", "member-constituents", "member-constituents-d", "member-constituents-e", "member-constituents-f", "member-constituents-g", "member-constituents-l", "member-funds"], message: "Later, you'll boost your approval by campaigning."}
									},
									"58000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f", "government-constituents-g", "government-constituents-l", "government-election", "government-election-label", "government-leader"], message: "Look at your device."},
										players: {success: true, show: ["action-bar", "member", "member-info", "member-name", "member-district", "member-race", "member-ideology", "member-constituents-line", "member-constituents", "member-constituents-d", "member-constituents-e", "member-constituents-f", "member-constituents-g", "member-constituents-l", "member-funds", "mode-bar"], message: "But first, who should lead the council?"}
									},
									"60000": {
										observers: {success: true, show: ["government-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f", "government-constituents-g", "government-constituents-l", "government-election", "government-election-label", "government-leader", "column-right"], message: "First issue: choose a council leader, who selects issues for debate."},
										players: {success: true, show: ["action-bar", "member", "member-info", "member-name", "member-district", "member-race", "member-ideology", "member-constituents-line", "member-constituents", "member-constituents-d", "member-constituents-e", "member-constituents-f", "member-constituents-g", "member-constituents-l", "member-funds", "mode-bar"], recall: true}
									}
								},
								"issue-sequence": {
									"0": {
										"10000": {
											observers: {success: true, message: "Issues affect government agencies: Social services, Regulation, Tech & Education, and Military."}
										},
										"15000": {
											observers: {success: true, message: "Make the agencies match your secret ideology to win."}
										}
									},
									"1": {
										"10000": {
											observers: {success: true, message: "The Council ends on election day."}
										},
										"15000": {
											observers: {success: true, message: "Until then, influence the agencies and win over your constituents!"}
										}
									},
									"3": {
										"10000": {
											observers: {success: true, message: "Unhappy with the leader? Anyone can recall the leader for a new one."},
											players: {success: true, showRecall: true}
										}
									},
									"7": {
										"10000": {
											observers: {success: true, message: "Campaigns transform your funds into popularity."},
											players: {success: true, showCampaign: true}
										},
										"14000": {
											observers: {success: true, message: "Happy constituents contribute money. Some issues come with kickbacks too."}
										},
										"20000": {
											observers: {success: true, message: "Campaign for $" + configs.campaignCost + ". For " + configs.campaignTime / configs.loopTime + " seconds, you'll be unable to vote."}
										}
									}
									
								},
								"election-sequence": {
									"0": {
										observers: {success: true, message: "Election day!"},
									},
									"3000": {
										observers: {success: true, message: "The people are voting..."}
									},
									"5000": {
										observers: {success: true, message: "Look at your device."},
										member: {
											factor: "reelected",
											positive: {success: true, message: "You were reelected!"},
											negative: {success: true, message: "You lost the election."}
										}
									},
									"10000": {
										observers: {success: true, message: "Look at your device."},
										member: {
											factor: "achieved",
											positive: {success: true, message: "You enacted your ideology!"},
											negative: {success: true, message: "You did not enact your ideology."}
										}
									},
									"15000": {
										observers: {success: true, message: "Thanks for playing!"},
										member: {
											factor: "victory",
											positive: {success: true, message: "You win!"},
											negative: {success: true, message: "You lose."}
										}
									}
								}
							}
						break

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
									full:     "regulation & environment",
									short:    "r",
									color:    "var(--green-3)"
								},
								{
									full:     "technology & research",
									short:    "t",
									color:    "var(--orange-3)"
								},
								{
									full:     "military & police",
									short:    "m",
									color:    "var(--red-3)"
								}
							]
						break

						case "ideologies":
							return {
								socialist: {
									name:        "socialist",
									description: "build a large government that controls the means of production and distribution",
									s:           [65,100],
									r:           [65,100],
									t:           [65,100],
									m:           [ 0, 75]
								},
								liberal: {
									name:        "liberal",
									description: "expand the size and scope of government, but with a minimal military force",
									s:           [55,100],
									r:           [55,100],
									t:           [55,100],
									m:           [ 0, 45]
								},
								moderate: {
									name:        "moderate",
									description: "keep all agencies of government somewhere in the middle",
									s:           [35, 65],
									r:           [35, 65],
									t:           [35, 65],
									m:           [35, 65]
								},
								conservative: {
									name:        "conservative",
									description: "limit the size and scope of government, but build a strong military force",
									s:           [ 0, 45],
									r:           [ 0, 45],
									t:           [ 0, 45],
									m:           [55,100]
								},
								libertarian: {
									name:        "libertarian",
									description: "eliminate the social, regulatory, and technology expenditures of the state",
									s:           [ 0, 35],
									r:           [ 0, 35],
									t:           [ 0, 35],
									m:           [25,100]
								},
								technocrat: {
									name:        "technocrat",
									description: "drive society forward with technology and low regulation",
									s:           [35, 65],
									r:           [ 0, 45],
									t:           [55,100],
									m:           [35, 65]
								},
								fascist: {
									name:        "fascist",
									description: "become the council leader and suspend democracy as a military-backed dictator",
									s:           [25,100],
									r:           [25,100],
									t:           [ 0, 75],
									m:           [75,100],
									other:       "be council leader",
									overthrow:   ", the fascist, has seized power and declared martial law!"
								},
								populist: {
									name:        "populist",
									description: "expand the scope of government as an autocratic champion of the people",
									s:           [75,100],
									r:           [ 0, 75],
									t:           [25,100],
									m:           [25,100],
									other:       "75%+ approval rating across your constituents",
									approval:    75,
									overthrow:   ", the populist, has led a revolution against the council!"
								},
								anarchist: {
									name:        "anarchist",
									description: "weaken the military and let a rebellion overthrow the government",
									s:           [ 0, 75],
									r:           [ 0, 75],
									t:           [ 0, 75],
									m:           [ 0, 25],
									other:       "successful rebellion",
									rule:        "anarchy-instated",
									overthrow:   ", the anarchist, has dismantled the government!"
								},
								crook: {
									name:        "crook",
									description: "weaken regulation and amass a personal fortune in your campaign funds",
									s:           [ 0, 75],
									r:           [ 0, 25],
									t:           [ 0, 75],
									m:           [ 0, 75],
									other:       "20000 in funds",
									funds:       20000,
									overthrow:   ", the crook, has flouted the law and pilfered the treasury!"
								},
								bureaucrat: {
									name:        "bureaucrat",
									description: "slow progress with highly regulated government - and council rules",
									s:           [25,100],
									r:           [75,100],
									t:           [25,100],
									m:           [25,100],
									other:       "5+ council rules enacted",
									rules:       5,
									overthrow:   ", the bureaucrat, has made the government completely ineffective!"
								},
								monarchist: {
									name:        "monarchist",
									description: "bring about rule by a king, queen, or other monarch",
									s:           [25,100],
									r:           [25,100],
									t:           [ 0, 25],
									m:           [25,100],
									other:       "monarchy instated",
									rule:        "monarchy-instated",
									overthrow:   ", the monarchist, has brought about monarchial rule!"
								},
								factionalist: {
									name:        "factionalist",
									description: "become exceptionally popular amongst your own kind",
									s:           [ 0, 75],
									r:           [ 0, 75],
									t:           [ 0, 25],
									m:           [25,100],
									other:       "90%+ approval amongst own race, across all districts",
									approval:    90,
									overthrow:   ", the factionalist, has led their own faction to minority rule!"
								},
								apocalyptist: {
									name:        "apocalyptist",
									description: "end the world",
									s:           [ 0,100],
									r:           [ 0,100],
									t:           [ 0,100],
									m:           [ 0,100],
									other:       "reduce the population or cause a cataclysmic event",
									rule:        "immediate-end",
									overthrow:   ", the apocalyptist, has ended the world!"
								}
							}
						break

						case "realms":
							return ["Caledonia", "Faerponia", "The People's Republic", "Carasune", "Laige", "Beltoc", "Edilar", "Corano", "Ariule", "Seraveru", "Seltin", "Strelt", "Ocrano", "Hovalith", "Rescoth", "Nadroc", "Anago", "Pexis", "Quaris", "Bellun", "Venemith", "Hogate", "Isk", "Lisbith", "Tringe", "Orenth", "Ain", "Meleth", "Mullwood", "Aloonic Republic", "Torstonia", "Cotyllia", "Uzia Confederacy", "Hydris States", "Marle", "Precine Republic", "Priosian Alliance", "States of Phaleed", "Ivenin Confederacy", "Whitesea Coast", "Firestorm Coast", "Krostos", "Bellevue Nation", "Greater Greyton", "Ectilion Emirates", "United Provinces of Oris"]
						break

						case "rules":
							return {
								"absentee-voting": {
									description: "Rule: Cannot legislate while campaigning."
								},
								"balanced-budget": {
									description: "Rule: the treasury must become and stay positive."
								},
								"dark-money": {
									donationMultiplier: 2
								},
								"delayed-elections": {
									time: 600000
								},
								"executive-decision": {
									description: "Rule: the leader can make executive decisions on urgent issues.",
									timeout: 120000
								},
								"immediate-end": {
									description: "The world has ended. Everyone loses.",
									time: 5000
								},
								"anarchy-instated": {
									description: "The rebellion has taken down the government!"
								},
								"impartial-leader": {
									description: "Rule: leader cannot vote."
								},
								"kickback-ban": {
									donationMultiplier: 0
								},
								"leader-presence": {
									description: "Rule: leaders cannot leave to campaign for reelection."
								},
								"majority-threshold": {
									description: "Rule: options must have an outright majority."
								},
								"no-abstentions": {
									description: "Rule: members cannot abstain from voting."
								},
								"no-tabling": {
									description: "Rule: no tabling issues."
								},
								"no-self": {
									description: "Rule: cannot elect yourself leader."
								},
								"quick-voting": {
									description: "Rule: 60-second voting period.",
									timeout: 60000
								},
								"public-financing": {
									timeModulo: 300000,
									funds: 1000
								},
								"restricted-press": {
									approvalModifier: 0.5
								},
								"short-season": {
									description: "Rule: no campaigning allowed until last 5 minutes.",
									time: 300000
								},
								"snap-elections": {
									time: -600000
								},
								"term-length": {
									description: "Rule: leaders serve for 5+ minutes.",
									term: 300000
								},
								"term-limits": {
									description: "Rule: 5-minute term limit.",
									term: 300000
								},
								"tiebreaker-leader": {
									description: "Rule: in the event of a tie, the leader's choice carries."
								},
								"formal-language": {
									rules: "Point of Order: ",
									recall: "Motion of no confidence: ",
									tie: "Be it known: ",
									plurality: "Hear ye, hear ye! ",
									issue: "Resolved: In the case of: ",
									decision: "The Council has decreed: ",
									timeout: "Suspension of normal order! ",
									"insufficient-treasury": "A grave misfortune! ",
									"insufficient-military": "Alas! ",
									"insufficient-cutbacks": "Forsooth! ",
								}
							}
						break

						case "issues":
							return {
								// mechanics
									leader:    [
										{name: "Leader: choose a member to select which issues are debated.", type: "leader", timeout: 120000}
									],
									austerity: [
										{name: "Austerity: the realm is bankrupt!", type: "austerity", timeout: 180000, options: [
											{name: "Do nothing.", constituents: {d: {approval: -15}, e: {approval: -15}, f: {approval: -15}, g: {approval: -15}, l: {approval: -15}}, issues: {"0-1": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}},
											{name: "Tax the wealthy.", treasury: 15000, constituents: {d: {approval: -15}, e: {approval: -15}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}},
											{name: "Tax the populace.", treasury: 15000, funds: 1000, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -15}, g: {approval: -15}, l: {approval: -15}}},
											{name: "Tax the politicians.", treasury: 15000, funds: -3000, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}},
											{name: "Eliminate social programs.", treasury: 15000, agencies: {s: -20}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: -5}, l: {approval: 5}}},
											{name: "Cut back on regulation.", treasury: 15000, funds: 1000, agencies: {r: -20}, constituents: {d: {approval: 10}, e: {approval: -10}, f: {approval: -10}, g: {approval: 5}, l: {approval: 5}}},
											{name: "Limit education and technology funding.", treasury: 15000, agencies: {t: -20}, constituents: {d: {approval: -5}, e: {approval: -15}, f: {approval: -5}, g: {approval: 10}, l: {approval: 5}}},
											{name: "Reduce the size of the military.", treasury: 15000, agencies: {m: -20}, constituents: {d: {approval: -10}, e: {approval: 10}, f: {approval: 15}, g: {approval: -10}, l: {approval: -15}}},
										]}
									],
									rebellion: [
										{name: "Rebellion: a rebellion attempts to overthrow the council!", type: "rebellion", timeout: 180000, options: [
											{name: "Do nothing.", rules: [{name: "anarchy-instated", enact: true}]},
											{name: "Meet the rebels' demands.", treasury: -20000, agencies: {s: -5, r: -10}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 15}}},
											{name: "Suppress the rebels - casualties expected.", treasury: -10000, agencies: {m: -15}, constituents: {d: {approval: 10, population: -1000}, e: {approval: 5, population: -1000}, f: {approval: -5, population: -1000}, g: {approval: 15, population: -1000}, l: {approval: 10, population: -1000}}}
										]}
									],
									collapse: [
										{name: "Nearly everyone has died.", type: "collapse", timeout: 10000, options: [
											{name: "Transcribe what happened here, that future realms may learn from our mistakes.", agencies: {t: 5}, rules: [{name: "immediate-end", enact: true}]}
										]}
									],

								// rule repeal
									repeal:    [
										{name: "Repeal: 5-minute term limits for council leader.",                                     type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", funds: 1000, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: -5}}, rules: [{name: "term-limits", enact: false}]}]},
										{name: "Repeal: 5-minute minimum term for council leader.",                                    type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", rules: [{name: "term-length", enact: false}]}]},
										{name: "Repeal: council leader cannot unselect an issue.",                                     type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: -5}, g: {approval: -5}}, rules: [{name: "no-tabling", enact: false}]}]},
										{name: "Repeal: 1-minute voting period for all issues.",                                       type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: -5}}, rules: [{name: "quick-voting", enact: false}]}]},
										{name: "Repeal: options must have an outright majority to be enacted.",                        type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {g: {approval: -5}, l: {approval: -5}}, rules: [{name: "majority-threshold", enact: false}]}]},
										{name: "Repeal: council members can vote while campaigning.",                                  type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", rules: [{name: "absentee-voting", enact: false}]}]},
										{name: "Repeal: council leader cannot leave to campaign.",                                     type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", funds: 1000, rules: [{name: "leader-presence", enact: false}]}]},
										{name: "Repeal: the treasury must stay positive.",                                             type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", funds: 1000, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}}, rules: [{name: "balanced-budget", enact: false}]}]},
										{name: "Repeal: all present members must vote - no abstentions.",                              type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "no-abstentions", enact: false}]}]},
										{name: "Repeal: council leader does not vote on issues.",                                      type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: 5}, e: {approval: -5}}, rules: [{name: "impartial-leader", enact: false}]}]},
										{name: "Repeal: council leader wields tiebreaking vote.",                                      type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: -5}, e: {approval: 5}}, rules: [{name: "tiebreaker-leader", enact: false}]}]},
										{name: "Repeal: council members barred from receiving corporate kickbacks.",                   type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", funds: 2000, agencies: {r: -10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}}, rules: [{name: "kickback-ban", enact: false}]}]},
										{name: "Repeal: council members barred from taking constituent donations.",                    type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", agencies: {r: -5}, constituents: {e: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "donation-ban", enact: false}]}]},
										{name: "Repeal: the press has limited access to government, dampening approval swings.",       type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", agencies: {s: 5}, constituents: {e: {approval: 15}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "restricted-press", enact: false}]}]},
										{name: "Repeal: council members' votes undisclosed, so approvals reflect enacted option.",     type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}, rules: [{name: "secret-voting", enact: false}]}]},
										{name: "Repeal: voting age requirements are lowered.",                                         type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: -5, population: -1000}, e: {approval: 10}, f: {approval: -10, population: -2000}, g: {approval: -5, population: -2000}, l: {approval: -5, population: -1000}}, rules: [{name: "lower-age", enact: false}]}]},
										{name: "Repeal: there is a maximum voting age.",                                               type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: 5, population: 1000}, e: {approval: 15, population: 2000}, g: {approval: -5}}, rules: [{name: "maximum-age", enact: false}]}]},
										{name: "Repeal: convicted criminals barred from voting.",                                      type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", agencies: {s: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10, population: 2000}, l: {approval: 5, population: 1000}}, rules: [{name: "felon-disenfranchisement", enact: false}]}]},
										{name: "Repeal: poll tax for national elections.",                                             type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", treasury: -10000, agencies: {s: 5}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 5, population: 1000}, g: {approval: 15, population: 2000}, l: {approval: 10, population: 1000}}, rules: [{name: "poll-tax", enact: false}]}]},
										{name: "Repeal: height restrictions for national elections.",                                  type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: 15, population: 2000}, e: {approval: -5}, f: {approval: 15, population: 2000}, g: {approval: 15, population: 2000}, l: {approval: -5}}, rules: [{name: "height-restrictions", enact: false}]}]},
										{name: "Repeal: elections have been delayed.",                                                 type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", rules: [{name: "delayed-elections", enact: false}]}]},
										{name: "Repeal: elections have been moved sooner.",                                            type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", rules: [{name: "snap-elections", enact: false}]}]},
										{name: "Repeal: council leaders cannot serve consecutive terms.",                              type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {e: {approval: -5}}, rules: [{name: "no-consecutives", enact: false}]}]},
										{name: "Repeal: council members cannot vote for themselves for leader.",                       type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "no-self", enact: false}]}]},
										{name: "Repeal: campaigning is only allowed 5 minutes before the election.",                   type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", funds: 1000, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "short-season", enact: false}]}]},
										{name: "Repeal: council leader can make executive decisions on issues with < 2 minutes left.", type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", constituents: {d: {approval: -10}, e: {approval: 15}, f: {approval: 10}, g: {approval: -15}, l: {approval: -10}}, rules: [{name: "executive-decision", enact: false}]}]},
										{name: "Repeal: thorough polling presents accurate approval ratings.",                         type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", treasury: 5000, funds: 1000, agencies: {t: -5}, constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: 5}, g: {approval: 10}, l: {approval: 10}}, rules: [{name: "accurate-polling", enact: false}]}]},
										{name: "Repeal: government audits project accurate agency changes.",                           type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", treasury: 5000, agencies: {s: -5}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "accurate-estimates", enact: false}]}]},
										{name: "Repeal: council leader's campaign funds must be disclosed.",                           type: "repeal", timeout: 300000, options: [{name: "Keep the rule."}, {name: "Repeal the rule.", funds: 2000, agencies: {r: -5}, constituents: {d: {approval: 10}, e: {approval: -10}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "financial-disclosure", enact: false}]}]},
										{name: "Repeal: elven scholars propose changing the nation's name to its ancient name.",       type: "repeal", timeout: 300000, options: [{name: "Keep the change."}, {name: "Undo the change.", constituents: {d: {approval: 10}, e: {approval: -15}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "alternate-name", enact: false}]}]},
										{name: "Repeal: formalize language for all council proceedings.",                              type: "repeal", timeout: 300000, options: [{name: "Keep the change."}, {name: "Undo the change.", agencies: {t: -5}, constituents: {e: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "formal-language", enact: false}]}]},
										{name: "Repeal: public financing of campaigns, rather than constituent donations.",            type: "repeal", timeout: 300000, options: [{name: "Keep the rule.", treasury: -10000, issues: {"0-0.5": {type: "effect", name: "The people accuse the council of corruption."}}}, {name: "Undo the change.", agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "public-financing", enact: false}]}]},
										{name: "Repeal: commission and display a new national flag.",                                  type: "repeal", timeout: 300000, options: [{name: "Keep the change."}, {name: "Undo the change.", treasury: -4000, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, rules: [{name: "alternate-flag", enact: false}]}]},
									],

								// protest
									protest:  [
										{name: "Protest: poisoned wine in council members' chalices kills servants.",                          type: "protest", timeout: 180000, options: [{name: "Do nothing.", issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Research poison detection.", treasury: -3000, agencies: {r: 5, t: 5}, constituents: {e: {approval: 5}, l: {approval: -5}}}, {name: "Public execution of the likely culprits.", agencies: {m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "New evidence exonerates recently executed criminals."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "large", name: "Enact: council members' votes undisclosed, so approvals reflect enacted option."}, "0-2": {delay: 0, type: "large", name: "Enact: the press has limited access to government, dampening approval swings."}}}]},
										{name: "Protest: arrows fired on the leader at night, narrowly miss.",                                 type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Move the council to a secret location.", treasury: -5000, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A spy betrays the council's secret location."}}}, {name: "Hire more guards to protect the council.", treasury: -3000, agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, l: {approval: 5}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {e: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "small", name: "Enact: 5-minute term limits for council leader."}, "0-2": {delay: 0, type: "small", name: "Enact: council leaders cannot serve consecutive terms."}}}]},
										{name: "Protest: assassin sneaks into leader's chamber, foiled by guards.",                            type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Create a special palace for the leader.", treasury: -5000, funds: 1000, agencies: {s: 5}, constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "The people accuse the council of corruption."}}}, {name: "Create an elite force of guards for the leader.", treasury: -5000, agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "large", name: "Enact: the press has limited access to government, dampening approval swings."}, "0-2": {delay: 0, type: "small", name: "Enact: 5-minute term limits for council leader."}}}]},
										{name: "Protest: mysterious sorcerer casts lightning bolt at council members, no injuries sustained.", type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.75": {type: "effect", name: "Beautiful sorceress-queen infiltrates the government."}}}, {name: "Impose restrictions on magic usage in public.", funds: 1000, agencies: {r: 10}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}}}, {name: "Infiltrate the cult of the Air Gods.", agencies: {m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "medium", name: "Enact: council members barred from receiving corporate kickbacks."}, "0-2": {delay: 0, type: "medium", name: "Enact: thorough polling presents accurate approval ratings."}}}]},
										{name: "Protest: capitol set on fire, no casualties.",                                                 type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Create a public fire-fighting force.", treasury: -5000, funds: 1000, agencies: {s: 10, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 10}, g: {approval: -5}, l: {approval: 5}}}, {name: "Hire wizards to cast protection from fire on city structures.", treasury: -3000, agencies: {s: 5, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Citizens who can't pay for protection have their homes wrecked."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "small", name: "Enact: government audits project accurate agency changes."}, "0-2": {delay: 0, type: "small", name: "Enact: public financing of campaigns, rather than constituent donations."}}}]},
										{name: "Protest: aristocrats' homes are ransacked by vandals in the night.",                           type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -15}, e: {approval: -15}, f: {approval: -5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Establish a curfew and restrict movements", treasury: -5000, agencies: {r: 10, m: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: -10}, l: {approval: 5}}}, {name: "Round up and execute the terrorists.", agencies: {r: -5, m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "New evidence exonerates recently executed criminals."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "small", name: "Enact: formalize language for all council proceedings."}, "0-2": {delay: 0, type: "medium", name: "Enact: council members barred from taking constituent donations."}}}]},
										{name: "Protest: protesters march on the capitol.",                                                    type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Ban public gatherings of large groups.", agencies: {r: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Send out the army to kill protestors who approach the council.", treasury: -3000, agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "medium", name: "Enact: the treasury must stay positive."}, "0-2": {delay: 0, type: "small", name: "Enact: options must have an outright majority to be enacted."}}}]},
										{name: "Protest: elves and dwarves clash in the streets.",                                             type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -15}, e: {approval: -15}}, issues: {"0-0.5": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Blame it on the elves & imprison them.", funds: 1000, agencies: {m: 5}, constituents: {d: {approval: 15}, e: {approval: -15}}, issues: {"0-0.5": {type: "effect", name: "A mob of elves marches on the capitol."}}}, {name: "Blame it on the dwarves & imprison them.", funds: 1000, agencies: {m: 5}, constituents: {d: {approval: -15}, e: {approval: 15}}, issues: {"0-0.5": {type: "effect", name: "A mob of dwarves marches on the capitol."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "small", name: "Enact: elven scholars propose changing the nation's name to its ancient name."}, "0-2": {delay: 0, type: "medium", name: "Enact: the treasury must stay positive."}}}]},
										{name: "Protest: impoverished goblins eat nobles' pets.",                                              type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -10}, e: {approval: -10}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Round up the goblins involved & burn them at the stake.", treasury: -1000, agencies: {r: -5, m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -15, population: -1000}}, issues: {"0-0.75": {type: "effect", name: "A mob of goblins marches on the capitol."}}}, {name: "Establish a welfare system for hungry goblins.", treasury: -8000, agencies: {s: 15}, constituents: {d: {approval: -10}, e: {approval: -10}, g: {approval: 15}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, f: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "small", name: "Enact: formalize language for all council proceedings."}, "0-2": {delay: 0, type: "medium", name: "Enact: voting age requirements are lowered."}}}]},
										{name: "Protest: angry lizardfolk riot and plunder.",                                                  type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 10}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Hire an ice witch to make the capitol too cold for lizardfolk.", treasury: -3000, agencies: {t: 5}, constituents: {d: {approval: 5}, f: {approval: -5}, l: {approval: -10, population: -1000}}, issues: {"0-0.5": {type: "large", name: "Snow princess threatens eternal winter unless her demands are met."}}}, {name: "Work with lizardfolk authorities to identify and prosecute the rioters.", treasury: -3000, agencies: {m: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of lizardfolk marches on the capitol."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "medium", name: "Enact: commission and display a new national flag."}, "0-2": {delay: 0, type: "small", name: "Enact: government audits project accurate agency changes."}}}]},
										{name: "Protest: fairies flock to the capitol for a demonstration.",                                   type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {e: {approval: 10}, f: {approval: 10}, g: {approval: -5}}}, {name: "Establish a no-fly zone to restrict fairy movements.", treasury: -2000, agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -15}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of fairies marches on the capitol."}}}, {name: "Imprison the fairies involved.", agencies: {m: 5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of fairies marches on the capitol."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "medium", name: "Enact: voting age requirements are lowered."}, "0-2": {delay: 0, type: "medium", name: "Enact: all present members must vote - no abstentions."}}}]},
										{name: "Protest: dwarven saboteurs literally undermine the capitol.",                                  type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: -5}, l: {approval: -5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Impose licensing requirements on mining equipment.", treasury: -2000, funds: 1000, agencies: {r: 10, t: 5}, constituents: {d: {approval: -15}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}}}, {name: "Hold a public stoning for the saboteurs.", treasury: -1000, agencies: {m: 5}, constituents: {d: {approval: -5, population: -1000}, e: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "New evidence exonerates recently executed criminals."}, "0-0.75": {type: "effect", name: "A mob of dwarves marches on the capitol."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "medium", name: "Enact: the treasury must stay positive."}, "0-2": {delay: 0, type: "small", name: "Enact: government audits project accurate agency changes."}}}]},
										{name: "Protest: elf sorceress summons unicorn stampede to overrun goblins.",                          type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: -15}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Restrict transporation to non-magical animals.", treasury: -1000, funds: 1000, agencies: {r: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 10}, l: {approval: -5}}}, {name: "Research anti-magic technology.", treasury: -5000, agencies: {r: 5, t: 15}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "small", name: "Enact: elven scholars propose changing the nation's name to its ancient name."}, "0-2": {delay: 0, type: "small", name: "Enact: options must have an outright majority to be enacted."}}}]},
										{name: "Protest: lizardfolk warlock summons a hydra to demolish fairy villages.",                      type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {f: {approval: -15, population: -2000}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Help the fairies rebuild.", treasury: -5000, funds: 1000, agencies: {s: 15, t: 5}, constituents: {e: {approval: 5}, f: {approval: 15}}}, {name: "Create a national register of lizardfolk wizards.", treasury: -3000, agencies: {r: 5}, constituents: {f: {approval: 10}, g: {approval: 5}, l: {approval: -10}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}, "0.5-1": {type: "effect", name: "A mob of lizardfolk marches on the capitol."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "medium", name: "Enact: thorough polling presents accurate approval ratings."}, "0-2": {delay: 0, type: "small", name: "Enact: 5-minute term limits for council leader."}}}]},
										{name: "Protest: ice witch hired by goblins freezes over the capitol.",                                type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {f: {approval: -5}, g: {approval: 5}, l: {approval: -10}}, issues: {"0-0.75": {type: "large", name: "Snow princess threatens eternal winter unless her demands are met."}}}, {name: "Ban the use of ice magic.", treasury: -1000, agencies: {r: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -10}, l: {approval: 15}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}}}, {name: "Offer free firewood and coal to citizens.", treasury: -5000, agencies: {s: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 5}, l: {approval: 10}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "small", name: "Enact: options must have an outright majority to be enacted."}, "0-2": {delay: 0, type: "medium", name: "Enact: commission and display a new national flag."}}}]},
										{name: "Protest: an unhappy populace dumps market wares into the river.",                              type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Hire a water wizard to recover the goods.", treasury: -3000, funds: 1000, agencies: {s: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, l: {approval: 5}}}, {name: "Double the presence of armed guards in the markets.", treasury: -5000, funds: 1000, agencies: {s: 5, r: 5, m: 15}, constituents: {d: {approval: 10}, f: {approval: -5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Violence erupts in the markets."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "small", name: "Enact: government audits project accurate agency changes."}, "0-2": {delay: 0, type: "medium", name: "Enact: 1-minute voting period for all issues."}}}]},
										{name: "Protest: political dissidents take minor officials hostage.",                                  type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {e: {approval: -5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Negotiate with the criminals to recover the hostages.", treasury: -10000, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Swarm the place with soldiers, killing everybody.", treasury: -2000, agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Violence erupts in the markets."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "small", name: "Enact: council members cannot vote for themselves for leader."}, "0-2": {delay: 0, type: "medium", name: "Enact: council members barred from receiving corporate kickbacks."}}}]},
										{name: "Protest: working class protestors destroy the mansions of wealthy nobles.",                    type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -10}, e: {approval: -10}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Pay for the damages and rebuild.", treasury: -8000, funds: 1000, agencies: {s: 10, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "The people accuse the council of corruption."}}}, {name: "Meet the protestors' demands and improve working class wages.", agencies: {s: 5, r: 10}, constituents: {d: {approval: -10}, f: {approval: 5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Violence erupts in the markets."}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {delay: 0, type: "medium", name: "Enact: thorough polling presents accurate approval ratings."}, "0-2": {delay: 0, type: "small", name: "Enact: 5-minute term limits for council leader."}}}]},
										{name: "Protest: tax collectors are rounded up by angry mobs.",                                        type: "protest", timeout: 180000, options: [{name: "Do nothing.", treasury: -8000, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Hire new tax collectors - and body guards.", treasury: 5000, agencies: {s: 5, r: 10, m: 5}, constituents: {d: {approval: -10}, g: {approval: -5}, l: {approval: -5}}}, {name: "Lower taxes to secure the hostages' release.", treasury: -10000, agencies: {r: -5}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: 5}, g: {approval: 10}, l: {approval: 10}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "medium", name: "Enact: the treasury must stay positive."}, "0-2": {delay: 0, type: "medium", name: "Enact: council members barred from receiving corporate kickbacks."}}}]},
										{name: "Protest: riots in the streets!",                                                               type: "protest", timeout: 180000, options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.75": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Send out the archers to kill the rioters.", treasury: -2000, agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Change the city street system to make future riots less likely.", treasury: -5000, agencies: {s: 5, r: 5, t: 15}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -5}}}, {name: "Acknowledge mistakes, donate to charity, and consider new council rules.", funds: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-1": {delay: 0, type: "medium", name: "Enact: commission and display a new national flag."}, "0-2": {delay: 0, type: "small", name: "Enact: 5-minute term limits for council leader."}}}]},
									],
								
								// random issues
									small:     [
										{name: "Enact: 5-minute term limits for council leader.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", funds: -1000, constituents: {e: {approval: -5}, f: {approval: 5}, g: {approval: 5}}, rules: [{name: "term-limits", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: 5-minute term limits for council leader."}}}]},
										{name: "Enact: 5-minute minimum term for council leader.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", rules: [{name: "term-length", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: 5-minute minimum term for council leader."}}}]},
										{name: "Enact: council leader cannot unselect an issue.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: 5}, g: {approval: 5}}, rules: [{name: "no-tabling", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council leader cannot unselect an issue."}}}]},
										{name: "Enact: options must have an outright majority to be enacted.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {g: {approval: 5}, l: {approval: 5}}, rules: [{name: "majority-threshold", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: options must have an outright majority to be enacted."}}}]},
										{name: "Enact: council leader cannot leave to campaign.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", rules: [{name: "leader-presence", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council leader cannot leave to campaign."}}}]},
										{name: "Enact: council leader does not vote on issues.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: -5}, e: {approval: 5}}, rules: [{name: "impartial-leader", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council leader does not vote on issues."}}}]},
										{name: "Enact: council leaders cannot serve consecutive terms.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {e: {approval: 5}}, rules: [{name: "no-consecutives", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council leaders cannot serve consecutive terms."}}}]},
										{name: "Enact: council members cannot vote for themselves for leader.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "no-self", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council members cannot vote for themselves for leader."}}}]},
										{name: "Enact: government audits project accurate agency changes.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", treasury: -5000, funds: 1000, agencies: {s: 5}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "accurate-estimates", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: government audits project accurate agency changes."}}}]},
										{name: "Enact: council leader's campaign funds must be disclosed.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", agencies: {r: 5}, constituents: {d: {approval: -10}, e: {approval: 10}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "financial-disclosure", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council leader's campaign funds must be disclosed."}}}]},
										{name: "Enact: elven scholars propose changing the nation's name to its ancient name.", type: "enact", options: [{name: "Don't change the name."}, {name: "Change the name.", constituents: {d: {approval: -10}, e: {approval: 15}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "alternate-name", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: elven scholars propose changing the nation's name to its ancient name."}}}]},
										{name: "Enact: formalize language for all council proceedings.", type: "enact", options: [{name: "Don't formalize the language."}, {name: "Formalize the language.", agencies: {t: 5}, constituents: {e: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "formal-language", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: formalize language for all council proceedings."}}}]},
										{name: "Enact: public financing of campaigns, rather than constituent donations.", type: "enact", options: [{name: "Keep it as-is: people donate to popular candidates."}, {name: "Ban individual donations, and take campaign funds from the treasury every 2 minutes.", treasury: -10000, agencies: {t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "public-financing", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: public financing of campaigns, rather than constituent donations."}}}]},
										{name: "Goblin lumberjacks petition to build mill in the enchanted forest.", type: "small", options: [{name: "Deny the permit.", agencies: {r: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: -10}}, issues: {"0-0.5": {type: "effect", name: "They decide to build anyway."}}}, {name: "Approve the permit.", treasury: 3000, funds: 1000, agencies: {r: -5}, constituents: {e: {approval: -5}, f: {approval: -5}, g: {approval: 10}}, issues: {"0.5-1": {type: "medium", name: "Displaced fairies begin an illegal settlement in dwarven hills."}}}, {name: "Declare the enchanted forest a national park.", treasury: -2000, agencies: {s: 10, r: 5}, constituents: {e: {approval: 10}, f: {approval: 15}, g: {approval: -10}}}]},
										{name: "Animal rights activists petition to ban jousting.", type: "small", options: [{name: "Allow jousting to continue.", funds: 1000, agencies: {r: -5}, constituents: {d: {approval: 5}, f: {approval: -10}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Celebrity swordsman / jousting champion leads a political movement to replace the council."}}}, {name: "Outlaw jousting to protect horses.", treasury: -2000, agencies: {r: 10}, constituents: {f: {approval: 15}}}, {name: "Encourage jousting with other creatures, like unicorns.", funds: 1000, agencies: {r: -10}, constituents: {d: {approval: 5}, f: {approval: -10}, g: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}]},
										{name: "Postal service running low on funds.", type: "small", options: [{name: "Let private couriers take over the industry.", funds: 1000, agencies: {s: -10}, constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Goblin beastmasters train carrier pigeons to compete with fairy messengers."}}}, {name: "Provide more funding for the post office.", treasury: -2000, agencies: {s: 5}, constituents: {e: {approval: 5}}}, {name: "Increase the price of stamps.", treasury: 2000, agencies: {s: 5}, constituents: {f: {approval: -5}, g: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Goblin beastmasters train carrier pigeons to compete with fairy messengers."}}}]},
										{name: "Traveling performers arrive in the realm.", type: "small", options: [{name: "Ignore them, and let them perform.", constituents: {f: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Some travelers are discovered to be foreign spies."}}}, {name: "Hire them to perform free for all citizens.", treasury: -2000, agencies: {s: 5}, constituents: {d: {approval: -5}, f: {approval: 10}, g: {approval: 10}, l: {approval: -5}}}, {name: "Require a license for public performance.", treasury: 2000, agencies: {r: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}}}]},
										{name: "University troubadours perform the new national anthem.", type: "small", options: [{name: "Good job.", constituents: {e: {approval: 5}, f: {approval: 5}}}, {name: "Increase funding for the arts.", treasury: -2000, agencies: {s: 5, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 10}, g: {approval: -5}}}, {name: "Outlaw non-patriotic musical performances.", agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}}}]},
										{name: "Cobbler refuses to pay elf workers, denies they are employees.", type: "small", options: [{name: "Trust the cobbler.", funds: 1000, constituents: {e: {approval: -10}}}, {name: "Fine the cobbler for labor rights violations.", treasury: 1000, agencies: {r: 5}, constituents: {e: {approval: 5}}}, {name: "Establish a watchdog bureau to oversee employment contracts.", agencies: {s: 5, r: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Economic opportunity leads to greater immigration."}}}]},
										{name: "Dwarves prohibited from whistling during working hours by mining company.", type: "small", options: [{name: "Let business owners set workplace policies.", funds: 1000, agencies: {r: -5}, constituents: {d: {approval: -5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Ban whistling across all businesses.", agencies: {r: 10}, constituents: {d: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Support whistling workers - fine the company.", treasury: 3000, agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Coal shortage threatens to leave many to freeze this winter."}}}]},
										{name: "Headless horseman terrorizes goblin farmers, exposed as fairy hoax.", type: "small", options: [{name: "Stay out of this harmless prank.", agencies: {r: -5}, constituents: {f: {approval: 5}, g: {approval: -10}}}, {name: "Prosecute the fairies involved as criminals.", agencies: {m: 5}, constituents: {f: {approval: -5}, g: {approval: 10}}}, {name: "Seize orchard land from fairies and redistribute to goblins.", treasury: 1000, funds: 1000, agencies: {m: 10}, constituents: {e: {approval: -5}, f: {approval: -15}, g: {approval: 15}}, issues: {"0-0.5": {type: "effect", name: "A mob of fairies marches on the capitol."}}}]},
										{name: "Poisoned apples sold at market by old hag.", type: "small", options: [{name: "Offer thoughts and prayers to the victims.", agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Violence erupts in the markets."}}}, {name: "Poison the old hag with her own apples.", agencies: {m: 5},  constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}, {name: "Establish food safety rules and research poison detection spells.", treasury: -2000, agencies: {s: 5, r: 5, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Ice magic innovation leads to better food preservation."}}}]},
										{name: "Noblewoman falls into coma, family blames shoddy craftsmanship of spinning wheel.", type: "small", options: [{name: "Offer condolences about this tragedy.", constituents: {f: {approval: 5}, g: {approval: 5}}}, {name: "Denounce the family as charlatans seeking fortune.", funds: 1000, constituents: {d: {approval: 5}, e: {approval: -5}, g: {approval: 5}}}, {name: "Investigate claims of witchcraft.", agencies: {r: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 5}}}]},
										{name: "Talking cat swordsman challenges passersby to duels.", type: "small", options: [{name: "That's ridiculous.", constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}, {name: "Place a bounty on the cat's head.", treasury: -1000, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}, {name: "Make the cat a general in the army.", agencies: {m: 5}, constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: 5}}}]},
										{name: "Mute woman emerges from the ocean.", type: "small", options: [{name: "Grant her political asylum.", agencies: {s: 5, r: -5}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Beautiful sorceress-queen infiltrates the government."}}}, {name: "Deny her entry - send her back into the ocean.", treasury: -1000, agencies: {r: 5, m: 5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 10}}}, {name: "Fund the creation of a new sign language for mute sea people.", agencies: {t: 10}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: -5}}}]},
										{name: "Boy cries wolf.", type: "small", options: [{name: "Ignore the boy.", issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}, {name: "Send out the army to find the wolf.", treasury: -1000, agencies: {m: 5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}, {name: "Build a giant fence around the farm country.", treasury: -2000, agencies: {s: 10, m: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, l: {approval: -5}}}]},
										{name: "Cult of the moon god grows popular amongst elves.", type: "small", options: [{name: "Respect religious freedom.", constituents: {e: {approval: 10}, f: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Cult of the moon god grows amongst fairies, elves, and goblins."}}}, {name: "Make Lunarism the national religion and build a national temple.", funds: 1000, treasury: -3000, agencies: {s: 10, r: 5}, constituents: {d: {approval: -10}, e: {approval: 10}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Night watch strike for better pay and healthcare benefits."}}}, {name: "Label them Lunies and encourage more mainstream religions.", funds: 1000, constituents: {d: {approval: 10}, e: {approval: -10}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}]},
										{name: "Farmers argue over poisoned pumpkins rotting in the field.", type: "small", options: [{name: "Let them resolve their own dispute.", agencies: {t: -5}, constituents: {e: {approval: 5}, g: {approval: 5}}}, {name: "Send wizards to investigate and contain the pestilence.", treasury: -1000, agencies: {s: 5, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 5}}}, {name: "Burn the fields out of caution.", treasury: -1000, agencies: {r: 5, t: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -10}, l: {approval: -5}}}]},
										{name: "Hunters decimate rabbit population.", type: "small", options: [{name: "Who needs rabbits?", funds: 1000, agencies: {r: -5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}, {name: "Designate hunting-free areas and a shorter hunting season.", treasury: -1000, agencies: {r: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: -5}}}, {name: "Work with potion-makers to concoct synthetic pelts.", treasury: -2000, agencies: {t: 5}, constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: -5}}}]},
										{name: "Bridge troll raises rates going into the capitol.", type: "small", options: [{name: "Let the free market decide traffic patterns.", funds: 1000, agencies: {s: -5, r: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Nationalize all bridges, but keep tolls high.", treasury: 5000, agencies: {s: 10, r: 5}, constituents: {d: {approval: -10}, e: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Nationalize all bridges and eliminate tolls.", treasury: -2000, agencies: {s: 10}, constituents: {d: {approval: -10}, e: {approval: 5}}}]},
										{name: "Butter shortage drives up the price of pastries.", type: "small", options: [{name: "Let the free market decide pastry prices.", agencies: {s: -5, r: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}}}, {name: "Trade with neighboring regions for more dairy.", treasury: -3000, agencies: {s: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}}}, {name: "Seize control of dairy farms and ration supplies.", treasury: 3000, agencies: {s: 15, r: 5}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of elves marches on the capitol."}}}]},
										{name: "Homes built by goblin construction company razed by lone wolf.", type: "small", options: [{name: "Remind homebuyers to insure their assets.", funds: 1000, agencies: {s: -5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Citizens who can't pay for protection have their homes wrecked."}}}, {name: "Hold goblins accountable for subpar construction, ban future projects.", treasury: 1000, agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "They decide to build anyway."}}}, {name: "Equip archers with silver-tipped arrows to hunt down the wolf.", treasury: -3000, agencies: {t: 5, m: 10}, constituents: {d: {approval: 5}, f: {approval: 5}, g: {approval: 10}}}]},
										{name: "Hive collapse affects honey farmers.", type: "small", options: [{name: "Allow honey prices to adjust on their own.", agencies: {s: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Famine! A bad harvest cannot sustain the population."}}}, {name: "Cast protection spells on remaining hives.", treasury: -2000, agencies: {s: 5}, constituents: {e: {approval: 5}, f: {approval: 5}}}, {name: "Invest in a new agricultural research institute.", treasury: -5000, agencies: {s: 5, t: 10}, constituents: {d: {approval: -5}, e: {approval: 10}, g: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Ice magic innovation leads to better food preservation."}}}]},
										{name: "Elven witch doctor claims essential oils possess healing properties.", type: "small", options: [{name: "Maybe they do though.", funds: 1000, agencies: {r: -5}, constituents: {e: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}}}, {name: "Require magicians to provide proof of all medicinal claims.", agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}}}, {name: "Appoint the witch doctor to a position of leadership.", treasury: -1000, agencies: {t: 5}, constituents: {e: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Elf magister publishes controversial research on cloning."}}}]},
										{name: "Dwarf merchant claims crystals have magic powers.", type: "small", options: [{name: "Maybe they do though.", funds: 1000, agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}}, {name: "Create a bureau of magic stone detection.", treasury: -2000, agencies: {r: 5, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Take control of the mine and all of its minerals.", treasury: 10000, agencies: {t: 5}, constituents: {d: {approval: -15}, e: {approval: 5}, f: {approval: 5}}}]},
										{name: "A hurricane traps schoolchildren in an underwater mine.", type: "small", options: [{name: "Offer condolences to their families.", agencies: {s: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Send in a team of elite divers.", treasury: -1000, agencies: {s: 5}, constituents: {f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Fund construction of a child-sized submersible.", treasury: -3000, agencies: {t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}, l: {approval: -5}}}]},
										{name: "Goose lays golden eggs.", type: "small", options: [{name: "Congratulate the farm-owner on their new fortune.", constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: -5}}}, {name: "Send researchers to begin a breeding program.", treasury: -2000, agencies: {t: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, l: {approval: 5}}}, {name: "Declare this goose a national treasure.", treasury: 10000, agencies: {r: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Looters steal prized items from government facilities."}, "0.5-1": {type: "effect", name: "Gold!"}}}]},
										{name: "Fairy students create a new form of abstract art.", type: "small", options: [{name: "Don't get involved in the art world.", constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}, {name: "Commission public art works throughout the realm.", treasury: -5000, agencies: {s: 5, t: 5}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: 10}, g: {approval: -5}, l: {approval: -5}}}, {name: "Declare abstract art a subversive act of treason.", agencies: {r: 10}, constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: -10}, g: {approval: 5}}}]},
										{name: "Elf flautist summons thousands of rats.", type: "small", options: [{name: "Remind the public to wash their hands before meals.", agencies: {s: -5, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Stray cat population explodes."}}}, {name: "Create a new Rat Stealth branch of the army.", treasury: -3000, agencies: {t: 5, m: 10}, constituents: {d: {approval: -5}, f: {approval: -5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}}}, {name: "Exile this elf and ban the flute.", agencies: {r: 10}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}}}]},
										{name: "Stray cat population explodes.", type: "small", options: [{name: "Pet the cats.", agencies: {r: -5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}}}, {name: "Create a national recipe book for cat meat dishes.", treasury: -3000, agencies: {s: 5}, constituents: {d: {approval: -5}, e: {approval: -10}, f: {approval: -10}, g: {approval: 10}, l: {approval: 5}}}, {name: "Release stray dogs into the streets.", agencies: {s: -5, r: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}]},
										{name: "Lizardperson falls into dwarven pit mine.", type: "small", options: [{name: "Tell citizens to be more careful.", funds: 1000, agencies: {r: -10}, constituents: {d: {approval: 5}, l: {approval: -10}}}, {name: "Fine the lizardperson for trespassing.", treasury: 2000, agencies: {r: 5}, constituents: {d: {approval: 10}, g: {approval: -5}, l: {approval: -10}}}, {name: "Fine the dwarves for safety violations and cover the healthcare costs.", agencies: {s: 5, r: 10}, constituents: {d: {approval: -5}, l: {approval: 10}}, issues: {"0-0.5": {type: "small", name: "Injured lizardperson sues fairy owner of self-driving trade wagon company."}}}]},
										{name: "Smithing guild bars goblins from joining.", type: "small", options: [{name: "Allow guilds to make their own membership decisions.", funds: 1000, agencies: {r: -5}, constituents: {d: {approval: 10}, e: {approval: 10}, g: {approval: -10}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Fairies and goblins petition for free universal trade apprenticeships."}}}, {name: "Force all guilds to admit members regardless of race.", agencies: {r: 5}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Economic opportunity leads to greater immigration."}}}, {name: "Create a national system of public trade guilds.", treasury: -5000, agencies: {s: 15, t: 10}, constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: 10}}, issues: {"0-0.5": {type: "medium", name: "International Alchemy & Armor Association wants to host its annual convention in the capitol."}}}]},
										{name: "Magician farmer invents apple-orange hybrid, orple.", type: "small", options: [{name: "Let the market decide the price of orples.", agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Order wizards to conduct research on orples.", treasury: -2000, agencies: {r: 5, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Make orples the national fruit, declare it Orple Day, sell orples to neighboring realms.", funds: 1000, treasury: 5000, agencies: {s: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "International Alchemy & Armor Association wants to host its annual convention in the capitol."}, "0.5-1": {type: "medium", name: "Fairy disease discovered that stunts wing growth."}}}]},
										{name: "Scholars propose constructing a national library.", type: "small", options: [{name: "If there's demand, someone will build a for-profit library.", agencies: {s: -5, t: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, g: {approval: 5}}}, {name: "Build a library, but charge a membership fee.", treasury: -3000, agencies: {s: 5, t: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Looters steal prized items from government facilities."}}}, {name: "Build a library free for all citizens.", treasury: -5000, agencies: {s: 15, t: 15}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Council librarian discover arcane law: the oldest citizen (currently, an elf) is technically monarch."}, "0.5-1": {type: "small", name: "Enact: government audits project accurate agency changes."}}}]},
										{name: "Naked woman in a pond distributes swords.", type: "small", options: [{name: "It's a strange business model, but if it works...", agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}}}, {name: "Impose restrictions on the distribution of arms.", treasury: -2000, agencies: {r: 10, m: -10}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 15}, g: {approval: -5}, l: {approval: -5}}}, {name: "Contract her to upgrade the military's weaponry.", treasury: -5000, agencies: {m: 15}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -15}, g: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "New process discovered for stronger steel."}}}]},
										{name: "Healing tea has become popular amongst the people.", type: "small", options: [{name: "Drink some healing tea, very publicly.", funds: 1000, constituents: {e: {approval: 5}, f: {approval: 5}, l: {approval: 5}}}, {name: "Create a new tea tax.", treasury: 5000, agencies: {r: 5}, constituents: {e: {approval: -5}, f: {approval: -10}, l: {approval: -5}}}, {name: "Nationalize the magic beverage industry.", treasury: 10000, agencies: {s: 10, r: 5, t: 5}, constituents: {d: {approval: -5}, e: {approval: -10}, f: {approval: -10}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}}}]},
										{name: "Old man cites unspecific danger, gifts sword to leader.", type: "small", options: [{name: "Thank him for the gift.", treasury: 1000, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Night watch strike for better pay and healthcare benefits."}}}, {name: "Use a mindreader to learn more about these dangers.", treasury: -2000, agencies: {t: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Increase in unregulated telepathy leads to cross-communication."}}}, {name: "Put the sword in a for-profit museum.", treasury: 4000, agencies: {s: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Looters steal prized items from government facilities."}}}]},
										{name: "Pig monster captured by band of adventurers.", type: "small", options: [{name: "Reward their bravery.", treasury: -1000, constituents: {d: {approval: 5}, f: {approval: 5}, g: {approval: -10}}}, {name: "Release the pig monster and send scouts to learn more about its kin.", treasury: -3000, agencies: {r: 5, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Pig monster eats children."}}}, {name: "Establish a national zoo.", treasury: 5000, agencies: {s: 10, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}]},
										{name: "Blood moon rises once again.", type: "small", options: [{name: "Remind citizens to be careful.", constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}, "0.5-1": {type: "large", name: "Death cult raises ancient warrior chieftess to rule the realm."}}}, {name: "Make Lunarism the national religion.", funds: 1000, treasury: -1000, agencies: {s: 5, r: 5}, constituents: {d: {approval: -10}, e: {approval: 10}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}}, {name: "Declare a curfew.", agencies: {r: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -10}, g: {approval: -10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of goblins marches on the capitol."}}}]},
										{name: "Wolfman brings a pack of wolves to the palace.", type: "small", options: [{name: "Ignore them and hope they don't eat any fairies.", constituents: {e: {approval: -5}, f: {approval: -5, population: -1000}, g: {approval: 5}}}, {name: "Fight them back with silver swords.", treasury: -5000, agencies: {m: 10}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}, {name: "Establish a Bureau of Beasts, headed by the wolfman.", treasury: -2000, agencies: {s: 5, m: -5}, constituents: {f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}]},
										{name: "Portal discovered between wardrobe and pine forest.", type: "small", options: [{name: "Allow people to traverse freely.", agencies: {r: -5}, constituents: {e: {approval: 5}, l: {approval: 5}}}, {name: "Build toll booths on either side.", treasury: 3000, agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}}}, {name: "Invest in the Academy of Natural Philosophies to study these portals.", treasury: -3000, agencies: {s: 5, t: 5}, constituents: {e: {approval: 5}, g: {approval: -5}}}]},
										{name: "Precious gems discovered in dangerous caverns.", type: "small", options: [{name: "Declare the mines open to all.", funds: 1000, agencies: {r: -5}, constituents: {d: {approval: 15}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "High inflation means peasants struggle to afford necessities."}}}, {name: "Nationalize the mine.", treasury: 12000, agencies: {r: 5}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: -5}, g: {approval: -10}, l: {approval: -5}}}, {name: "Ban mining at Gemstone National Park.", treasury: 2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: -15}, e: {approval: 5}, f: {approval: 10}, g: {approval: -5}}}]},
										{name: "Octocat rises from the sea, devours fisherman.", type: "small", options: [{name: "Let the hunt begin.", agencies: {r: -5}, constituents: {f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}}, {name: "Equip the navy with dwarf-crafted harpoons.", treasury: -3000, agencies: {t: 5, m: 5}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}}, {name: "Cede the coastline to the octocat.", agencies: {s: -5, r: 5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}}]},
										{name: "Magic mirror selected to judge beauty pageant.", type: "small", options: [{name: "Attend the event.", constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Beautiful sorceress-queen infiltrates the government."}}}, {name: "Increase taxes on mirrors and beauty potions.", treasury: 5000, agencies: {r: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}, {name: "Repurpose the mirror to detect medical anomolies.", agencies: {s: 5, t: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, l: {approval: 5}}}]},
										{name: "Neighboring kingdom launches a hot air balloon beyond the sky.", type: "small", options: [{name: "Acknowledge their achievement.", constituents: {d: {approval: -5}, e: {approval: -5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Neighboring kingdom lands a hot air balloon on the moon."}}}, {name: "Establish a Navy of Air-Sailing Alchemy to compete.", treasury: -10000, agencies: {s: 5, t: 15}, constituents: {d: {approval: 10}, e: {approval: 10}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Government-funded ballooning reaches the moon."}}}, {name: "Send spies to kidnap their sky wizards.", treasury: 2000, agencies: {t: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "In a shocking raid, neighboring kingdom's zeppelins air-bomb a city."}}}]},
										{name: "Nearby city-states form a League of Sporting Competition.", type: "small", options: [{name: "Do not participate.", constituents: {e: {approval: -5}, g: {approval: -5}}}, {name: "Send a delegation of the nation's greatest athletes.", treasury: -3000, agencies: {s: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "This realm selected to host next International Sporting Competition."}}}, {name: "Leverage this to form a deeper alliance.", agencies: {r: 10, m: 5}, constituents: {e: {approval: 10}, f: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Neighboring kingdom threatens war over trade disputes."}, "0.5-1": {type: "medium", name: "New alliance with other city-states deters neighboring kingdom's aggression."}}}]},
										{name: "Elf defeats fire turtle in effort to find princess.", type: "small", options: [{name: "Stay out of this affair.", constituents: {e: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "The princess was in another castle. The pillaging continues."}}}, {name: "Capture the fire turtle's castle - and treasure.", treasury: 10000, funds: 1000, agencies: {r: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}, {name: "Condemn this murder and hold a trial.", agencies: {r: 5}, constituents: {d: {approval: -5}, e: {approval: -10}, f: {approval: 5}, l: {approval: 10}}}]},
										{name: "Sentient vines in the city sewers determined to heal headaches.", type: "small", options: [{name: "Let people harvest their own medicine.", funds: 1000, agencies: {r: -5, t: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}}, {name: "Protect the vines and grant them sanctuary.", agencies: {r: 5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 10}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Giant plant monster consumes citizens."}}}, {name: "Convert lizardfolk swampland into vine farms.", treasury: 8000, agencies: {s: 5, t: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -10, population: -1000}}, issues: {"0-0.5": {type: "effect", name: "A mob of lizardfolk marches on the capitol."}}}]},
										{name: "Dwarf child trades family fortune for magic beans.", type: "small", options: [{name: "Kids these days.", constituents: {d: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Giant plant monster consumes citizens."}, "0.5-1": {type: "medium", name: "Magic beanstalk leads to a castle in the sky."}}}, {name: "Impose licensing restrictions on traveling traders.", treasury: 3000, agencies: {r: 5}, constituents: {e: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Buy the magic beans - and plant them.", treasury: -3000, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Giant plant monster consumes citizens."}, "0.5-1": {type: "medium", name: "Magic beanstalk leads to a castle in the sky."}}}]},
										{name: "Lizardfolk sailors determine the world is not flat.", type: "small", options: [{name: "Designate the explorers national heroes.", agencies: {t: 5}, constituents: {e: {approval: 5}, g: {approval: -5}, l: {approval: 5}}}, {name: "This conflicts with fairy/goblin religion - heresy!", funds: 1000, agencies: {t: -5}, constituents: {e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}}, {name: "Convert the Sea Goddess Temple into an Academy of Geography.", treasury: -5000, agencies: {s: 5, t: 10}, constituents: {e: {approval: 10}, f: {approval: -10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of fairies marches on the capitol."}}}]},
										{name: "Alchemists convert sky whale blubber into healing elixir.", type: "small", options: [{name: "Thus begins the sky whaling industry.", agencies: {r: -5, t: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}, "0.5-1": {type: "medium", name: "Traveling merchants sell magic flying carpets."}}}, {name: "Research and regulate the sky ship industry.", treasury: 8000, funds: 1000, agencies: {t: 10, r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Neighboring kingdom launches a hot air balloon beyond the sky."}}}, {name: "Declare these creatures the national bird-fish, and operate sky whale-watching tours.", treasury: 4000, agencies: {s: 5, r: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: -5}}}]},
										{name: "Astrologers proclaim week of the horse: Wild horse population doubles.", type: "small", options: [{name: "Great for the transportation sector! And more tax revenue!", treasury: 5000, funds: 1000, constituents: {e: {approval: 5}, g: {approval: 5}}}, {name: "Enlarge the cavalry and national communication network.", treasury: -3000, agencies: {s: 5, m: 10}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}, {name: "Drain more wetlands into pastures.", treasury: -5000, agencies: {s: 10, t: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -10}}, issues: {"0-0.5": {type: "small", name: "Equine stampede destroys trading outpost."}}}]},
										{name: "Goblin travelers discover rare mollusk shells on the beach.", type: "small", options: [{name: "That's taxable income.", treasury: 2000, agencies: {r: 5}, constituents: {e: {approval: 5}, g: {approval: -5}}}, {name: "Commission the navy to guard this endangered species.", treasury: -1000, agencies: {r: 5, m: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Purchase the shells and commission smiths to create shell armor.", treasury: -5000, agencies: {t: 5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}]},
										{name: "Eternal tree speaks for the first time in 100 years, has outdated and offensive worldview.", type: "small", options: [{name: "Defer to the ancient one.", constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, l: {approval: -5}}}, {name: "Disavow the old tree - it's a relic of the past.", constituents: {e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Giant plant monster consumes citizens."}}}, {name: "Repurpose the tree as warship frames and public housing.", treasury: 4000, agencies: {s: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: 5}, l: {approval: -5}}}]},
										{name: "Lizardfolk entrepreneur in small forest takes all the trees and puts them in a tree museum.", type: "small", options: [{name: "Collect taxes on the admission (one and a half coins).", treasury: 4000, funds: 1000, agencies: {r: -5}, constituents: {e: {approval: -5}, f: {approval: -15}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {delay:15000, type: "medium", name: "Displaced fairies begin an illegal settlement in dwarven hills."}}}, {name: "Designate new national parks and charge similar admission.", treasury: 6000, agencies: {s: 5, r: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Send troops to take back and replant the trees.", treasury: -2000, agencies: {r: 5, m: 5}, constituents: {e: {approval: 5}, f: {approval: 10}, l: {approval: -5}}}]},
										{name: "Popular love potions lead to a baby boom.", type: "small", options: [{name: "Celebrate this new industry.", funds: 1000, agencies: {r: -5}, constituents: {d: {approval: 5, population: 2000}, e: {population: 2000}, f: {approval: 10, population: 2000}, g: {approval: 5, population: 2000}, l: {approval: 5, population: 2000}}, issues: {"0-0.5": {type: "large", name: "Famine! A bad harvest cannot sustain the population."}}}, {name: "Impose stricter regulations and higher taxes on potions.", treasury: 8000, agencies: {r: 5}, constituents: {d: {population: 1000}, e: {approval: 5, population: 1000}, f: {approval: -5, population: 1000}, g: {approval: -5, population: 1000}, l: {approval: -5, population: 1000}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}}}, {name: "Outlaw and confiscate love potions to prevent overpopulation.", agencies: {r: 10, m: 5}, constituents: {d: {approval: -5, population: 1000}, e: {population: 1000}, f: {approval: -10, population: 1000}, g: {approval: -10, population: 1000}, l: {approval: -5, population: 1000}}}]},
										{name: "Elderly knight comes out of retirement to fight giants.", type: "small", options: [{name: "Those are windmills. Lock him up.", agencies: {m: 5}, constituents: {d: {approval: -5}, e: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Giants crush goblin farm towns."}}}, {name: "Appoint him to command the cavalry in the fight against giants.", treasury: -2000, agencies: {m: 5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}, {name: "Fund health and recreation services for the elderly and retired.", treasury: -7000, agencies: {s: 10, t: 5}, constituents: {d: {approval: 5}, e: {approval: 10}, f: {approval: -5}, g: {approval: -5}}}]},
										{name: "It's a generally good day in the realm.", type: "small", options: [{name: "Take credit.", constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-1": {type: "medium", name: "Enact: thorough polling presents accurate approval ratings."}, "0-0.5": {type: "small", name: "Economic opportunity leads to greater immigration."}}}, {name: "Honor the gods with a festival and stone statues.", treasury: -6000, agencies: {s: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Economic opportunity leads to greater immigration."}}}, {name: "Recognize the civil servants and military heroes who uphold the realm.", agencies: {s: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Economic opportunity leads to greater immigration."}}}]},
										{name: "Coinage counterfeiter caught.", type: "small", options: [{name: "Swift trial and public execution.", agencies: {r: 5, m: 5}, constituents: {d: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Smelt the coins and sell the metal.", treasury: 8000, constituents: {d: {approval: 10}, e: {approval: 5}, l: {approval: 5}}}, {name: "Keep quiet, seize the coins, and pass them off as real.", funds: 4000, issues: {"0-0.3": {type: "effect", name: "The people accuse the council of corruption."}, "0.3-0.6": {type: "medium", name: "High inflation means peasants struggle to afford necessities."}}}]},
										{name: "New printing press reduces time to copy manuscripts.", type: "small", options: [{name: "Reading will be good for the realm.", agencies: {t: 5}, constituents: {e: {approval: 5}, g: {approval: -5}}, issues: {"0-0.3": {type: "effect", name: "The people accuse the council of corruption."}, "0.3-0.6": {type: "large", name: "Enact: the press has limited access to government, dampening approval swings."}}}, {name: "Disseminate political literature and burn heretical propaganda.", agencies: {r: 10, t: -5, m: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of elves marches on the capitol."}}}, {name: "Collect tax on printed materials, use it to fund schools.", treasury: 5000, agencies: {s: 5, r: 5, t: 10}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Inexpensive spellbook 'Wizardry for Fools' has people casting spells in the streets."}, "0.5-1": {type: "small", name: "Enact: government audits project accurate agency changes."}}}]},
										{name: "Inexpensive spellbook 'Wizardry for Fools' has people casting spells in the streets.", type: "small", options: [{name: "Assume it will sort itself out.", agencies: {r: -5, t: 5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 10}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.3": {type: "effect", name: "Violence erupts in the markets."}, "0.3-0.6": {type: "effect", name: "Citizens who can't pay for protection have their homes wrecked."}, "0.6-0.8": {type: "large", name: "Living shadow consumes everything it touches."}}}, {name: "Ban the book and form a wizardry registry.", treasury: -2000, agencies: {r: 5, t: -5, m: 5}, constituents: {d: {approval: 5}, e: {approval: -10}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}}}, {name: "Grant absolute authority to the realm's Supreme Sorcerer.", agencies: {r: 5, m: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 10}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}]},
										{name: "Dwarves craft record-breaking brass horn.", type: "small", options: [{name: "Recognize the achievement in an official ceremony.", treasury: -1000, agencies: {t: 5}, constituents: {d: {approval: 10}, e: {approval: 5}}}, {name: "Commission more, and form a long-distance communication network.", treasury: -4000, agencies: {s: 5, t: 5}, constituents: {d: {approval: 5}, e: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Enact: thorough polling presents accurate approval ratings."}}}, {name: "Weaponize this horn to blanket the neighboring kingdom's borders with noise.", treasury: -3000, agencies: {t: 5, m: 5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Neighboring kingdom threatens war over trade disputes."}}}]},
										{name: "Theater troupe opens new show mocking the council.", type: "small", options: [{name: "Ignore it and hope it goes away.", issues: {"0-0.5": {type: "effect", name: "The people accuse the council of corruption."}, "0.5-1": {type: "medium", name: "Enact: thorough polling presents accurate approval ratings."}}}, {name: "Shut it down.", agencies: {s: -5, r: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "The people accuse the council of corruption."}, "0.5-1": {type: "small", name: "Enact: council members' votes undisclosed, so approvals reflect enacted option."}}}, {name: "Acknowledge shortcomings and pledge to consider new checks and balances.", agencies: {s: 5, r: -5}, constituents: {d: {approval: 5}, e: {approval: 10}, f: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {type: "small", name: "Enact: government audits project accurate agency changes."}, "0-2": {type: "small", name: "Enact: 5-minute term limits for council leader."}, "0-3": {type: "small", name: "Enact: council leaders cannot serve consecutive terms."}, "0-4": {type: "medium", name: "Enact: council members barred from receiving corporate kickbacks."}, "0-5": {type: "medium", name: "Enact: the treasury must stay positive."}}}]},
										{name: "Elf child controls the wind with a conductor's baton.", type: "small", options: [{name: "Allow them to profit off of this power.", agencies: {r: -5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Nationalize the child and make shipping easier for the highest bidder.", treasury: 8000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: -5}, g: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Extreme hurricanes wreak havoc on coastal fishing villages."}, "0.5-1": {type: "small", name: "New windmills proposed to automate tedious food processing."}}}, {name: "Get the naval fleet in position for an invasion of the neighboring kingdom.", agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "Neighboring kingdom towns surrender to realm's siege machines."}, "0.5-1": {type: "large", name: "Neighboring kingdom's sub-surface vessels torpedo the realm's navy."}}}]},
										{name: "There's a black market for lizardfolk scales amongst dwarven armorers.", type: "small", options: [{name: "The free market will determine the price of lizardfolk scales. Plus tax.", treasury: 5000, funds: 1000, agencies: {s: -5, r: -5, t: 5}, constituents: {d: {approval: 10}, g: {approval: 5}, l: {approval: -15, population: -1000}}}, {name: "Stop the scalemail trade.", agencies: {s: 5, r: 10, t: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 15}}}, {name: "Oversee the collection and distribution of scales from moulting.", treasury: 3000, agencies: {s: 5, r: 10, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Many lizardfolk are affected by a moulting disease."}}}]},
										{name: "A chemical spill at the dwarven factory toxifies a river.", type: "small", options: [{name: "Acknowledge the tragedy and encourage people to move.", funds: 1000, agencies: {s: -5, r: -10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, l: {approval: -10}}, issues: {"0-0.3": {type: "large", name: "Disease poisons water supply across the realm."}, "0.3-0.6": {type: "small", name: "There's a shortage of fish. People are hungry."}, "0.6-1": {type: "medium", name: "Displaced fairies begin an illegal settlement in dwarven hills."}}}, {name: "Seize the company's assets. And start a massive clean-up.", treasury: 5000, agencies: {s: 10, r: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 10}, l: {approval: 10}}, issues: {"0-0.5": {type: "large", name: "Widespread unemployment affects artisan & merchant class."}}}, {name: "Abandon the waste dump. Redirect the river upstream to form a new swamp.", treasury: -7000, funds: 1000, agencies: {s: 5, r: -5, t: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -10}, l: {approval: 5}}, issues: {"0-0.3": {type: "medium", name: "Ogre refuses passage through his swamp."}, "0.3-0.6": {type: "large", name: "Massive floods sweep through cities, destroying homes and shops."}}}]},
										{name: "The 'Accountability for Social Servants' group rallies for a tax on council members.", type: "small", options: [{name: "Ignore them.", constituents: {e: {approval: -5}}, issues: {"0-0.7": {type: "effect", name: "The people accuse the council of corruption."}}}, {name: "Send spies to dig up dirt on their leaders and expose them.", treasury: -1000, agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.7": {type: "effect", name: "The people accuse the council of corruption."}}}, {name: "Pass the stupid tax on council members.", treasury: 10000, funds: -2000, agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}]},
										{name: "Boy pulls mythical sword from stone. Expects to become king now.", type: "small", options: [{name: "Remind the public about compulsory elementary education.", agencies: {s: 5, t: 5}, constituents: {e: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Popular anti-democratic figure leads followers to the capitol."}}}, {name: "Heed the legend and give him a crown.", treasury: -1000, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}], issues: {"0-0.5": {type: "small", name: "Naked woman in a pond distributes swords."}}}, {name: "Pay off some goblins to... solve the problem.", treasury: -3000, agencies: {m: 5}, constituents: {e: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}]},
										{name: "Fairy curses dwarf: anything he touches turns to gold.", type: "small", options: [{name: "Not really seeing the problem... Take some gold 'off his hands'.", treasury: 5000, agencies: {r: -5}, constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Dwarf billionaire declares himself above the law, wants to be called His Majesty."}, "0.5-1": {type: "effect", name: "Violence erupts in the markets."}}}, {name: "Send out the cavalry to capture that fairy.", treasury: -2000, agencies: {r: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -10}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Gold!"}}}, {name: "Quarantine the dwarf and say he succumbed to the fairy's curse.", funds: 5000, agencies: {s: 5, r: -10}, constituents: {d: {approval: -15}, f: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "A mob of dwarves marches on the capitol."}}}]},
										{name: "Psychic dwarf robs bank, evades guards. Headline reads: Small Medium at Large.", type: "small", options: [{name: "Voice support for the regional authorities.", agencies: {s: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Looters steal prized items from government facilities."}}}, {name: "Deploy new anti-magic defenses in the area to disable the clairvoyance.", treasury: -3000, agencies: {r: 5, t: 5, m: 5}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -10}, g: {approval: 5}}}, {name: "Send in the wolves to hunt down the criminal.", treasury: -1000, agencies: {m: 10}, constituents: {d: {approval: -5}, f: {approval: 10}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Wolf eats local grandmother."}, "0.5-1": {type: "small", name: "Boy cries wolf."}}}]},
										{name: "Flaming meteorite demolishes lizardfolk den; family unharmed.", type: "small", options: [{name: "Suggest they auction the meteorite to dwarven crafters to raise money for repairs.", agencies: {s: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, l: {approval: -10}}, issues: {"0-0.5": {type: "large", name: "Meteor storm pummels the plains."}}}, {name: "Put the meteorite in a museum, and require all citizens to have home insurance.", treasury: 3000, funds: 1000, agencies: {s: -5, r: 5, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -10}, l: {approval: -10}}, issues: {"0-0.5": {type: "large", name: "Meteor storm pummels the plains."}, "0.5-1": {type: "effect", name: "Looters steal prized items from government facilities."}}}, {name: "Send the Department of Emergency Wizardry to repair the home - and confiscate the meteorite for study.", treasury: -2000, agencies: {s: 5, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, l: {approval: 10}}, issues: {"0-0.5": {type: "large", name: "Meteor storm pummels the plains."}}}]},
										{name: "New windmills proposed to automate tedious food processing.", type: "small", options: [{name: "Approve their construction, to reduce the cost of food.", funds: 1000, agencies: {t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -10}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Widespread unemployment affects artisan & merchant class."}, "0.5-1": {type: "small", name: "Elderly knight comes out of retirement to fight giants."}}}, {name: "Block their contruction, to preserve traditional jobs and natural vistas.", agencies: {s: 5, r: 10, t: -5}, constituents: {d: {approval: -5}, f: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "They decide to build anyway."}}}, {name: "Dam up a nearby river and switch to hydro power.", treasury: -6000, agencies: {s: 15, t: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, l: {approval: -10}}, issues: {"0-0.5": {type: "medium", name: "River dam breaks, flooding countryside."}}}]},
										{name: "Construction of new fairy-owned pegasus rental facility reveals ancient painted mural.", type: "small", options: [{name: "Don't interfere; the landowners have every right to continue construction.", funds: 1000, agencies: {r: -5, t: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Injured lizardperson sues fairy owner of self-driving trade wagon company."}}}, {name: "Excavate and move the ruins to a national museum - and charge admission.", treasury: 3000, agencies: {s: 5, t: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Fairy students create a new form of abstract art."}, "0.5-1": {type: "small", name: "Scholars propose constructing a national library."}}}, {name: "Seize the area and declare it a national historical site, patrolled 24/7.", treasury: -3000, agencies: {s: 5, r: 10, t: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -10}, g: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Thousand-year-old treasure chest uncovered in ancient temple."}, "0.5-1": {type: "small", name: "Archaelogists excavate the tomb of an ancient warrior chieftess."}}}]},
										{name: "Increase in unregulated telepathy leads to cross-communication.", type: "small", options: [{name: "Urge the mind-reading community to self-regulate.", agencies: {r: -5}, constituents: {e: {approval: -5}, f: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Psychic dwarf robs bank, evades guards. Headline reads: Small Medium at Large."}}}, {name: "Nationalize the telepathy spectrum and auction off frequency bands.", treasury: 8000, agencies: {s: 5, r: 10, t: 5}, constituents: {e: {approval: 10}, f: {approval: -5}, g: {approval: -10}, l: {approval: 5}}}, {name: "Create a National Second-sight Agency to intercept thoughts.", treasury: -8000, agencies: {r: 15, t: 5, m: 10}, constituents: {d: {approval: -10}, e: {approval: -10}, f: {approval: -15}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "The people accuse the council of corruption."}, "0.5-1": {type: "effect", name: "Magic-users go on strike, crippling the economy."}}}]},
										{name: "Night watch strike for better pay and healthcare benefits.", type: "small", options: [{name: "Disband the night watch in favor of volunteer vigilantes.", agencies: {s: -10, r: -10, m: -10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 10}, g: {approval: 5}}, issues: {"0-0.3": {type: "effect", name: "Looters steal prized items from government facilities."}, "0.3-0.6": {type: "small", name: "Elderly knight comes out of retirement to fight giants."}}}, {name: "Increase their salary and provide access to healing clerics.", treasury: -6000, agencies: {s: 10, m: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.3": {type: "large", name: "Lizardfolk healer offers to cure the sick, in exchange for worship as divine leader."}, "0.3-0.6": {type: "small", name: "Healing tea has become popular amongst the people."}}}, {name: "Hire a necromancer to replace them with a skeletal army.", treasury: -3000, agencies: {r: -5, t: 5, m: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5, population: 2000}}, issues: {"0-0.3": {type: "large", name: "Zombies slowly amble towards major population centers."}, "0.3-0.6": {type: "large", name: "Death cult raises ancient warrior chieftess to rule the realm."}}}]},
										{name: "Ice magic innovation leads to better food preservation.", type: "small", options: [{name: "Issue a patent to the ice sorceress who invented this process.", treasury: 3000, agencies: {s: 5, r: 5, t: 5}, constituents: {d: {approval: 5}, f: {approval: 5}, g: {approval: 5}}}, {name: "Build refrigeration facilities to store food reserves and prevent starvation.", treasury: -7000, agencies: {s: 15, t: 10}, constituents: {d: {population: 1000}, e: {approval: 10}, f: {population: 1000}, g: {approval: 5, population: 1000}, l: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Water-borne disease kills dozens in lake country."}}}, {name: "Use this ice magic to disrupt the neighboring kingdom's food supplies.", treasury: -3000, agencies: {t: 5, m: 10}, constituents: {f: {approval: -5}, g: {approval: 10}, l: {approval: -10}}, issues: {"0-0.5": {type: "medium", name: "Neighboring kingdom seizes trade wagons and merchant ships."}}}]},
										{name: "Talking bear!", type: "small", options: [{name: "Send it to the circus!", agencies: {s: 5, r: -5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Traveling performers arrive in the realm."}}}, {name: "Move the bear to a secure location for study.", treasury: -3000, agencies: {s: 5, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "National zoo attracts world travelers, rakes in gold."}}}, {name: "Appoint the bear to lead the Beast Cavalry.", treasury: -4000, agencies: {t: 5, m: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 10}}, issues: {"0-0.5": {type: "small", name: "Wolfman brings a pack of wolves to the palace."}}}]},
										{name: "Archaelogists excavate the tomb of an ancient warrior chieftess.", type: "small", options: [{name: "Direct scholars to study the past.", treasury: -2000, agencies: {s: 5, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Death cult raises ancient warrior chieftess to rule the realm."}}}, {name: "Heed the curse; leave this place, and build a wall around it.", treasury: -4000, agencies: {r: 5, t: -5, m: 5}, constituents: {d: {approval: 5}, e: {approval: -10}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Scholars propose constructing a national library."}}}, {name: "This finding contradicts popular religious teachings... blasphemy!", agencies: {r: 5, t: -10}, constituents: {e: {approval: -5}, f: {approval: 10}, g: {approval: 10}}, issues: {"0-0.5": {type: "medium", name: "Cult of the moon god grows amongst fairies, elves, and goblins."}}}]},
										{name: "Lizardfolk develop new dyes from carnivorous flower.", type: "small", options: [{name: "Celebrate their ingenuity and declare these colors the new fashion.", funds: 1000, agencies: {r: -5, t: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Enact: commission and display a new national flag."}, "0.5-1": {type: "effect", name: "Giant plant monster consumes citizens."}}}, {name: "Enforce a uniform dress code for peasants and supply this clothing.", treasury: -5000, agencies: {r: 15, t: 5, m: 5}, constituents: {d: {approval: -10}, e: {approval: -10}, f: {approval: -10}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Wool shortage leads to collapse of textile market."}}}, {name: "To protect the species, designate wildflower preserves in the jungle.", treasury: -2000, agencies: {s: 5, r: 10, t: -5}, constituents: {f: {approval: 10}, g: {approval: -5}, l: {approval: -10}}, issues: {"0-0.5": {type: "small", name: "Lizardfolk entrepreneur in small forest takes all the trees and puts them in a tree museum."}}}]},
										{name: "There's a shortage of fish. People are hungry.", type: "small", options: [{name: "Direct people to alternatives like lamb and beef.", agencies: {s: -5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.3": {type: "medium", name: "Wool shortage leads to collapse of textile market."}, "0.3-0.6": {type: "small", name: "Hunters decimate rabbit population."}, "0.6-0.9": {type: "medium", name: "Goblin alchemist perfects a process for transforming stone into a nutritious liquid."}}}, {name: "Appeal to the sea goddess for help.", agencies: {s: 5, t: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 15}, l: {approval: 5}}, issues: {"0-0.3": {type: "small", name: "Octocat rises from the sea, devours fisherman."}, "0.3-0.6": {type: "large", name: "Uninhabited jungle island rises from the sea."}}}, {name: "Cordon off an area for water wizard experiments in fish creation.", treasury: -5000, agencies: {s: 10, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 10}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.3": {type: "small", name: "Mute woman emerges from the ocean."}, "0.3-0.6": {type: "large", name: "Massive floods sweep through cities, destroying homes and shops."}}}]},
										{name: "Sick citizens are expelled from the neighboring kingdom.", type: "small", options: [{name: "Close the city gates to protect the people of the realm.", agencies: {s: 5, r: 5, m: 5}, constituents: {e: {approval: -5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-0.4": {type: "large", name: "Lizardfolk healer offers to cure the sick, in exchange for worship as divine leader."}}}, {name: "Welcome the refugees, and assign healing clerics to cure them.", treasury: -10000, agencies: {s: 15, t: 5}, constituents: {d: {approval: -5, population: 2000}, e: {approval: 5, population: 2000}, f: {approval: 5, population: 2000}, g: {population: 2000}, l: {approval: 5, population: 2000}}, issues: {"0-0.2": {type: "large", name: "Plague spreads to cities, kills thousands."}}}, {name: "Detain the refugees until the plague passes, then welcome the survivors.", treasury: -5000, agencies: {s: -5, r: 5, m: 10}, constituents: {d: {approval: 5, population: 1000}, e: {population: 1000}, f: {approval: -5, population: 1000}, g: {approval: 5, population: 1000}, l: {approval: 5, population: 1000}}, issues: {"0-0.3": {type: "large", name: "Zombies slowly amble towards major population centers."}}}]},
										{name: "Economic opportunity leads to greater immigration.", type: "small", options: [{name: "Welcome the influx of new (taxable) citizens.", treasury: 10000, agencies: {s: 5, r: -5}, constituents: {d: {approval: -5, population: 2000}, e: {approval: 5, population: 2000}, f: {population: 3000}, g: {approval: -5, population: 3000}, l: {approval: 5, population: 2000}}, issues: {"0-0.2": {type: "effect", name: "Widespread unemployment affects artisan & merchant class."}, "0.2-0.4": {type: "large", name: "Famine! A bad harvest cannot sustain the population."}}}, {name: "Establish a racial quota system for limited immigration.", treasury: 5000, agencies: {s: 5, r: 15}, constituents: {d: {approval: 10, population: 1000}, e: {approval: 5, population: 1000}, f: {approval: -5, population: 1000}, g: {approval: -10, population: 1000}, l: {approval: -5, population: 1000}}, issues: {"0-0.2": {type: "effect", name: "A mob of dwarves marches on the capitol."}, "0.2-0.4": {type: "effect", name: "A mob of elves marches on the capitol."}, "0.4-0.6": {type: "effect", name: "A mob of fairies marches on the capitol."}, "0.6-0.8": {type: "effect", name: "A mob of goblins marches on the capitol."}, "0.8-1": {type: "effect", name: "A mob of lizardfolk marches on the capitol."}}}, {name: "Build a wall and increase border patrols.", treasury: -7000, funds: 1000, agencies: {s: 5, r: 10, m: 10}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}}}]},
										{name: "Elf magister publishes controversial research on cloning.", type: "small", options: [{name: "Let the scientific community attempt to replicate.", agencies: {r: -10, t: 15}, constituents: {d: {approval: -10}, e: {population: 1000}, f: {approval: 5}, g: {approval: -10}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Some goblins awake to find doppelgangers - exact copies - in their home."}, "0.5-1": {type: "medium", name: "Fairy alchemist discovers potion that shapeshifts elves into lizardfolk."}}}, {name: "Outlaw magical facsimiles.", agencies: {r: 10, t: -5}, constituents: {d: {approval: 10}, f: {approval: -5}, g: {approval: 5}}}, {name: "Time for a clone army.", treasury: -5000, agencies: {t: 15, m: 15}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 10, population: 2000}, l: {approval: 5, population: 2000}}, issues: {"0-0.5": {type: "medium", name: "Goblin warlock publishes An Illustrated Guide to Necromancy."}}}]},
										{name: "Injured lizardperson sues fairy owner of self-driving trade wagon company.", type: "small", options: [{name: "Emphasize the importance of health and travel insurance.", funds: 1000, agencies: {s: -5, r: -10, t: 5}, constituents: {d: {approval: 5}, f: {approval: 5}, l: {approval: -10}}, issues: {"0-0.5": {type: "medium", name: "Neighboring kingdom seizes trade wagons and merchant ships."}}}, {name: "Award damages to the victim, and regulate sentient wagons and mine carts.", treasury: -2000, agencies: {s: 5, r: 10, t: 5}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: -5}, l: {approval: 10}}}, {name: "Fine the manufacturer and its billionaire dwarf CEO.", treasury: 7000, agencies: {r: 10, t: -5}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Dwarf billionaire declares himself above the law, wants to be called His Majesty."}}}]},
										{name: "Equine stampede destroys trading outpost.", type: "small", options: [{name: "Let merchants build a new one.", agencies: {s: -5, r: -5}, constituents: {e: {approval: -5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Capture all wild horses and establish a national horse registry.", treasury: -5000, agencies: {s: 10, r: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -15}, g: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Injured lizardperson sues fairy owner of self-driving trade wagon company."}}}, {name: "Invest in stronger building materials research.", treasury: -3000, agencies: {r: 5, t: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}}]},
										{name: "Girl gifts baby sibling to goblin king, but then changes her mind.", type: "small", options: [{name: "Let the goblin king trap her in his maze.", funds: 1000, agencies: {r: -5}, constituents: {e: {approval: -5}, f: {approval: 5}, g: {approval: 10}}, issues: {"0-0.5": {type: "small", name: "Hungry minotaurs request more people visit the labyrinth."}}}, {name: "Officially sponsor the goblin king's orphanage.", treasury: -4000, agencies: {s: 10, t: 5}, constituents: {d: {approval: -5}, f: {approval: 10}, g: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Pig monster eats children."}}}, {name: "Our will is as strong as his, and our realm as great. He has no power over us.", treasury: -1000, agencies: {r: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -10}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Rebels led by a goblin warlord demand submission to their law."}}}]},
										{name: "Hungry minotaurs request more people visit the labyrinth.", type: "small", options: [{name: "Suggest they invest in better advertising.", agencies: {r: -5}, constituents: {e: {approval: -5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Increase police quotas, and add 'trapped in maze' to sentencing guidelines.", funds: 2000, agencies: {s: -5, r: 5, m: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Violence erupts in the markets."}}}, {name: "Deport the minotaurs, seize the maze, and transform it into a tourist attraction.", treasury: 5000, agencies: {s: 5, r: -5, t: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Scholars propose constructing a national library."}}}]},
									],	
									medium:    [
										{name: "Enact: 1-minute voting period for all issues.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {e: {approval: -5}, f: {approval: 5}, g: {approval: 5}}, rules: [{name: "quick-voting", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: 1-minute voting period for all issues."}}}]},
										{name: "Enact: council members can vote while campaigning.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", funds: 1000, rules: [{name: "absentee-voting", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council members can vote while campaigning."}, "0-0.5": {type: "effect", name: "The people accuse the council of corruption."}}}]},
										{name: "Enact: the treasury must stay positive.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}}, rules: [{name: "balanced-budget", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: the treasury must stay positive."}}}]},
										{name: "Enact: all present members must vote - no abstentions.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "no-abstentions", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: all present members must vote - no abstentions."}}}]},
										{name: "Enact: council leader wields tiebreaking vote.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: 5}, e: {approval: -5}}, rules: [{name: "tiebreaker-leader", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council leader wields tiebreaking vote."}}}]},
										{name: "Enact: council members barred from receiving corporate kickbacks.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", agencies: {r: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}}, rules: [{name: "kickback-ban", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council members barred from receiving corporate kickbacks."}}}]},
										{name: "Enact: council members barred from taking constituent donations.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", agencies: {r: 5}, constituents: {e: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "donation-ban", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council members barred from taking constituent donations."}}}]},
										{name: "Enact: voting age requirements are lowered.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: 5, population: 1000}, e: {approval: -10}, f: {approval: 10, population: 2000}, g: {approval: 5, population: 2000}, l: {approval: 5, population: 1000}}, rules: [{name: "lower-age", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: voting age requirements are lowered."}}}]},
										{name: "Enact: there is a maximum voting age.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: -5, population: -1000}, e: {approval: -15, population: -2000}, g: {approval: 5}}, rules: [{name: "maximum-age", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: there is a maximum voting age."}}}]},
										{name: "Enact: convicted criminals barred from voting.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", agencies: {s: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: -10, population: -2000}, l: {approval: -5, population: -1000}}, rules: [{name: "felon-disenfranchisement", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: convicted criminals barred from voting."}}}]},
										{name: "Enact: height restrictions for national elections.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: -15, population: -2000}, e: {approval: 5}, f: {approval: -15, population: -2000}, g: {approval: -15, population: -2000}, l: {approval: -5}}, rules: [{name: "height-restrictions", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: height restrictions for national elections."}}}]},
										{name: "Enact: elections have been delayed.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", funds: 2000, rules: [{name: "delayed-elections", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: elections have been delayed."}, "0-0.5": {type: "effect", name: "The people accuse the council of corruption."}}}]},
										{name: "Enact: elections have been moved sooner.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", rules: [{name: "snap-elections", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: elections have been moved sooner."}}}]},
										{name: "Enact: campaigning is only allowed 5 minutes before the election.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "short-season", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: campaigning is only allowed 5 minutes before the election."}}}]},
										{name: "Enact: thorough polling presents accurate approval ratings.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", treasury: -5000, agencies: {t: 5}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: -5}, g: {approval: -10}, l: {approval: -10}}, rules: [{name: "accurate-polling", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: thorough polling presents accurate approval ratings."}}}]},
										{name: "Enact: commission and display a new national flag.", type: "enact", options: [{name: "Don't change the flag."}, {name: "Change the flag.", treasury: -4000, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}, rules: [{name: "alternate-flag", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: commission and display a new national flag."}}}]},
										{name: "Dragons spotted in the mountains by dwarf travelers.", type: "medium", options: [{name: "Ignore the dwarves.", constituents: {d: {approval: -10}, l: {approval: 10}}, issues: {"0-0.3": {type: "effect", name: "Wild beasts wreak havoc."}, "0.3-0.6": {type: "large", name: "Dragon Lord demands power over the realm, or else will eat everyone."}}}, {name: "Send out a hunting party.", treasury: 2000, agencies: {m: 5}, constituents: {d: {approval: 10}, g: {approval: 5}, l: {approval: -10}}, issues: {"0-0.5": {type: "effect", name: "Gold!"}}}, {name: "Establish a network of watchtowers.", treasury: 3000, agencies: {s: 5, t: 10}, constituents: {d: {approval: 5}, e: {approval: 10}, l: {approval: -5}}}]},
										{name: "Tunnel collapse traps dwarves in a gold mine.", type: "medium", options: [{name: "Leave it to community members to dig them out.", agencies: {s: -10}, constituents: {d: {approval: -15}, g: {approval: -5}}}, {name: "Construct tunnel-boring machines to save them.", treasury: -2000, agencies: {s: 5, t: 10}, constituents: {d: {approval: 10}, e: {approval: 5}, g: {approval: 5}}}, {name: "Nationalize all mining operations in the name of public safety.", treasury: 10000, agencies: {s: 15, r: 15, t: 5}, constituents: {d: {approval: -10}, e: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "They decide to build anyway."}}}]},
										{name: "Talking frog claims to be missing prince of ancient kingdom.", type: "medium", options: [{name: "That's ridiculous.", constituents: {e: {approval: 5}, f: {approval: -5}, l: {approval: -10}}, issues: {"0-0.5": {type: "effect", name: "Popular anti-democratic figure leads followers to the capitol."}}}, {name: "Declare fried frogs' legs a national delicacy.", constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -10}}}, {name: "Hire a wizard to transform the frog-prince back and recognize his authority.", treasury: -2000, agencies: {t: 5}, constituents: {d: {approval: -5}, f: {approval: 5}, l: {approval: 15}}, rules: [{name: "monarchy-instated", enact: true}]}]},
										{name: "Injured unicorn bleeds into stream, local fisherman becomes immortal.", type: "medium", options: [{name: "Denounce it as a hoax.", constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -5}}}, {name: "Quarantine the area, sell the liquid as a healing potion.", treasury: 3000, agencies: {s: 5, t: 10}, constituents: {d: {approval: 5, population: 1000}, e: {approval: -5}, f: {approval: 5, population: 1000}, g: {approval: -5}, l: {approval: 5, population: 1000}}}, {name: "Hunt unicorns to use their blood for military experiments.", treasury: -3000, agencies: {t: 10, m: 10}, constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: -5}, g: {approval: 5}}}]},
										{name: "Traveling merchants sell magic flying carpets.", type: "medium", options: [{name: "Don't regulate the transportation industry.", funds: 1000, agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -10}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Some travelers are discovered to be foreign spies."}}}, {name: "Burn all such carpets as heretical witchcraft.", treasury: -1000, agencies: {r: 10, m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 10}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}}}, {name: "Create a new flying fighting force.", treasury: -5000, agencies: {t: 10, m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}]},
										{name: "Thousand-year-old treasure chest uncovered in ancient temple.", type: "medium", options: [{name: "Don't open the box. It belongs in a museum.", treasury: 3000, agencies: {s: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Looters steal prized items from government facilities."}}}, {name: "Destroy the box and seal off the temple.", treasury: -2000, agencies: {r: 5}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: -5}}}, {name: "Open the box.", agencies: {t: 5}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: 10}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.2": {type: "effect", name: "Wild beasts wreak havoc."}, "0.2-0.4": {type: "effect", name: "Sick citizens are dying."}, "0.4-0.5": {type: "effect", name: "Living shadow consumes everything it touches."}, "0.5-0.6": {type: "effect", name: "Volcano erupts, destroying island paradise."}, "0.6-1": {type: "effect", name: "Gold!"}}}]},
										{name: "Landslides in the enchanted forest kill dozens.", type: "disaster", options: [{name: "Warn citizens to steer clear.", agencies: {s: -5}, constituents: {d: {approval: 5}, e: {approval: -10, population: -1000}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5, population: -1000}}}, {name: "Send in an eagle-riding rescue team.", treasury: -3000, agencies: {s: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, l: {approval: 5}}}, {name: "Torch the forest and declare it forbidden.", treasury: -1000, agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: -15, population: -2000}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5, population: -2000}}}]},
										{name: "Water-borne disease kills dozens in lake country.", type: "disaster", options: [{name: "Discourage travel to the lake country.", agencies: {r: -10, t: -5}, constituents: {d: {approval: -10, population: -1000}, e: {approval: -10, population: -1000}, f: {approval: -10, population: -1000}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "There's a shortage of fish. People are hungry."}}}, {name: "Create a healthcare agency of water wizards.", treasury: -3000, agencies: {s: 10, r: 5, t: 10}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 5}}}, {name: "Restrict travel between regions of the realm.", treasury: -2000, agencies: {r: 10, m: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}}]},
										{name: "River dam breaks, flooding countryside.", type: "disaster", options: [{name: "Order people to move.", agencies: {s: -5}, constituents: {e: {approval: -5, population: -1000}, f: {approval: -5}, g: {approval: -5, population: -1000}}, issues: {"0-0.5": {type: "large", name: "Massive floods sweep through cities, destroying homes and shops."}}}, {name: "Create a public agency to oversee dam re-construction.", treasury: -5000, agencies: {s: 15, t: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, l: {approval: 5}}}, {name: "Pay a private construction company to build a new dam.", treasury: -8000, funds: 1000, agencies: {s: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}}]},
										{name: "Dragon eats three dozen sheep from goblin farms.", type: "medium", options: [{name: "Condemn the dragon's actions but make no attempt to fight it.", agencies: {s: -5}, constituents: {d: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}, {name: "Send out a band of dragon-slayers.", treasury: -2000, agencies: {m: 15}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: 5}, g: {approval: 15}, l: {approval: -15}}, issues: {"0-0.3": {type: "effect", name: "Gold!"}, "0.3-0.6": {type: "large", name: "Dragon Lord demands power over the realm, or else will eat everyone."}}}, {name: "Negotiate with the dragon to compensate the goblins.", treasury: -2000, agencies: {s: 5, m: -5}, constituents: {d: {approval: -10}, e: {approval: 5}, g: {approval: 5}, l: {approval: 10}}, issues: {"0.5-1": {type: "medium", name: "Goblin alchemist perfects a process for transforming stone into a nutritious liquid."}}}]},
										{name: "Wool shortage leads to collapse of textile market.", type: "medium", options: [{name: "Recommend furs as an alternative.", funds: 1000, agencies: {s: -5, r: -10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}}, {name: "Conquer the pasture lands to the north.", treasury: 5000, agencies: {s: 5, m: 15}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10}, l: {approval: -5}}}, {name: "Set prices on all fabrics and fibers to stabilize the market.", agencies: {r: 15}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}]},
										{name: "New process discovered for stronger steel.", type: "medium", options: [{name: "Grant a patent to the inventor.", treasury: 3000, agencies: {r: 5, t: 5}, constituents: {d: {approval: 5}, g: {approval: -5}}}, {name: "Sell this knowledge to craftsmen across the realm.", treasury: 5000, agencies: {t: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Boom in sword production at national foundries."}}}, {name: "Keep this classified, and bolster the army's equipment.", treasury: -5000, agencies: {t: 10, m: 15}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -10}, g: {approval: -5}, l: {approval: 5}}}]},
										{name: "New siege weapon invented: the trebuchet.", type: "medium", options: [{name: "Don't regulate the arms market.", funds: 1000, agencies: {r: -10}, constituents: {d: {approval: 5}, f: {approval: -10}}, issues: {"0-0.4": {type: "large", name: "Dwarf scientist-engineer builds a Doomsday Device - demands gold."}, "0.4-0.7": {type: "effect", name: "Crossbow-wielding berserker caught by palace guard."}}}, {name: "Construct a siege force to protect the capitol.", treasury: -5000, agencies: {t: 5, m: 15}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Neighboring kingdom towns surrender to realm's siege machines."}}}, {name: "Ban this technology.", agencies: {r: 5, t: -10, m: -5}, constituents: {d: {approval: -5}, f: {approval: 15}}, issues: {"0-0.5": {type: "effect", name: "They decide to build anyway."}}}]},
										{name: "Ogre refuses passage through his swamp.", type: "medium", options: [{name: "It's his swamp.", agencies: {s: -5, r: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Burn down the swamp.", treasury: -2000, agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: 10}, f: {approval: 5}, g: {approval: -5}, l: {approval: -15}}, issues: {"0-0.5": {type: "large", name: "Wildfires in the enchanted forest kill thousands."}}}, {name: "Negotiate with the ogre to allow travelers safe passage.", treasury: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 10}}}]},
										{name: "Wolf eats local grandmother.", type: "medium", options: [{name: "Tell people to invest in home security.", funds: 1000, agencies: {t: 5, m: -5}, constituents: {d: {approval: 5}, f: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Citizens who can't pay for protection have their homes wrecked."}}}, {name: "Establish a wolf pelt industry.", treasury: 2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}}, {name: "Create public geriatric care facilities.", treasury: -5000, agencies: {s: 10, t: 5}, constituents: {d: {approval: -5}, e: {approval: 15}, f: {approval: -5}, l: {approval: 5}}}]},
										{name: "Gold discovered in hills surrounding the capitol.", type: "medium", options: [{name: "Declare open-season on gold-mining.", treasury: 3000, agencies: {r: -10}, constituents: {d: {approval: 15}, e: {approval: 5}, f: {approval: 5}, g: {approval: 10}}, issues: {"0-0.5": {type: "medium", name: "High inflation means peasants struggle to afford necessities."}}}, {name: "Seize the hills and oversee gold mining operations.", treasury: 10000, agencies: {r: 10, m: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "The people accuse the council of corruption."}, "0.5-1": {type: "effect", name: "Gold!"}}}, {name: "Raise income taxes for all miners.", treasury: 8000, agencies: {r: 15}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}}]},
										{name: "Pirates sink merchant ships, steal gold.", type: "medium", options: [{name: "Condemn the pirates, but do nothing.", funds: 1000, agencies: {s: -5, r: -5, m: -15}, constituents: {d: {approval: -5}, e: {approval: -10}, f: {approval: -10}, g: {approval: -5}, l: {approval: -5}}}, {name: "Double the size of the navy and pursue them.", treasury: -10000, agencies: {t: 10, m: 15}, constituents: {d: {approval: 5}, e: {approval: 10}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Gold!"}}}, {name: "Compensate the merchants from the treasury.", treasury: -8000, agencies: {s: 15}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 10}, l: {approval: 5}}}]},
										{name: "Pirates sink government vessels, steal gold.", type: "medium", options: [{name: "Condemn the pirates, but do nothing.", funds: 1000, treasury: -10000, agencies: {r: -5, m: -15}, constituents: {d: {approval: -5}, e: {approval: -10}, f: {approval: -10}, g: {approval: -5}, l: {approval: -5}}}, {name: "Double the size of the navy and destroy them.", treasury: -10000, agencies: {t: 10, m: 15}, constituents: {d: {approval: 5}, e: {approval: 10}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Gold!"}}}, {name: "Limit the use of government trade by sea.", agencies: {t: -10, m: -10}, constituents: {d: {approval: -5}, e: {approval: -5}, g: {approval: 5}, l: {approval: 5}}}]},
										{name: "Cult of the moon god grows amongst fairies, elves, and goblins.", type: "medium", options: [{name: "Celebrate freedom of religion.", agencies: {r: -5}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Moon god cultists bring about days of darkness."}}}, {name: "Impose a tax on cult-related activities.", treasury: 5000, agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: -10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Cult leader commands the faithful to the capitol steps."}}}, {name: "Begin construction of a flying machine capable of reaching the moon.", treasury: -20000, agencies: {s: 10, r: 5, t: 15}, constituents: {d: {approval: 10}, e: {approval: 10}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Government-funded ballooning reaches the moon."}, "0.5-1": {type: "large", name: "Demigoddess brings thunderstorms wherever she goes."}}}]},
										{name: "Rabbit overpopulation threatens harvest.", type: "medium", options: [{name: "Let people hunt their own rabbits.", agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10}, l: {approval: 5}}}, {name: "Establish taxes on both produce and rabbit products.", treasury: 8000, agencies: {r: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}}, {name: "Make rabbits a protected species.", treasury: -1000, agencies: {r: 15}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 10}, g: {approval: -10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}]},
										{name: "Where did all the birds go?", type: "medium", options: [{name: "Assume they'll come back when they're ready.", agencies: {t: -5}, constituents: {e: {approval: -5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Ethereal being from another plane appears, calls all nations to lay down arms. People panic."}}}, {name: "Establish a school of ornithology.", treasury: -3000, agencies: {s: 5, t: 15}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Create a national bird-farming program.", treasury: -5000, agencies: {s: 10, t: 10}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 10}}}]},
										{name: "Shooting star lands within the realm, is a magical woman.", type: "medium", options: [{name: "Welcome her to the realm.", agencies: {r: -5}, constituents: {e: {approval: 5}, f: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Beautiful sorceress-queen infiltrates the government."}}}, {name: "Cut out her heart and create immortality potions.", treasury: 10000, funds: 1000, agencies: {s: 5, t: 10}, constituents: {d: {approval: 5, population: 1000}, e: {approval: -5, population: 1000}, f: {approval: -5, population: 1000}, g: {approval: 10, population: 1000}, l: {approval: 10, population: 1000}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}, {name: "Restrict immigration of celestial beings.", agencies: {r: 5, m: 10}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Meteor storm pummels the plains."}}}]},
										{name: "Rats overrun the city streets.", type: "medium", options: [{name: "The cats will get them.", agencies: {s: -10, r: -10}, constituents: {e: {approval: -5}, f: {approval: -5, population: -1000}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}, "0.5-1": {type: "small", name: "Stray cat population explodes."}}}, {name: "Place a bounty on all rats' heads.", treasury: -3000, agencies: {r: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10}, l: {approval: 5}}}, {name: "Invest in sanitation spells and rat poison potions.", treasury: -5000, agencies: {r: 5, t: 10}, constituents: {e: {approval: 10}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Improved urban sanitation leads to increased life expectancy for dwarves and elves."}}}]},
										{name: "Rabid dogs bite travelers in the capitol.", type: "medium", options: [{name: "Issue a travel advisory for the city.", agencies: {r: 5}, constituents: {e: {approval: -5}, f: {approval: -10}, g: {approval: -10, population: -1000}, l: {approval: -5}}}, {name: "Deploy the army to hunt down the dogs.", treasury: -3000, agencies: {m: 10}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}, {name: "Commission druids to heal the dogs, then sell them to citizens.", treasury: 2000, agencies: {s: 10, t: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}]},
										{name: "Sword & shield manufacturer files for bankruptcy due to low sales.", type: "medium", options: [{name: "The free market has spoken.", agencies: {s: -5, m: -5}, constituents: {d: {approval: -5}, g: {approval: -5}}}, {name: "Bail out the arms business.", treasury: -5000, agencies: {s: 10, m: 10}, constituents: {f: {approval: -10}}}, {name: "Incite fears of barbarian invaders to stimulate sales.", funds: 1000, agencies: {t: -5, m: 15}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 15}, l: {approval: 10}}}]},
										{name: "Boom in sword production at national foundries.", type: "medium", options: [{name: "Supply outpaces demand - let prices fall.", agencies: {r: -5}, constituents: {d: {approval: -5}, f: {approval: -10}, g: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "Crossbow-wielding berserker caught by palace guard."}}}, {name: "Fix weapons prices to historical norms to ensure tax revenue.", treasury: 3000, agencies: {r: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -10}, l: {approval: 5}}}, {name: "Sell excess swords to neighboring realms.", treasury: 8000, agencies: {r: 5, m: -10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.3": {type: "medium", name: "New alliance with other city-states deters neighboring kingdom's aggression."}, "0.3-0.6": {type: "medium", name: "Refugees flock to the realm from faraway lands ravaged by war."}}}]},
										{name: "Pig monster eats children.", type: "medium", options: [{name: "Tell citizens to purchase stronger door locks.", funds: 1000, agencies: {s: -5, m: -5}, constituents: {d: {approval: -5}, e: {approval: -10}, f: {approval: -10, population: -1000}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Citizens who can't pay for protection have their homes wrecked."}}}, {name: "Roast the pig monster at a public feast.", treasury: -1000, agencies: {s: 10, m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}}, {name: "Study the pig monster and train it to kill on command.", treasury: -2000, agencies: {t: 10, m: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: 5}, l: {approval: -5}}}]},
										{name: "National zoo attracts world travelers, rakes in gold.", type: "medium", options: [{name: "Tout new attractions.", treasury: 5000, agencies: {s: 5, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Looters steal prized items from government facilities."}}}, {name: "Raise admissions fees.", treasury: 10000, agencies: {t: 5}, constituents: {g: {approval: -5}, l: {approval: -5}}}, {name: "Close the zoo and release the animals into the wild.", treasury: -5000, agencies: {s: -5, r: -5, t: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 15}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}]},
										{name: "Life expectancy rises for goblins & lizardfolk.", type: "medium", options: [{name: "Take credit.", agencies: {s: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 15, population: 2000}, l: {approval: 15, population: 2000}}}, {name: "Commission a scientific study to replicate results for all races.", treasury: -5000, agencies: {s: 10, t: 15}, constituents: {d: {approval: 5, population: 1000}, e: {approval: -5}, f: {approval: 5, population: 1000}, g: {approval: -5, population: 1000}, l: {approval: 5, population: 1000}}}, {name: "Impose new taxes on younger citizens to support older ones.", treasury: 3000, agencies: {s: 15}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -10}, g: {approval: -5, population: 2000}, l: {approval: 5, population: 2000}}}]},
										{name: "Dwarf epidemic: black lung affects many miners.", type: "disaster", options: [{name: "Let the dwarves figure it out themselves.", agencies: {s: -5, r: -5, t: -5}, constituents: {d: {approval: -15, population: -2000}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of dwarves marches on the capitol."}, "0.5-1": {type: "large", name: "Coal shortage threatens to leave many to freeze this winter."}}}, {name: "Research the disease to find and distribute cure.", treasury: -5000, agencies: {s: 15, t: 15}, constituents: {d: {approval: 15}, e: {approval: -5}}}, {name: "Quarantine the sick dwarves.", treasury: -2000, agencies: {t: 5, m: 10}, constituents: {d: {approval: -5, population: -1000}, e: {approval: 10}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}}}]},
										{name: "Chronic illness affects elderly elves.", type: "disaster", options: [{name: "Let the elves figure it out themselves.", agencies: {s: -5, r: -5, t: -5}, constituents: {d: {approval: 5}, e: {approval: -15, population: -2000}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of elves marches on the capitol."}}}, {name: "Research the disease to find and distribute cure.", treasury: -5000, agencies: {s: 15, t: 15}, constituents: {d: {approval: -5}, e: {approval: 15}}, issues: {"0-0.5": {type: "small", name: "Elf magister publishes controversial research on cloning."}}}, {name: "Quarantine the sick elves.",   treasury: -2000, agencies: {t: 5, m: 10}, constituents: {d: {approval: 10}, e: {approval: -5, population: -1000}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}}}]},
										{name: "Fairy disease discovered that stunts wing growth.", type: "disaster", options: [{name: "Let the fairies figure it out themselves.", agencies: {s: -5, r: -5, t: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -15, population: -2000}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of fairies marches on the capitol."}}}, {name: "Research the disease to find and distribute cure.", treasury: -5000, agencies: {s: 15, t: 15}, constituents: {f: {approval: 15}, g: {approval: -5}}}, {name: "Quarantine the sick fairies.", treasury: -2000, agencies: {t: 5, m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5, population: -1000}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}}}]},
										{name: "Poor health amongst goblins leads to pestilence.", type: "disaster", options: [{name: "Let the goblins figure it out themselves.", agencies: {s: -5, r: -5, t: -5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -15, population: -2000}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of goblins marches on the capitol."}, "0.5-1": {type: "large", name: "Rebels led by a goblin warlord demand submission to their law."}}}, {name: "Research the disease to find and distribute cure.", treasury: -5000, agencies: {s: 15, t: 15}, constituents: {f: {approval: -5}, g: {approval: 15}}}, {name: "Quarantine the sick goblins.", treasury: -2000, agencies: {t: 5, m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 10}, g: {approval: -5, population: -1000}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}}}]},
										{name: "Many lizardfolk are affected by a moulting disease.", type: "disaster", options: [{name: "Let the lizardfolk figure it out themselves.", agencies: {s: -5, r: -5, t: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -15, population: -2000}}, issues: {"0-0.5": {type: "effect", name: "A mob of lizardfolk marches on the capitol."}}}, {name: "Research the disease to find and distribute cure.", treasury: -5000, agencies: {s: 15, t: 15}, constituents: {d: {approval: -5}, l: {approval: 15}}}, {name: "Quarantine the sick lizards.", treasury: -2000, agencies: {t: 5, m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 10}, g: {approval: 5}, l: {approval: -5, population: -1000}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}}}]},
										{name: "Ghosts reported by goblin peasants.", type: "medium", options: [{name: "Ignore the ghosts - and the peasants.", constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: -10}}, issues: {"0-0.5": {type: "effect", name: "Goblin village... vanishes completely."}}}, {name: "Increase taxes to pay for 'Ghost Hunters'.", funds: 1000, treasury: 3000, agencies: {m: 5}, constituents: {d: {approval: -10}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Ethereal being from another plane appears, calls all nations to lay down arms. People panic."}}}, {name: "Send in a psychic to negotiate.", treasury: -1000, agencies: {t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Increase in unregulated telepathy leads to cross-communication."}}}]},
										{name: "Advances in crafting lead to much faster crossbows.", type: "medium", options: [{name: "Let the crossbow market regulate itself.", funds: 1000, agencies: {r: -5, t: 5}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -10}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Crossbow-wielding berserker caught by palace guard."}}}, {name: "Equip the realm's soldiers with this new gear.", funds: 1000, treasury: -5000, agencies: {r: -5, t: 5, m: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Ban fast-fire crossbows and establish a crossbow registry.", treasury: 3000, agencies: {r: 10}, constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "They decide to build anyway."}}}]},
										{name: "Fortuneteller predicts civilization-ending floods.", type: "medium", options: [{name: "Climate change is at least a century away.", constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.3": {type: "large", name: "Massive floods sweep through cities, destroying homes and shops."}, "0.3-0.6": {type: "medium", name: "Refugees flock to the realm from faraway lands ravaged by war."}}}, {name: "Fund research into weather wizardry.", treasury: -5000, agencies: {t: 10}, constituents: {d: {approval: -10}, e: {approval: 10}, f: {approval: -5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Demigoddess brings thunderstorms wherever she goes."}}}, {name: "Denounce the fortuneteller. Climate change is a hoax!", funds: 1000, agencies: {t: -10}, constituents: {d: {approval: 5}, e: {approval: -10}, g: {approval: 5}}, issues: {"0-0.3": {type: "large", name: "Massive floods sweep through cities, destroying homes and shops."}, "0.3-0.6": {type: "effect", name: "Natural disaster destroys the capitol."}}}]},
										{name: "Fairy composer begins writing a Symphony to End Time.", type: "medium", options: [{name: "Celebrate the arts.", agencies: {s: 5}, constituents: {f: {approval: 10}, g: {approval: -5}}, issues: {"0-0.8": {type: "effect", name: "Fairy composer plans to perform her Symphony to End Time."}}}, {name: "Establish a Bureau of Censorship and impose fines.", treasury: 3000, agencies: {r: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -10}, g: {approval: 5}}}, {name: "Make her the court composer and commission a National Anthem instead.", treasury: -2000, agencies: {s: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, l: {approval: -5}}}]},
										{name: "This realm selected to host next International Sporting Competition.", type: "medium", options: [{name: "Welcome world athletes and spectators to the games.", treasury: 5000, agencies: {s: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Some travelers are discovered to be foreign spies."}, "0.5-1": {type: "medium", name: "Engineers warn of unsafe foundation on coliseum."}}}, {name: "Establish an Athletics Agency to train performers - and soldiers.", treasury: -5000, agencies: {s: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Engineers warn of unsafe foundation on coliseum."}, "0.5-1": {type: "large", name: "Celebrity swordsman / jousting champion leads a political movement to replace the council."}}}, {name: "Decline to hold the games.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}}]},
										{name: "Fairy alchemist discovers potion that shapeshifts elves into lizardfolk.", type: "medium", options: [{name: "Science marches forward.", agencies: {t: 5}, constituents: {d: {approval: 5}, e: {approval: -10, population: -1000}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5, population: 1000}}, issues: {"0-0.5": {type: "large", name: "Fairy hypnotist charms people into believing she is queen."}}}, {name: "Ban production and seize the ingredients.", treasury: 3000, agencies: {r: 5}, constituents: {e: {approval: 10}, f: {approval: -5}, g: {approval: 10}}}, {name: "Fund their research.", treasury: -5000, funds: 1000, agencies: {r: -5, t: 10}, constituents: {d: {approval: -5}, e: {approval: -15, population: -2000}, f: {approval: 15}, g: {approval: -5}, l: {approval: -10, population: 2000}}, issues: {"0-0.5": {type: "effect", name: "A mob of elves marches on the capitol."}}}]},
										{name: "Magic beanstalk leads to a castle in the sky.", type: "medium", options: [{name: "Let the people explore it.", funds: 1000, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}}, {name: "Use the castle as a base of operations for airships.", treasury: -6000, agencies: {t: 10, m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Government-funded ballooning reaches the moon."}}}, {name: "Ransack the castle.", treasury: 8000, agencies: {m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Giants crush goblin farm towns."}}}]},
										{name: "Noble elf enters dwarf home, smashes vases, takes gems.", type: "medium", options: [{name: "Mob justice will prevail.", agencies: {r: -5}, constituents: {d: {approval: -10}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "A mob of dwarves marches on the capitol."}}}, {name: "Arrest the elf noble for wanton destruction of property.", agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: -10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}, {name: "Compensate the dwarf family.", treasury: -3000, constituents: {d: {approval: 5}}}]},
										{name: "Smoke rises from volcano overlooking resort town.", type: "medium", options: [{name: "Issue a non-commital warning.", funds: 1000, constituents: {e: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Volcano erupts, destroying island paradise."}}}, {name: "Close down the town and mobilize the navy to relocate everyone.", treasury: -3000, agencies: {s: 5, r: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}}, {name: "Heed the advice of warlock advisors: sacrifice someone to the volcano gods.", agencies: {s: -5, m: 5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}]},
										{name: "Tower bridge in grave state of disrepair.", type: "medium", options: [{name: "It's been standing for 500 years, and it will stand for 500 more.", agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Famous landmark collapses to rubble."}}}, {name: "Employ artisans to repair and expand the tower.", treasury: -5000, agencies: {s: 5, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}, {name: "Demolish the tower, sell off the components, and return the site to meadowland.", treasury: 3000, agencies: {s: 5, r: 5, t: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, l: {approval: 5}}}]},
										{name: "New mechanical plow promises to revolutionize agriculture.", type: "small", options: [{name: "Increased supply will lead to lower food prices and tax revenue.", treasury: -4000, agencies: {r: -5, t: 5}, constituents: {d: {approval: 5, population: 1000}, e: {approval: 5}, g: {approval: 10, population: 1000}, l: {approval: 5, population: 1000}}, issues: {"0-0.5": {type: "medium", name: "Life expectancy rises for goblins & lizardfolk."}, "0.5-1": {type: "small", name: "Economic opportunity leads to greater immigration."}}}, {name: "Grant the inventor a patent for life, even if some people go hungry.", treasury: 3000, funds: 1000, agencies: {r: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Famine! A bad harvest cannot sustain the population."}, "0.5-1": {type: "small", name: "Ice magic innovation leads to better food preservation."}}}, {name: "Use these machines extensively, and export food surplus to neighboring kingdom.", treasury: 10000, agencies: {t: 10}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Neighboring kingdom seizes trade wagons and merchant ships."}}}]},
										{name: "Engineers warn of unsafe foundation on coliseum.", type: "medium", options: [{name: "Disregard these warnings.", agencies: {r: -5}, constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Famous landmark collapses to rubble."}}}, {name: "Close the coliseum for expensive repairs. Call it job creation.", treasury: -8000, agencies: {s: 5, r: 5, t: 5}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -5}, g: {approval: -10}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Celebrity swordsman / jousting champion leads a political movement to replace the council."}, "0.5-1": {type: "medium", name: "International Alchemy & Armor Association wants to host its annual convention in the capitol."}}}, {name: "Test new explosion potions while destroying the coliseum.", treasury: -3000, agencies: {t: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: 5}}}]},
										{name: "Astrologers spot new stars in the sky and interpret them as the end of days.", type: "medium", options: [{name: "Tell people not to panic.", constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Meteor storm pummels the plains."}}}, {name: "Create a new College of Astronomy to study the stars.", treasury: -8000, agencies: {s: 5, t: 10}, constituents: {e: {approval: 10}, f: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Government-funded ballooning reaches the moon."}}}, {name: "Declare martial law and start distributing rations.", treasury: -10000, agencies: {s: 10, m: 15}, constituents: {e: {approval: -10}, f: {approval: -10}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Widespread unemployment affects artisan & merchant class."}}}]},
										{name: "Goblin beastmasters train carrier pigeons to compete with fairy messengers.", type: "medium", options: [{name: "Maintain government contracts with fairy messengers.", treasury: -5000, constituents: {e: {approval: -5}, f: {approval: 5}, g: {approval: -5}}}, {name: "Award the parcel & postage contract to the goblin-trained pigeons.", treasury: -2000, agencies: {s: 5, t: 5}, constituents: {e: {approval: 5}, f: {approval: -10}, g: {appproval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Widespread unemployment affects artisan & merchant class."}, "0.5-1": {type: "small", name: "Construction of new fairy-owned pegasus rental facility reveals ancient painted mural."}}}, {name: "Name roast pigeon a national delicacy and de-regulate hunting.", funds: 1000, agencies: {r: -5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: -10}, l: {approval: 10}}}]},
										{name: "Goblin warlock publishes An Illustrated Guide to Necromancy.", type: "medium", options: [{name: "Allow college scholars to study the dark arts.", agencies: {r: -5, t: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5, population: 2000}}, issues: {"0-0.5": {type: "large", name: "Zombies slowly amble towards major population centers."}, "0.5-1": {type: "medium", name: "Ghosts reported by goblin peasants."}}}, {name: "Ban the book and outlaw necromancy.", agencies: {r: 10, t: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -10}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Headless horseman terrorizes goblin farmers, exposed as fairy hoax."}}}, {name: "Raise an army of skeleton warriors to replace the (expensive) traditional militia.", treasury: 8000, agencies: {r: -5, t: 5, m: 15}, constituents: {d: {approval: -5, population: 1000}, e: {approval: 5, population: 1000}, f: {approval: -5}, g: {approval: 5, population: 1000}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Death cult raises ancient warrior chieftess to rule the realm."}}}]},
										{name: "Powerful sorcerer, master of all four elements, returns to claim control.", type: "coup", options: [{name: "Submit to his authority if he maintains the council for daily governance.", constituents: {e: {approval: 5}, f: {approval: 10}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Invite him in, but then trap him in a metal oubliette.", treasury: -5000, agencies: {s: 5, t: 5}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -10}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Cult leader commands the faithful to the capitol steps."}, "0.5-1": {type: "effect", name: "Natural disaster destroys the capitol."}}}, {name: "Attempt to persuade him to use his powers to help society.", agencies: {s: 10, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 15}, g: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "It's a generally good day in the realm."}, "0.5-0.7": {type: "collapse", name: "Nearly everyone has died."}}}]},
										{name: "Fairies and goblins petition for free universal trade apprenticeships.", type: "medium", options: [{name: "Those who can afford private education deserve it.", funds: 1000, agencies: {s: -5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: -10}}}, {name: "Establish a merit-based scholarship system, funded by sales tax.", treasury: 5000, agencies: {s: 10, r: 5, t: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, l: {approval: -5}}}, {name: "Establish public trade workshops, funded by annexing island city-state.", treasury: 12000, agencies: {s: 10, t: 10, m: 15}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -10}, g: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "Volcano erupts, destroying island paradise."}}}]},
										{name: "Supreme Court's Chief Justice declares herself above the law.", type: "medium", options: [{name: "Acquiesce to the will of the court. Recognize her authority.", agencies: {s: -5, r: -5}, constituents: {e: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Publicly denounce this nonsense and send guards to collect her taxes.", treasury: 1000, agencies: {r: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, l: {approval: 5}}}, {name: "Dissolve the courts.", agencies: {s: -5, r: -10, t: -5, m: 5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "The people accuse the council of corruption."}, "0-1": {type: "medium", name: "Enact: council leader wields tiebreaking vote."}, "0-2": {type: "large", name: "Enact: council leader can make executive decisions on issues with < 2 minutes left."}}}]},
										{name: "Goblin alchemist perfects a process for transforming stone into a nutritious liquid.", type: "medium", options: [{name: "Grant a patent and invest in StoneSoup, Inc.", treasury: 3000, funds: 1000, agencies: {t: 10}, constituents: {d: {approval: 10}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Poor health amongst goblins leads to pestilence."}}}, {name: "Commission an extensive safety study and block construction of the StoneSoup factory.", treasury: -2000, agencies: {r: 10, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: -10}}, issues: {"0-0.5": {type: "effect", name: "They decide to build anyway."}}}, {name: "Appoint the goblin to lead the Department of Food and begin distributing subsidized StoneSoup to citizens.", treasury: -8000, agencies: {s: 10, t: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, g: {approval: 15, population: 1000}}}]},
										{name: "Displaced fairies begin an illegal settlement in dwarven hills.", type: "medium", options: [{name: "Trust the aggrieved parties to work it out themselves.", agencies: {s: -5, r: -10}, constituents: {d: {approval: -10}, f: {approval: -10}}, issues: {"0-0.5": {type: "small", name: "Fairy curses dwarf: anything he touches turns to gold."}, "0.5-1": {type: "medium", name: "Advances in crafting lead to much faster crossbows."}}}, {name: "Side with the dwarves: detain and deport trespassing fairies.", treasury: -3000, agencies: {s: -5, r: 5, m: 10}, constituents: {d: {approval: 15}, e: {approval: -5}, f: {approval: -15}, g: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Fairy hypnotist charms people into believing she is queen."}}}, {name: "Side with the fairies: allocate funding for housing development in the hills.", treasury: -6000, agencies: {s: 15, r: -5}, constituents: {d: {approval: -15}, e: {approval: 5}, f: {approval: 15}, l: {approval: -5}}, issues: {"0-0.3": {type: "large", name: "Dwarf scientist-engineer builds a Doomsday Device - demands gold."}, "0.3-0.6": {type: "medium", name: "Refugees flock to the realm from faraway lands ravaged by war."}}}]},
										{name: "Garbage lines the city streets.", type: "medium", options: [{name: "Tell citizens to take trash to the countryside landfill. Fine the litterers.", treasury: 5000, agencies: {s: -5, r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "Plague spreads to cities, kills thousands."}, "0.5-1": {type: "medium", name: "Rats overrun the city streets."}}}, {name: "Establish municipal garbage collection and incineration.", treasury: -4000, agencies: {s: 10, r: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Improved urban sanitation leads to increased life expectancy for dwarves and elves."}}}, {name: "Fund alchemical research into recycling waste.", treasury: -7000, agencies: {s: 10, r: 5, t: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, l: {approval: 5}}}]},
										{name: "International Alchemy & Armor Association wants to host its annual convention in the capitol.", type: "medium", options: [{name: "Ignore the request and let the neighboring kingdom host.", agencies: {s: -5, t: -10}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Sword & shield manufacturer files for bankruptcy due to low sales."}}}, {name: "Allow the local guilds to organize the event.", agencies: {r: -5, t: 10, m: 5}, constituents: {d: {approval: 10}, f: {approval: -5}, l: {approval: 5}}, issues: {"0-0.3": {type: "effect", name: "Crossbow-wielding berserker caught by palace guard."}, "0.3-0.6": {type: "medium", name: "Boom in sword production at national foundries."}, "0.6-0.9": {type: "small", name: "There's a black market for lizardfolk scales amongst dwarven armorers."}}}, {name: "Build a convention center, and scout for new government contractors.", treasury: -10000, agencies: {s: 10, r: 5, t: 15, m: 10}, constituents: {d: {approval: 5}, e: {approval: 10}, f: {approval: -5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.3": {type: "medium", name: "New process discovered for stronger steel."}, "0.3-0.6": {type: "medium", name: "New siege weapon invented: the trebuchet."}, "0.6-0.9": {type: "medium", name: "Goblin alchemist perfects a process for transforming stone into a nutritious liquid."}}}]},
										{name: "Neighboring kingdom begins naval blockade of important port.", type: "war", options: [{name: "Condemn their actions, but do not provoke war.", treasury: -5000, agencies: {s: -5, m: -5}, constituents: {e: {approval: -5}, g: {approval: -5}, l: {approval: -10}}, issues: {"0-0.3": {type: "small", name: "Butter shortage drives up the price of pastries."}, "0.3-0.6": {type: "small", name: "Wool shortage leads to collapse of textile market."}, "0.6-1": {type: "small", name: "There's a shortage of fish. People are hungry."}}}, {name: "Pay pirates to sink their ships.", treasury: -4000, agencies: {s: -10, m: 5}, constituents: {d: {approval: -5}, e: {approval: -10}, g: {approval: 5}, l: {approval: 10}}, issues: {"0-0.5": {type: "medium", name: "Pirates sink merchant ships, steal gold."}}}, {name: "Send the navy to sink their ships.", agencies: {s: 5, r: 5, m: 15}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10}, l: {approval: 10}}, issues: {"0-0.3": {type: "large", name: "Neighboring kingdom's sub-surface vessels torpedo the realm's navy."}, "0.3-0.6": {type: "effect", name: "Victory! Neighboring kingdom forces are on the retreat."}, "0.6-1": {type: "medium", name: "Neighboring kingdom seizes trade wagons and merchant ships."}}}]},
										{name: "Neighboring kingdom threatens war over trade disputes.", type: "war", options: [{name: "Station more troops at the borders.", treasury: -3000, agencies: {m: 10}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.3": {type: "medium", name: "Neighboring kingdom begins naval blockade of important port."}, "0.3-0.6": {type: "small", name: "Sick citizens are expelled from the neighboring kingdom."}}}, {name: "Send out an elite ranger group in a preemptive strike.", treasury: -1000, agencies: {m: 15}, constituents: {d: {approval: 10}, e: {approval: 15}, f: {approval: -15}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Neighboring kingdom's forces annex a border swamp."}}}, {name: "Send diplomats to renegotiate trade.", treasury: 5000, agencies: {s: 5, m: -10}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: 10}, g: {approval: -15}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "A spy betrays the council's secret location."}, "0.5-1": {type: "effect", name: "Non-aggression & trade treaty signed with neighboring kingdom."}}}]},
										{name: "New alliance with other city-states deters neighboring kingdom's aggression.", type: "war", options: [{name: "Denounce violence and negotiate a trade deal.", agencies: {s: 10, r: 10, m: -10}, constituents: {e: {approval: 10}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Non-aggression & trade treaty signed with neighboring kingdom."}}}, {name: "Invest in magic defense research - and create jobs.", treasury: -10000, agencies: {s: 10, t: 15, m: 15}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 5}, l: {approval: 10}}, issues: {"0-0.2": {type: "medium", name: "International Alchemy & Armor Association wants to host its annual convention in the capitol."}, "0.2-0.4": {type: "medium", name: "Fairy alchemist discovers potion that shapeshifts elves into lizardfolk."}, "0.4-0.6": {type: "medium", name: "Powerful sorcerer, master of all four elements, returns to claim control."}, "0.6-0.8": {type: "large", name: "Sorcerer-scientists build continent-collapsing super weapon. Neighboring kingdom has one too."}, "0.8-1": {type: "small", name: "A chemical spill at the dwarven factory toxifies a river."}}}, {name: "Leverage this new world order to launch an assault.", treasury: -5000, agencies: {r: -5, m: 10}, constituents: {d: {approval: -5}, f: {approval: -5}, g: {approval: 15}}, issues: {"0-0.5": {type: "effect", name: "The realm's forces seize territory from neighboring kingdom."}, "0.5-1": {type: "medium", name: "Neighboring kingdom seizes trade wagons and merchant ships."}}}]},
										{name: "Neighboring kingdom seizes trade wagons and merchant ships.", type: "war", options: [{name: "Negotiate for peace and their safe return.", treasury: -5000, agencies: {s: 5, r: 5, m: -10}, constituents: {d: {approval: 5}, e: {approval: 10}, f: {approval: 5}, g: {approval: -10}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Non-aggression & trade treaty signed with neighboring kingdom."}}}, {name: "Build a wall around the capitol and pull back all forces.", treasury: -5000, agencies: {s: -5, r: -10, t: 5, m: 5}, constituents: {d: {approval: 10}, e: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.3": {type: "medium", name: "Pirates sink government vessels, steal gold."}, "0.3-0.6": {type: "large", name: "Neighboring kingdom's forces annex a border swamp."}}}, {name: "Enlist civilians in military training to prepare for war.", treasury: -5000, agencies: {s: 5, t: 5, m: 10}, constituents: {e: {approval: 5}, f: {approval: -10}, g: {approval: 10}}, issues: {"0-0.3": {type: "medium", name: "Boom in sword production at national foundries."}, "0.3-0.6": {type: "medium", name: "Advances in crafting lead to much faster crossbows."}, "0.6-0.9": {type: "large", name: "Rebels led by a goblin warlord demand submission to their law."}}}]},
										{name: "Refugees flock to the realm from faraway lands ravaged by war.", type: "medium", options: [{name: "Enact an open-border policy.", agencies: {r: -10, m: -5}, constituents: {d: {approval: -5, population: 2000}, e: {approval: -5, population: 1000}, f: {approval: 5, population: 2000}, g: {approval: 5, population: 2000}, l: {approval: -5, population: 1000}}, issues: {"0-0.3": {type: "effect", name: "Violence erupts in the markets."}, "0.3-0.6": {type: "effect", name: "Some travelers are discovered to be foreign spies."}}}, {name: "Build a border wall and make the neighboring kingdom pay for it.", agencies: {s: 5, r: 5, m: 10}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Neighboring kingdom threatens war over trade disputes."}, "0.5-1": {type: "small", name: "Sick citizens are expelled from the neighboring kingdom."}}}, {name: "Establish an immigration system with background checks and resettlement services.", treasury: -10000, agencies: {s: 15, r: 10, t: 5}, constituents: {d: {population: 1000}, e: {approval: 10, population: 1000}, f: {approval: -5, population: 1000}, g: {approval: -5, population: 1000}, l: {approval: 5, population: 1000}}}]},
										{name: "Improved urban sanitation leads to increased life expectancy for dwarves and elves.", type: "medium", options: [{name: "Take credit for the higher quality of living.", agencies: {s: 5, t: 5}, constituents: {d: {approval: 5, population: 2000}, e: {approval: 10, population: 1000}, g: {approval: -5}, l: {approval: -5}}}, {name: "Commission magic-powered water purification pools throughout the realm.", treasury: -8000, agencies: {s: 15, r: 5, t: 10}, constituents: {d: {approval: -5, population: 2000}, e: {approval: 15, population: 2000}, f: {approval: 10, population: 2000}, g: {population: 1000}, l: {approval: 5, population: 2000}}, issues: {"0-0.5": {type: "medium", name: "Life expectancy rises for goblins & lizardfolk."}}}, {name: "Privatize sewage treatment.", treasury: 8000, funds: 1000, agencies: {s: -5, r: -5, t: 5}, constituents: {d: {approval: 5, population: 2000}, e: {approval: -5, population: 2000}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.5": {type: "small", name: "Sentient vines in the city sewers determined to heal headaches."}, "0.5-1": {type: "medium", name: "Water-borne disease kills dozens in lake country."}}}]},
										{name: "High inflation means peasants struggle to afford necessities.", type: "medium", options: [{name: "Express empathy but let the free market correct itself.", treasury: -5000, agencies: {s: -10, r: -5}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -5}, g: {approval: -10, population: -1000}, l: {approval: -5}}, issues: {"0-0.3": {type: "medium", name: "Fairies and goblins petition for free universal trade apprenticeships."}, "0.3-0.5": {type: "small", name: "There's a black market for lizardfolk scales amongst dwarven armorers."}, "0.5-0.8": {type: "small", name: "Night watch strike for better pay and healthcare benefits."}, "0.8-1": {type: "large", name: "Rebels led by a goblin warlord demand submission to their law."}}}, {name: "Set fixed prices for food, wood, and ores.", agencies: {s: 5, r: 15}, constituents: {d: {approval: -10}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Widespread unemployment affects artisan & merchant class."}}}, {name: "Decrease loan interest rates and bond prices.", agencies: {s: -5, r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}}, issues: {"0-0.3": {type: "small", name: "Lizardfolk entrepreneur in small forest takes all the trees and puts them in a tree museum."}, "0.3-0.6": {type: "small", name: "Sword & shield manufacturer files for bankruptcy due to low sales."}}}]},
									],
									large:     [
										{name: "Enact: the press has limited access to government, dampening approval swings.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", agencies: {s: -5}, constituents: {e: {approval: -15}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "restricted-press", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: the press has limited access to government, dampening approval swings."}, "0-0.5": {type: "effect", name: "The people accuse the council of corruption."}}}]},
										{name: "Enact: council members' votes undisclosed, so approvals reflect enacted option.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, rules: [{name: "secret-voting", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council members' votes undisclosed, so approvals reflect enacted option."}}}]},
										{name: "Enact: council leader can make executive decisions on issues with < 2 minutes left.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", constituents: {d: {approval: 10}, e: {approval: -15}, f: {approval: -10}, g: {approval: 15}, l: {approval: 10}}, rules: [{name: "executive-decision", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: council leader can make executive decisions on issues with < 2 minutes left."}}}]},
										{name: "Enact: poll tax for national elections.", type: "enact", options: [{name: "Don't create the rule."}, {name: "Enact the rule.", treasury: 10000, agencies: {s: -5}, constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: -5, population: -1000}, g: {approval: -15, population: -2000}, l: {approval: -10, population: -1000}}, rules: [{name: "poll-tax", enact: true}], issues: {"0-1": {delay: 300000, type: "repeal", name: "Repeal: poll tax for national elections."}, "0-0.5": {type: "effect", name: "The people accuse the council of corruption."}}}]},
										{name: "Exiled ex-royal returns to claim the throne.", type: "coup", options: [{name: "Laugh.", constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: 10}, g: {approval: 15}, l: {approval: 5}}, issues: {"0-0.3": {type: "effect", name: "A spy betrays the council's secret location."}, "0.3-0.7": {type: "effect", name: "Popular anti-democratic figure leads followers to the capitol."}}}, {name: "Send out the army to kill him and his followers.", treasury: -3000, agencies: {m: 15}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}, {name: "Grant him a nominal role as figure-head king.", treasury: -2000, funds: 1000, agencies: {s: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}]},
										{name: "Wildfires in the enchanted forest kill thousands.", type: "disaster", options: [{name: "Make public remarks about the tragedy.", constituents: {d: {approval: 5}, e: {approval: -15, population: -2000}, f: {approval: -15, population: -2000}, g: {approval: 5}, l: {approval: -10, population: -2000}}, issues: {"0-0.3": {type: "effect", name: "Natural disaster destroys the capitol."}, "0.3-0.6": {type: "medium", name: "Displaced fairies begin an illegal settlement in dwarven hills."}}}, {name: "Create a water wizard fire-fighting force.", treasury: -5000, agencies: {s: 10}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 10}, g: {approval: 5}, l: {approval: 5}}}, {name: "Commission a study on forest management to prevent future tragedies.", treasury: -2000, agencies: {s: 5, t: 10}, constituents: {d: {approval: -5}, e: {approval: 5, population: -1000}, f: {approval: -5, population: -1000}, g: {approval: -5}, l: {approval: 5, population: -1000}}}]},
										{name: "Famine! A bad harvest cannot sustain the population.", type: "disaster", options: [{name: "The strong will survive.", agencies: {s: -15}, constituents: {e: {approval: -10}, f: {approval: -15, population: -1000}, g: {approval: -10, population: -1000}, l: {approval: -5, population: -1000}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}, "0.5-0.7": {type: "collapse", name: "Nearly everyone has died."}}}, {name: "Trade with a nearby city-states to secure the food supply.", treasury: -10000, agencies: {s: 15}, constituents: {e: {approval: 5}, f: {approval: 10}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "New alliance with other city-states deters neighboring kingdom's aggression."}, "0.5-1": {type: "medium", name: "Neighboring kingdom seizes trade wagons and merchant ships."}}}, {name: "Ration the remaining food amongst the populace.", treasury: -2000, agencies: {s: 15, m: 10}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 5, population: -1000}, g: {approval: 5, population: -1000}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "A mob of lizardfolk marches on the capitol."}}}]},
										{name: "Disease poisons water supply across the realm.", type: "disaster", options: [{name: "Encourage people to drink mead, ale, and other alcohol instead.", funds: 2000, agencies: {s: -10, r: -5}, constituents: {d: {approval: 5, population: -1000}, e: {approval: 5, population: -1000}, f: {approval: -5, population: -2000}, g: {approval: 10, population: -2000}, l: {approval: -5, population: -1000}}}, {name: "Dam up rivers and build a magical water filtration plant.", treasury: -10000, agencies: {s: 15, t: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Regulate and ration the remaining water.", treasury: -5000, agencies: {s: 10, r: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}]},
										{name: "Massive floods sweep through cities, destroying homes and shops.", type: "disaster", options: [{name: "Remind people to purchase insurance.", funds: 2000, agencies: {s: -10, r: -5}, constituents: {d: {approval: 5, population: -1000}, e: {approval: -10, population: -1000}, f: {approval: -10, population: -1000}, g: {approval: -10, population: -2000}, l: {approval: -5, population: -1000}}, issues: {"0-0.5": {type: "effect", name: "Famous landmark collapses to rubble."}}}, {name: "Build a giant wall around the city.", treasury: -5000, agencies: {s: 10, t: 10, m: 5}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: 5}}}, {name: "Allocate funds to help citizens rebuild.", treasury: -5000, agencies: {s: 15}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5, population: -1000}, l: {approval: 5}}}]},
										{name: "Widespread unemployment affects artisan & merchant class.", type: "large", options: [{name: "Educate the public on boom/bust economic cycles.", funds: 1000, agencies: {s: -5, t: 5}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -10}, g: {approval: -15}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Violence erupts in the markets."}}}, {name: "Create an unemployment fund.", treasury: -10000, agencies: {s: 15}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 5}, g: {approval: 10}, l: {approval: 5}}}, {name: "Commission public works infrastructure projects, like aqueducts and castles.", treasury: -10000, agencies: {s: 15, t: 5, m: 15}, constituents: {d: {approval: 5}, e: {approval: 10}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Economic opportunity leads to greater immigration."}}}]},
										{name: "Intense snowstorms wreck homes, kill thousands.", type: "disaster", options: [{name: "Encourage temples to care for their followers in this time of need.", agencies: {s: -10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5, population: -1000}, l: {approval: -10, population: -2000}}}, {name: "Use fire magic to warm the cities.", treasury: -3000, agencies: {s: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 10}}}, {name: "Invest in cold-resistant construction materials.", treasury: -3000, agencies: {s: 5, t: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: -5}, l: {approval: 15}}}]},
										{name: "Plague spreads to cities, kills thousands.", type: "disaster", options: [{name: "Tell people to avoid the sick.", agencies: {s: -5}, constituents: {d: {approval: 5, population: -2000}, e: {approval: -5, population: -2000}, f: {population: -2000}, g: {approval: -5, population: -2000}, l: {population: -2000}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}}}, {name: "Quarantine and burn anyone showing symptoms.", treasury: -3000, agencies: {r: 5, m: 10}, constituents: {d: {approval: 10, population: -1000}, e: {approval: -5, population: -1000}, f: {approval: 5, population: -1000}, g: {approval: 5, population: -1000}, l: {approval: 5, population: -1000}}}, {name: "Put the best witch doctors on finding a cure.", treasury: -8000, agencies: {s: 15, t: 15}, constituents: {d: {approval: -5, population: -1000}, e: {approval: 5, population: -1000}, f: {approval: 5, population: -1000}, g: {approval: -5, population: -1000}, l: {approval: 5, population: -1000}}}]},
										{name: "Moon god cultists bring about days of darkness.", type: "disaster", options: [{name: "Curse the darkness.", agencies: {r: -5}, constituents: {d: {approval: -10}, e: {approval: 5}, f: {approval: 10}, g: {approval: 5}, l: {approval: -10, population: -1000}}, issues: {"0-0.3": {type: "effect", name: "Meteor storm pummels the plains."}}}, {name: "Celebrate the eclipse to win favor amongst cultists.", treasury: 2000, agencies: {s: 5}, constituents: {d: {approval: -5}, e: {approval: 15}, f: {approval: 10}, g: {approval: 5}, l: {approval: -10, population: -1000}}}, {name: "Banish the cultists and use magic to bring about sunrise.", treasury: -2000, agencies: {s: 5, r: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: 5}, l: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "A mob of elves marches on the capitol."}}}]},
										{name: "Extreme hurricanes wreak havoc on coastal fishing villages.", type: "disaster", options: [{name: "Tell people to move inland.", agencies: {s: -5, r: 5}, constituents: {d: {approval: 5}, e: {approval: -5, population: -1000}, f: {approval: 5}, g: {approval: -5, population: -1000}, l: {approval: -5, population: -1000}}, issues: {"0-0.5": {type: "small", name: "There's a shortage of fish. People are hungry."}}}, {name: "Use wind magic to protect the realm from hurricanes.", treasury: -5000, agencies: {s: 15, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}}, {name: "Take the opportunity to seize control of the fish markets.", treasury: 5000, agencies: {s: 10, r: 10}, constituents: {d: {approval: -5}, e: {approval: 5, population: -1000}, f: {approval: -5}, g: {approval: -5, population: -1000}, l: {approval: -5, population: -1000}}}]},
										{name: "Zombies slowly amble towards major population centers.", type: "disaster", options: [{name: "Let the people kill zombies themselves.", agencies: {s: -5, m: -10}, constituents: {d: {approval: 5}, e: {approval: 5, population: -1000}, f: {approval: -5, population: -2000}, l: {population: -1000}}, issues: {"0-0.5": {type: "effect", name: "Sick citizens are dying."}, "0.5-0.7": {type: "collapse", name: "Nearly everyone has died."}}}, {name: "Send out the army to kill all the zombies.", treasury: -2000, agencies: {m: 15}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: 10}, g: {approval: -5}, l: {approval: 5}}}, {name: "Hire a necromancer to bring the zombies back to life.", treasury: -10000, agencies: {s: 15, t: 5, m: -5}, constituents: {d: {approval: -5, population: 1000}, e: {approval: 5, population: 1000}, f: {approval: -10}, g: {approval: 5, population: 1000}, l: {approval: -5}}}]},
										{name: "Government-funded ballooning reaches the moon.", type: "large", options: [{name: "Hold a knighting ceremony for the Sky Sailors.", treasury: -1000, agencies: {s: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}, {name: "Begin moon-mining operations.", treasury: 10000, agencies: {r: -5, t: 5}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -10}, g: {approval: 5}}}, {name: "Transform the Sky Navy into a combat force.", treasury: -5000, agencies: {t: 5, m: 10}, constituents: {f: {approval: -10}, g: {approval: 10}, l: {approval: 5}}}]},
										{name: "Giants crush goblin farm towns.", type: "large", options: [{name: "The goblins can handle it.", agencies: {m: -5}, constituents: {e: {approval: -5}, f: {approval: -5}, g: {approval: -15, population: -2000}}, issues: {"0-0.5": {type: "effect", name: "A mob of goblins marches on the capitol."}}}, {name: "Send out the cavalry - casualties expected.", treasury: -4000, agencies: {m: -10}, constituents: {d: {approval: 5}, f: {approval: 5}, g: {approval: 10}, l: {approval: 5}}}, {name: "Relocate the goblin villagers.", treasury: -5000, agencies: {s: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}]},
										{name: "Uninhabited jungle island rises from the sea.", type: "large", options: [{name: "Permit free exploration to the brave.", agencies: {r: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Giant plant monster consumes citizens."}, "0.5-1": {type: "medium", name: "Refugees flock to the realm from faraway lands ravaged by war."}}}, {name: "Conquer it, and establish a permanent colony.", treasury: 15000, agencies: {s: 10, m: 10}, constituents: {d: {approval: 5, population: 1000}, e: {population: 1000}, f: {approval: -10}, g: {approval: 5, population: 1000}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Volcano erupts, destroying island paradise."}}}, {name: "Declare the island off-limits, and establish a secret naval base.", treasury: -5000, agencies: {r: 5, m: 10}, constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}}]},
										{name: "Fiery sinkhole! Flames spew out and burn ancient library.", type: "disaster", options: [{name: "Caution people to stay away.", agencies: {s: -10, t: -10}, constituents: {e: {approval: -15}, g: {approval: 5}}, issues: {"0-0.3": {type: "large", name: "Wildfires in the enchanted forest kill thousands."}, "0.3-0.6": {type: "large", name: "Dragon Lord demands power over the realm, or else will eat everyone."}}}, {name: "Harness the heat to power a weapons foundry and employ hundreds.", treasury: -5000, agencies: {s: 5, t: 5, m: 10}, constituents: {d: {approval: 10}, e: {approval: -10}, f: {approval: -10}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "Boom in sword production at national foundries."}}}, {name: "Cover the sinkhole and build a bigger library out of stone.", treasury: -5000, agencies: {s: 5, t: 10}, constituents: {d: {approval: 5}, e: {approval: 15}, g: {approval: -5}}}]},
										{name: "Some goblins awake to find doppelgangers - exact copies - in their home.", type: "large", options: [{name: "People suspect the wizards... denounce the wizards!", funds: 1000, agencies: {t: -5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5, population: 3000}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}}}, {name: "Imprison any goblin suspected of being a clone.", treasury: -3000, agencies: {s: -5, m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -15, population: 2000}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of goblins marches on the capitol."}}}, {name: "Start a resettlement & apprenticeship fund for goblin clones.", treasury: -7000, agencies: {s: 15, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 15, population: 3000}, l: {approval: -5}}}]},
										{name: "Celebrity swordsman / jousting champion leads a political movement to replace the council.", type: "coup", options: [{name: "Get on his good side as he declares himself king.", funds: 2000, agencies: {r: -10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Secretly hire an assassin and blame outsiders.", treasury: -4000, agencies: {m: 10}, constituents: {d: {approval: 10}, e: {approval: -5}, g: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}, {name: "Bring him up on charges of tax evasion.", treasury: 5000, agencies: {r: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Popular anti-democratic figure leads followers to the capitol."}, "0.5-1": {type: "small", name: "Animal rights activists petition to ban jousting."}}}]},
										{name: "Snow princess threatens eternal winter unless her demands are met.", type: "coup", options: [{name: "Acknowledge her authority over the realm to save lives.", constituents: {d: {approval: -10}, e: {approval: -10}, f: {approval: 10}, g: {approval: 5}, l: {approval: -10}}, rules: [{name: "monarchy-instated", enact: true}], issues: {"0-0.5": {type: "effect", name: "A mob of lizardfolk marches on the capitol."}, "0.5-1": {type: "small", name: "Ice magic innovation leads to better food preservation."}}}, {name: "Rile up the populace to burn her at the stake.", agencies: {s: -5, m: 5}, constituents: {d: {approval: 5, population: -1000}, e: {population: -1000}, f: {approval: -10}, g: {approval: 10, population: -1000}, l: {approval: 5, population: -1000}}, issues: {"0-0.5": {type: "effect", name: "The princess was in another castle. The pillaging continues."}, "0.4-0.8": {type: "effect", name: "Natural disaster destroys the capitol."}}}, {name: "She wants gold. So... let it go.", treasury: -10000, agencies: {s: 5, r: -5}, constituents: {d: {approval: -5}, e: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.3": {type: "large", name: "Intense snowstorms wreck homes, kill thousands."}}}]},
										{name: "Death cult raises ancient warrior chieftess to rule the realm.", type: "coup", options: [{name: "How do you kill someone who's already dead!? Just surrender.", agencies: {s: -10, m: -10}, constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Barricade the capitol and fight! Casualties expected.", treasury: -5000, agencies: {t: 5, m: -10}, constituents: {d: {approval: 5, population: -1000}, e: {approval: 5, population: -1000}, f: {approval: -5}, g: {approval: 5, population: -1000}, l: {approval: 5, population: -1000}}}, {name: "Enlist every able-bodied spellcaster to fight. Casualties expected.", treasury: -3000, agencies: {t: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: 5, population: -1000}, f: {approval: -5, population: -1000}, g: {approval: 5}, l: {approval: 5, population: -1000}}, issues: {"0-0.5": {type: "effect", name: "Magic-users go on strike, crippling the economy."}, "0.5-1": {type: "large", name: "Dwarf scientist-engineer builds a Doomsday Device - demands gold."}}}]},
										{name: "Living shadow consumes everything it touches.", type: "disaster", options: [{name: "Caution people to stay away.", agencies: {s: -5, m: -5}, constituents: {d: {population: -1000}, e: {approval: -5, population: -1000}, f: {approval: 5, population: -1000}, g: {approval: -10, population: -1000}, l: {population: -1000}}, issues: {"0-0.3": {type: "collapse", name: "Nearly everyone has died."}, "0.3-0.6": {type: "effect", name: "Goblin village... vanishes completely."}}}, {name: "Surround it with bright fires and slowly move in.", treasury: -6000, agencies: {t: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}, {name: "Grant absolute authority to the realm's Supreme Sorcerer.", agencies: {r: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, rules: [{name: "monarchy-instated", enact: true}]}]},
										{name: "Dragon Lord demands power over the realm, or else will eat everyone.", type: "coup", options: [{name: "All hail the dragon lord! (This council can keep managing minutiae.)", agencies: {s: -5, r: -5, m: -10}, constituents: {d: {approval: -10}, e: {approval: -10}, g: {approval: -10}, l: {approval: 15}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Offer a ton of gold instead.", treasury: -10000, funds: -3000, agencies: {s: 5}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 5}, g: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}, {name: "Challenge the Dragon Lord. Casualties expected.", agencies: {s: 5, m: -10}, constituents: {d: {approval: 10, population: -1000}, e: {approval: 10, population: -1000}, g: {approval: 10, population: -1000}, l: {approval: -10}}, issues: {"0-0.3": {type: "large", name: "Wildfires in the enchanted forest kill thousands."}, "0.3-0.6": {type: "effect", name: "Famous landmark collapses to rubble."}, "0.6-1": {type: "effect", name: "Gold!"}}}]},
										{name: "Dwarf billionaire declares himself above the law, wants to be called His Majesty.", type: "large", options: [{name: "Ignore the antics, but remind the peasants that hard work leads to fortune.", funds: 1000, agencies: {s: -5, r: -5}, constituents: {d: {approval: 10}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Popular anti-democratic figure leads followers to the capitol."}, "0.5-1": {type: "small", name: "Economic opportunity leads to greater immigration."}}}, {name: "Impose a wealth tax on millionaires and billionaires.", treasury: 25000, agencies: {s: 5, r: 10}, constituents: {d: {approval: -10}, e: {approval: 5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of dwarves marches on the capitol."}}}, {name: "Treat him like royalty - crown, scepter, the whole thing.", funds: 5000, agencies: {r: -10}, constituents: {d: {approval: 5}, e: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}], issues: {"0-0.5": {type: "effect", name: "The people accuse the council of corruption."}}}]},
										{name: "Council librarian discover arcane law: the oldest citizen (currently, an elf) is technically monarch.", type: "large", options: [{name: "Tell this librarian to keep quiet.", treasury: -2000, agencies: {t: -5}, issues: {"0-0.5": {type: "effect", name: "Popular anti-democratic figure leads followers to the capitol."}}}, {name: "Find the old elf and establish a figure-head monarchy.", treasury: -2000, agencies: {s: 5}, constituents: {d: {approval: -10}, e: {approval: 10}, f: {approval: 5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Repeal this law, and begin a overhaul of the legal code.", treasury: -2000, agencies: {r: 5, t: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, g: {approval: 5}}}]},
										{name: "Fairy hypnotist charms people into believing she is queen.", type: "coup", options: [{name: "Succumb to her charms. The council can serve her.", funds: 2000, agencies: {s: -5, r: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 15}, g: {approval: 5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Commission the fire wizards to burn her and her followers.", treasury: -3000, agencies: {r: -5, m: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -15, population: -3000}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.3": {type: "large", name: "Wildfires in the enchanted forest kill thousands."}, "0.3-0.6": {type: "effect", name: "A mob of fairies marches on the capitol."}}}, {name: "Work with lizardfolk alchemists to develop and distribute an anti-charm elixir.", treasury: -5000, agencies: {s: 10, t: 10}, constituents: {e: {approval: 5}, f: {approval: -10}, l: {approval: 10}}, issues: {"0-0.5": {type: "small", name: "Popular love potions lead to a baby boom."}}}]},
										{name: "Rebels led by a goblin warlord demand submission to their law.", type: "coup", options: [{name: "Grant the warlord authority and serve as his governors.", funds: 2000, agencies: {s: -10, r: 5, m: 15}, constituents: {d: {approval: -5}, e: {approval: -10}, f: {approval: -5}, g: {approval: 15}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Negotiate with the goblins, but banish them from the realm.", treasury: -10000, agencies: {s: 5, r: 5, m: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, l: {approval: -5}}}, {name: "Send the cavalry to end this in a surprise raid.", treasury: -2000, agencies: {r: 5, m: 10}, constituents: {d: {approval: 10}, e: {approval: 5}, g: {approval: -15}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A mob of goblins marches on the capitol."}}}]},
										{name: "Lizardfolk healer offers to cure the sick, in exchange for worship as divine leader.", type: "large", options: [{name: "Do not get involved in religious movements.", agencies: {r: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, l: {approval: 5, population: 1000}}, issues: {"0-0.5": {type: "effect", name: "Cult leader commands the faithful to the capitol steps."}}}, {name: "For the health of the people, accept these terms.", agencies: {s: 15}, constituents: {d: {approval: -10, population: 1000}, e: {approval: -5, population: 1000}, f: {approval: 10, population: 1000}, g: {approval: 5, population: 1000}, l: {approval: 15, population: 1000}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Call this a cult of crazies and banish them from the realm.", agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, l: {approval: -15, population: 1000}}, issues: {"0-0.5": {type: "effect", name: "Cult leader commands the faithful to the capitol steps."}}}]},
										{name: "Dwarf scientist-engineer builds a Doomsday Device - demands gold.", type: "coup", options: [{name: "Don't negotiate with terrorists. Send scouts to capture him and his device.", treasury: -2000, agencies: {s: 5, r: 5, m: 5}, constituents: {e: {approval: 5}, f: {approval: 5}, g: {approval: 10}, l: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "Gold!"}, "0.5-1": {type: "collapse", name: "Nearly everyone has died."}}}, {name: "Give him the money.", treasury: -20000, agencies: {s: 5, r: -10, m: -5}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: -10}, l: {approval: -10}}}, {name: "Have the best sorcerers build a magic dome of protection.", treasury: -8000, agencies: {s: 10, t: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 10}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "Fairy curses dwarf: anything he touches turns to gold."}}}]},
										{name: "Demigoddess brings thunderstorms wherever she goes.", type: "large", options: [{name: "Track her movements and warn people to stay away.", treasury: -2000, agencies: {r: 5}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.3": {type: "effect", name: "Natural disaster destroys the capitol."}, "0.3-0.6": {type: "large", name: "Massive floods sweep through cities, destroying homes and shops."}}}, {name: "Challenge her to a duel against the realm's Supreme Sorcerer.", treasury: -2000, agencies: {m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "collapse", name: "Nearly everyone has died."}, "0.5-1": {type: "small", name: "It's a generally good day in the realm."}}}, {name: "Grant her a role as monarch in exchange for using her magic... to revolutionize technology.", treasury: 8000, agencies: {s: 10, t: 15}, constituents: {d: {approval: 5}, f: {approval: 10}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}], issues: {"0-0.3": {type: "medium", name: "Advances in crafting lead to much faster crossbows."}, "0.3-0.6": {type: "medium", name: "Boom in sword production at national foundries."}, "0.6-1": {type: "effect", name: "Citizens who can't pay for protection have their homes wrecked."}}}]},
										{name: "Ethereal being from another plane appears, calls all nations to lay down arms. People panic.", type: "large", options: [{name: "Let the citizens decide for themselves.", agencies: {s: -10, r: -5, m: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.2": {type: "effect", name: "Natural disaster destroys the capitol."}, "0.2-0.4": {type: "effect", name: "Violence erupts in the markets."}, "0.4-0.6": {type: "large", name: "Living shadow consumes everything it touches."}, "0.6-0.8": {type: "effect", name: "Goblin village... vanishes completely."}, "0.8-1": {type: "effect", name: "Cult leader commands the faithful to the capitol steps."}}}, {name: "Ally with the neighboring kingdom to destroy the extradimensional entity. Casualties expected.", treasury: -5000, agencies: {s: 10, t: 5, m: -10}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -10}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "collapse", name: "Nearly everyone has died."}}, "0.5-1": {type: "effect", name: "Non-aggression & trade treaty signed with neighboring kingdom."}}, {name: "Confiscate all weapons, dismantle them for parts, and trust that the being will leave.", treasury: 7000, agencies: {s: 5, r: 10, t: -10, m: -25}, constituents: {d: {approval: -15}, e: {approval: -5}, f: {approval: 15}, g: {approval: -15}, l: {approval: -10}}, issues: {"0-0.5": {type: "small", name: "It's a generally good day in the realm."}, "0.5-1": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}]},
										{name: "Meteor storm pummels the plains.", type: "disaster", options: [{name: "Tell people to flee their homes.", agencies: {s: -15}, constituents: {e: {approval: -5, population: -1000}, f: {approval: -10, population: -2000}, g: {approval: -10, population: -2000}, l: {approval: -10, population: -2000}}, issues: {"0-0.5": {type: "collapse", name: "Nearly everyone has died."}, "0.5-1": {type: "collapse", name: "Citizens who can't pay for protection have their homes wrecked."}}}, {name: "Move citizens underground.", treasury: -10000, agencies: {s: 15, t: 10}, constituents: {d: {approval: 15}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.3": {type: "large", name: "Widespread unemployment affects artisan & merchant class."}, "0.3-0.6": {type: "large", name: "Famine! A bad harvest cannot sustain the population."}}}, {name: "Draft the fire wizards to fight back this armaggeddon.", agencies: {t: 10, m: 5}, constituents: {d: {approval: -5}, e: {approval: 15}, f: {approval: 10}, g: {approval: -5}}, issues: {"0-0.3": {type: "large", name: "Wildfires in the enchanted forest kill thousands."}, "0.3-0.6": {type: "effect", name: "Natural disaster destroys the capitol."}}}]},
										{name: "Coal shortage threatens to leave many to freeze this winter.", type: "large", options: [{name: "The market will set the right price for coal.", funds: 1000, agencies: {s: -5, r: -10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -10, population: -1000}, l: {approval: -15, population: -2000}}, issues: {"0-0.5": {type: "effect", name: "Violence erupts in the markets."}, "0.5-1": {type: "large", name: "Snow princess threatens eternal winter unless her demands are met."}}}, {name: "Ban price gouging and release coal from the national reserves.", treasury: -8000, agencies: {s: 10, r: 10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10}, l: {approval: 15}}}, {name: "Harvest more firewood from the enchanted forest and distribute it.", treasury: -4000, agencies: {s: 10, r: -5}, constituents: {e: {approval: 5}, f: {approval: -15, population: -1000}, g: {approval: 10}, l: {approval: -5}}, issues: {"0-0.5": {type: "medium", name: "Displaced fairies begin an illegal settlement in dwarven hills."}}}]},
										{name: "Old lamp in council chambers discovered to hold a genie, who grants 1 wish.", type: "large", options: [{name: "Wish to be loved by all people.", constituents: {d: {approval: 10}, e: {approval: 10}, f: {approval: 10}, g: {approval: 10}, l: {approval: 10}}, issues: {"0-0.5": {delay: 0, type: "large", name: "Zombies slowly amble towards major population centers."}}}, {name: "Wish for lots of money.", treasury: 20000, funds: 4000, issues: {"0-0.5": {delay: 0, type: "large", name: "Dwarf scientist-engineer builds a Doomsday Device - demands gold."}}}, {name: "Wish for world peace and stability.", agencies: {s: 15, r: 5, t: 5, m: -15}, issues: {"0-0.5": {delay: 0, type: "large", name: "Ethereal being from another plane appears, calls all nations to lay down arms. People panic."}}}]},
										{name: "Neighboring kingdom's sub-surface vessels torpedo the realm's navy.", type: "war", options: [{name: "To war!", treasury: -5000, agencies: {s: 5, m: 10}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "War! Neighboring kingdom invades the realm!"}, "0.5-1": {type: "effect", name: "Victory! Neighboring kingdom forces are on the retreat."}}}, {name: "Abandon the coast.", agencies: {s: -15, r: -5, m: -10}, constituents: {d: {approval: -10}, e: {approval: -5, population: -1000}, f: {population: -1000}, g: {approval: -10, population: -1000}, l: {approval: -10, population: -1000}}, issues: {"0-0.5": {type: "medium", name: "Neighboring kingdom seizes trade wagons and merchant ships."}, "0.5-1": {type: "large", name: "Celebrity swordsman / jousting champion leads a political movement to replace the council."}}}, {name: "Send in the wizards.", treasury: -3000, agencies: {s: 5, t: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Extreme hurricanes wreak havoc on coastal fishing villages."}, "0.5-1": {}}}]},
										{name: "Sorcerer-scientists build continent-collapsing super weapon. Neighboring kingdom has one too.", type: "war", options: [{name: "Negotiate peace through mutually assured destruction.", treasury: -5000, agencies: {s: 5, r: 5, t: 10, m: 15}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 10}, g: {approval: -10}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Dwarf scientist-engineer builds a Doomsday Device - demands gold."}, "0.5-1": {type: "effect", name: "Neighboring kingdom towns surrender to realm's siege machines."}}}, {name: "Use it in a preemptive strike.", treasury: -5000, agencies: {r: -5, t: 10, m: 15}, constituents: {d: {approval: -5}, e: {approval: -15}, f: {approval: -15}, g: {approval: 15}, l: {approval: -10}}, issues: {"0-0.7": {type: "collapse", name: "Nearly everyone has died."}, "0.7-1": {type: "effect", name: "Neighboring kingdom's army kills civilians en route to capitol."}}}, {name: "Draft a disarmament pact.", treasury: -5000, agencies: {s: 5, r: 10, m: -10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 10}, g: {approval: -10}, l: {approval: 5}}, issues: {"0-1": {type: "effect", name: "Non-aggression & trade treaty signed with neighboring kingdom."}}}]},
										{name: "Neighboring kingdom's forces annex a border swamp.", type: "war", options: [{name: "Cede the territory (and its people) to avoid further bloodshed.", agencies: {s: -10, m: -5}, constituents: {d: {approval: -5}, f: {approval: -5, population: -1000}, l: {approval: -5, population: -1000}}, issues: {"0-0.5": {type: "medium", name: "New alliance with other city-states deters neighboring kingdom's aggression."}}}, {name: "Begin construction of a magical super weapon.", treasury: -10000, agencies: {s: 5, t: 10, m: 15}, constituents: {e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 10}}, issues: {"0-0.5": {type: "large", name: "Living shadow consumes everything it touches."}, "0.5-1": {type: "large", name: "Sorcerer-scientists build continent-collapsing super-weapon. Neighboring kingdom has one too."}}}, {name: "Send raiding parties to conquer a territory of equal size.", treasury: -5000, agencies: {m: 10}, constituents: {d: {approval: 5}, g: {approval: 10}, l: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "The realm's forces seize territory from neighboring kingdom."}, "0.5-1": {type: "large", name: "Uninhabited jungle island rises from the sea."}}}]},
										{name: "In a shocking raid, neighboring kingdom's zeppelins air-bomb a city.", type: "war", options: [{name: "Tell citizens to keep calm and carry on... underground.", treasury: -8000, agencies: {s: 10, r: -5}, constituents: {d: {approval: 10}, g: {approval: 10}, f: {population: -1000}, l: {approval: -10, population: -1000}}, issues: {"0-0.3": {type: "effect", name: "Famous landmark collapses to rubble."}, "0.3-0.6": {type: "effect", name: "Goblin village... vanishes completely."}}}, {name: "Launch a counter-offensive of ground troops.", treasury: -5000, agencies: {s: 5, m: 10}, constituents: {d: {approval: 10, population: -1000}, e: {approval: 5, population: -1000}, g: {approval: 10, population: -1000}, l: {approval: 10}}, issues: {"0-0.5": {type: "effect", name: "War! Neighboring kingdom invades the realm!"}, "0.5-1": {type: "medium", name: "New alliance with other city-states deters neighboring kingdom's aggression."}}}, {name: "Publicly plead for peace while secretly building airships.", treasury: -10000, agencies: {r: 5, t: 10, m: 10}, constituents: {d: {approval: -5}, e: {approval: 5, population: -1000}, f: {approval: 10, population: -1000}, g: {approval: -5}}, issues: {"0-0.3": {type: "small", name: "Alchemists convert sky whale blubber into healing elixir."}, "0.3-0.6": {type: "large", name: "Government-funded ballooning reaches the moon."}, "0.6-0.9": {type: "effect", name: "Neighboring kingdom towns surrender to realm's siege machines."}}}]},
									],

								// effects only
									effect:   [
										{name: "New evidence exonerates recently executed criminals.",            timeout: 120000, type: "effect", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Apologize, and strengthen due process procedures.", treasury: -3000, agencies: {s: 5, r: 5, m: -5}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}]},
										{name: "A spy betrays the council's secret location.",                    timeout: 120000, type: "coup", options: [{name: "Do nothing.", agencies: {m: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Move the council to a new location.", treasury: -5000, agencies: {s: 5, t: 5, m: 5}, constituents: {d: {approval: -5}, e: {approval: -10}, f: {approval: -5}, g: {approval: -10}, l: {approval: -5}}}]},
										{name: "The people accuse the council of corruption.",                    timeout: 120000, type: "effect", options: [{name: "Do nothing.", constituents: {d: {approval: -10}, e: {approval: -10}, f: {approval: -10}, g: {approval: -10}, l: {approval: -10}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Scale back, sell off assets, and consider new rules.", treasury: 5000, funds: -2000, agencies: {s: -10, r: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-1": {type: "small", name: "Enact: government audits project accurate agency changes."}, "0-2": {type: "small", name: "Enact: 5-minute term limits for council leader."}, "0-3": {type: "small", name: "Enact: council leaders cannot serve consecutive terms."}, "0-4": {type: "medium", name: "Enact: council members barred from receiving corporate kickbacks."}, "0-5": {type: "medium", name: "Enact: the treasury must stay positive."}}}]},
										{name: "Magic-users go on strike, crippling the economy.",                timeout: 120000, type: "effect", options: [{name: "Do nothing.", agencies: {s: -10, r: -5}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: -5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Repeal restrictions on magic.", agencies: {r: -10, t: 5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 10}, g: {approval: -5}, l: {approval: 5}}}]},
										{name: "Violence erupts in the markets.",                                 timeout: 120000, type: "effect", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Send out more troops to control the situation.", treasury: -5000, agencies: {r: 5, m: 15}, constituents: {d: {approval: 5}, e: {approval: -10}, f: {approval: -10}, g: {approval: -10}, l: {approval: 5}}}]},
										{name: "A mob of dwarves marches on the capitol.",                        timeout: 120000, type: "coup", options: [{name: "Do nothing.", constituents: {d: {approval: 15}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Arrest them.", treasury: -3000, agencies: {m: 10}, constituents: {d: {approval: -15}}}]},
										{name: "A mob of elves marches on the capitol.",                          timeout: 120000, type: "coup", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: 15}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Arrest them.", treasury: -3000, agencies: {m: 10}, constituents: {e: {approval: -15}}}]},
										{name: "A mob of fairies marches on the capitol.",                        timeout: 120000, type: "coup", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: 15}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Arrest them.", treasury: -3000, agencies: {m: 10}, constituents: {f: {approval: -15}}}]},
										{name: "A mob of goblins marches on the capitol.",                        timeout: 120000, type: "coup", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 15}, l: {approval: -5}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Arrest them.", treasury: -3000, agencies: {m: 10}, constituents: {g: {approval: -15}}}]},
										{name: "A mob of lizardfolk marches on the capitol.",                     timeout: 120000, type: "coup", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: 15}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Arrest them.", treasury: -3000, agencies: {m: 10}, constituents: {l: {approval: -15}}}]},
										{name: "They decide to build anyway.",                                    timeout: 120000, type: "effect", options: [{name: "Do nothing.", agencies: {r: -10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}}, {name: "Fine them.", treasury: 5000, agencies: {r: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}}]},
										{name: "Some travelers are discovered to be foreign spies.",              timeout: 120000, type: "effect", options: [{name: "Do nothing.", agencies: {m: -10}, constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: -5}, g: {approval: -10}, l: {approval: -5}}}, {name: "Hold them hostage and trade them back for gold.", treasury: 5000, agencies: {m: 5}, constituents: {d: {approval: 10}, e: {approval: -5}, f: {approval: 5}, g: {approval: 5}, l: {approval: 5}}}]},
										{name: "Citizens who can't pay for protection have their homes wrecked.", timeout: 120000, type: "disaster", options: [{name: "Do nothing.", agencies: {r: -10, m: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}}, {name: "Crack down on organized crime.", treasury: -5000, agencies: {r: 5, m: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: -10}, l: {approval: 5}}}]},
										{name: "Wild beasts wreak havoc.",                                        timeout: 120000, type: "disaster", options: [{name: "Do nothing.", agencies: {m: -5}, constituents: {d: {approval: -10, population: -1000}, e: {approval: -10, population: -1000}, f: {approval: -10, population: -1000}, g: {approval: -10, population: -1000}, l: {approval: -10, population: -1000}}, issues: {"0-0.5": {type: "collapse", name: "Nearly everyone has died."}}}, {name: "Hunt down the beasts.", treasury: -3000, agencies: {m: 5}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}}]},
										{name: "Sick citizens are dying.",                                        timeout: 120000, type: "disaster", options: [{name: "Do nothing.", agencies: {s: -5, t: -10}, constituents: {d: {approval: -10, population: -1000}, e: {approval: -10, population: -1000}, f: {approval: -10, population: -1000}, g: {approval: -10, population: -1000}, l: {approval: -10, population: -1000}}, issues: {"0-0.8": {type: "collapse", name: "Nearly everyone has died."}}}, {name: "Allocate more funds to research and fight disease.", treasury: -8000, agencies: {s: 10, t: 15}, constituents: {d: {approval: 5}, e: {approval: 10}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Lizardfolk healer offers to cure the sick, in exchange for worship as divine leader."}}}]},
										{name: "Looters steal prized items from government facilities.",          timeout: 120000, type: "effect", options: [{name: "Do nothing.", treasury: -5000, agencies: {s: -5, t: -10}, constituents: {d: {approval: -5}, e: {approval: -10}}}, {name: "Increase security at parks, zoos, museums, and government buildings.", treasury: -8000, agencies: {m: 10}, constituents: {d: {approval: 5}, f: {approval: -5}, g: {approval: 5}}}]},
										{name: "Goblin village... vanishes completely.",                          timeout: 120000, type: "disaster", options: [{name: "Do nothing.", constituents: {g: {approval: -10, population: -1000}}}, {name: "Wall off the affected area and make it a National Day of Sorrow.", treasury: -4000, agencies: {s: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 10, population: -1000}, l: {approval: -5}}}]},
										{name: "Crossbow-wielding berserker caught by palace guard.",             timeout: 120000, type: "disaster", options: [{name: "Do nothing.", agencies: {m: -5}, constituents: {e: {approval: -5}, f: {approval: -10}, l: {approval: -5}}}, {name: "Regulate the crossbow market.", treasury: 2000, agencies: {r: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, g: {approval: -5}}}]},
										{name: "Fairy composer plans to perform her Symphony to End Time.",       timeout: 120000, type: "disaster", options: [{name: "Do nothing.", constituents: {d: {approval: -10}, e: {approval: -5}, f: {approval: 15}, g: {approval: -10}, l: {approval: -5}}, issues: {"0-0.8": {type: "collapse", name: "Nearly everyone has died."}}}, {name: "Interrupt the show and imprison the composer.", agencies: {s: -5, r: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -15}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Cult leader commands the faithful to the capitol steps."}}}]},
										{name: "Neighboring kingdom lands a hot air balloon on the moon.",        timeout: 120000, type: "effect", options: [{name: "Do nothing.", constituents: {d: {approval: -10}, e: {approval: -10}, f: {approval: -5}, g: {approval: -10}, l: {approval: -5}}}, {name: "Invest in the domestic ballooning sector.", treasury: -10000, agencies: {s: 5, t: 15}, constituents: {d: {approval: 5}, e: {approval: 10}, g: {approval: 5}}, issues: {"0-0.5": {type: "large", name: "Government-funded ballooning reaches the moon."}}}]},
										{name: "The princess was in another castle. The pillaging continues.",    timeout: 120000, type: "effect", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -5}, g: {approval: 5}, l: {approval: -10}}, issues: {"0-0.5": {type: "effect", name: "Wild beasts wreak havoc."}}}, {name: "Grant the princess sanctuary.", treasury: -3000, agencies: {s: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 10}}, rules: [{name: "monarchy-instated", enact: true}]}]},
										{name: "Giant plant monster consumes citizens.",                          timeout: 120000, type: "disaster", options: [{name: "Do nothing.", constituents: {d: {approval: -5, population: -1000}, e: {approval: -5, population: -1000}, g: {approval: -5, population: -1000}, l: {approval: -5, population: -1000}}, issues: {"0-0.7": {type: "collapse", name: "Nearly everyone has died."}}}, {name: "Establish a fire fighting-force.", treasury: -6000, agencies: {s: 5, m: 10}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -10}, g: {approval: 5}, l: {approval: 5}}}]},
										{name: "Volcano erupts, destroying island paradise.",                     timeout: 120000, type: "disaster", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5, population: -1000}, f: {approval: -5, population: -1000}, g: {approval: -5}, l: {approval: -5, population: -1000}}}, {name: "Create a College of Fire Magic to prevent future tragedies.", treasury: -8000, agencies: {s: 5, t: 10}, constituents: {e: {approval: 5, population: -1000}, f: {approval: 5, population: -1000}, l: {approval: 5}}}]},
										{name: "Recent events have made a martyr. People take to the streets.",   timeout: 120000, type: "coup", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.8": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}, {name: "Arrest them.", treasury: -3000, agencies: {m: 10}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}}]},
										{name: "Famous landmark collapses to rubble.",                            timeout: 120000, type: "disaster", options: [{name: "Do nothing.", agencies: {s: -5, t: -5}, constituents: {d: {approval: -5}, e: {approval: -5}, f: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.8": {type: "effect", name: "The people accuse the council of corruption."}}}, {name: "Rebuild.", treasury: -10000, agencies: {s: 5, t: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, g: {approval: 5}}}]},
										{name: "Gold!",                                                           timeout: 120000, type: "effect", options: [{name: "Do nothing.", treasury: 20000, funds: 2000, constituents: {d: {approval: -5}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.8": {type: "effect", name: "The people accuse the council of corruption."}}}, {name: "Distribute it amongst the people.", agencies: {s: 10}, constituents: {d: {approval: 10}, e: {approval: 5}, f: {approval: 5}, g: {approval: 10}, l: {approval: 5}}, issues: {"0-0.5": {type: "medium", name: "High inflation means peasants struggle to afford necessities."}, "0.25-0.75": {type: "medium", name: "Enact: the treasury must stay positive."}, "0.5-1": {type: "small", name: "Economic opportunity leads to greater immigration."}}}]},
										{name: "Natural disaster destroys the capitol.",                          timeout: 120000, type: "disaster", options: [{name: "Do nothing.", agencies: {s: -15, t: -10}, constituents: {d: {approval: -10, population: -2000}, e: {approval: -10, population: -2000}, g: {approval: -10, population: -2000}, l: {approval: -10, population: -2000}}, issues: {"0-0.8": {type: "collapse", name: "Nearly everyone has died."}}}, {name: "Escape to a secret military bunker.", agencies: {s: -15, t: -10, m: 5}, constituents: {d: {approval: -10, population: -2000}, e: {approval: -10, population: -2000}, f: {approval: -10}, g: {population: -2000}, l: {approval: -10, population: -2000}}, issues: {"0-0.5": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}}}]},
										{name: "Beautiful sorceress-queen infiltrates the government.",           timeout: 120000, type: "coup", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 10}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Send the best wizards to fight her back. Casualties expected.", treasury: -5000, agencies: {s: 5, m: -5}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: -10}, g: {approval: -5}, l: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}]},
										{name: "Popular anti-democratic figure leads followers to the capitol.",  timeout: 120000, type: "coup", options: [{name: "Do nothing.", constituents: {f: {approval: -5}, g: {approval: 5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Command the palace guards to execute them all. Casualties expected.", agencies: {s: 5, m: -5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Recent events have made a martyr. People take to the streets."}}}]},
										{name: "Cult leader commands the faithful to the capitol steps.",         timeout: 120000, type: "coup", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Capture the cultists, execute the leaders, and move the rest to reeducation camps.", agencies: {t: 5, m: 5}, constituents: {d: {approval: 5}, e: {approval: 5}, f: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "New evidence exonerates recently executed criminals."}}}]},
										{name: "War! Neighboring kingdom invades the realm!",                     timeout: 120000, type: "war", options: [{name: "Do nothing.", agencies: {s: -10, m: -10}, constituents: {d: {approval: -10, population: -1000}, e: {approval: -5, population: -1000}, f: {approval: -5, population: -1000}, g: {approval: -15, population: -1000}, l: {approval: -10, population: -1000}}, issues: {"0-1": {name: "Neighboring kingdom's army kills civilians en route to capitol."}}}, {name: "Offer them tribute if they leave citizens unharmed.", treasury: -20000, funds: -3000, agencies: {s: 10, m: -5}, constituents: {d: {approval: -5}, e: {approval: 10}, f: {approval: 10}, g: {approval: 5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "Non-aggression & trade treaty signed with neighboring kingdom."}}}, {name: "Meet them in battle. Casualties expected.", treasury: -10000, agencies: {s: 5, m: -15}, constituents: {d: {approval: 15, population: -1000}, e: {approval: 10, population: -1000}, f: {approval: -5}, g: {approval: 15, population: -1000}, l: {approval: 10, population: -1000}}, issues: {"0-0.3": {type: "effect", name: "Neighboring kingdom's army kills civilians en route to capitol."}, "0.3-0.6": {type: "effect", name: "Victory! Neighboring kingdom forces are on the retreat."}, "0.6-0.9": {type: "effect", name: "Neighboring kingdom towns surrender to realm's siege machines."}, "0.9-1": {type: "large", name: "Sorcerer-scientists build continent-collapsing super weapon. Neighboring kingdom has one too."}}}]},
										{name: "Neighboring kingdom towns surrender to realm's siege machines.",  timeout: 120000, type: "war", options: [{name: "Do nothing.", treasury: 10000, agencies: {r: 5, m: -10}, constituents: {d: {approval: 5}, e: {approval: 10}, g: {approval: -10}}}, {name: "Fire the trebuchets. Plunder the spoils.", treasury: 20000, agencies: {r: -10, t: 5, m: 10}, constituents: {d: {approval: 5}, g: {approval: 5}, l: {approval: -5}}, issues: {"0-0.5": {type: "large", name: "In a shocking raid, neighboring kingdom's zeppelins air-bomb a city."}}}]},
										{name: "Victory! Neighboring kingdom forces are on the retreat.",         timeout: 120000, type: "war", options: [{name: "Do nothing.", constituents: {d: {approval: -5}, f: {approval: 5}, g: {approval: -5}}, issues: {"0-0.5": {type: "effect", name: "Non-aggression & trade treaty signed with neighboring kingdom."}}}, {name: "Pursue and engage.", treasury: -5000, agencies: {m: 10}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -10}, g: {approval: 15}, l: {approval: -5}}, issues: {"0-0.3": {type: "effect", name: "The realm's forces seize territory from neighboring kingdom."}, "0.3-0.6": {type: "effect", name: "Neighboring kingdom towns surrender to realm's siege machines."}}}, {name: "Take war prisoners and use them for labor.", treasury: 8000, agencies: {s: 5, r: -5, m: 5}, constituents: {d: {approval: 5, population: 1000}, e: {approval: -5, population: 1000}, f: {approval: 5}, g: {approval: -5, population: 1000}, l: {approval: -5, population: 1000}}, issues: {"0-0.5": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}, "0.5-1": {type: "medium", name: "Enact: convicted criminals barred from voting."}}}]},
										{name: "The realm's forces seize territory from neighboring kingdom.",    timeout: 120000, type: "war", options: [{name: "Do nothing.", treasury: 5000, agencies: {r: -5, m: 10}, constituents: {e: {approval: 5}, f: {approval: -5}, g: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "War! Neighboring kingdom invades the realm!"}}}, {name: "Rule over the annexed region's populace.", agencies: {s: 10, r: 10, m: 5}, constituents: {d: {population: 2000}, e: {approval: 15, population: 2000}, f: {population: 2000}, g: {approval: 10, population: 2000}, l: {approval: -5, population: 2000}}, issues: {"0-0.5": {type: "rebellion", name: "Rebellion: a rebellion attempts to overthrow the council!"}, "0.5-1": {type: "effect", name: "Gold!"}}}, {name: "Pull the troops home in exchange for tribute.", treasury: 20000, agencies: {s: 10, r: 5, m: -10}, constituents: {d: {approval: 5}, e: {approval: 10}, f: {approval: 10}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "effect", name: "A spy betrays the council's secret location."}}}]},
										{name: "Non-aggression & trade treaty signed with neighboring kingdom.",  timeout: 120000, type: "war", options: [{name: "Do nothing.", treasury: 5000, agencies: {s: 10, r: 15, m: -10}, constituents: {d: {approval: 10}, e: {approval: 10}, f: {approval: 5}, g: {approval: -5}, l: {approval: 5}}, issues: {"0-0.5": {type: "small", name: "It's a generally good day in the realm."}}}, {name: "Immediately break the deal and invade.", treasury: -5000, agencies: {r: -5, m: 15}, constituents: {e: {approval: -10}, g: {approval: 15}}, issues: {"0-0.5": {type: "effect", name: "The realm's forces seize territory from neighboring kingdom."}, "0.5-0.7": {type: "medium", name: "Neighboring kingdom begins naval blockade of important port."}, "0.7-1": {type: "effect", name: "War! Neighboring kingdom invades the realm!"}}}]},
										{name: "Neighboring kingdom's army kills civilians en route to capitol.", timeout: 120000, type: "war", options: [{name: "Do nothing.", agencies: {s: -15, m: -15}, constituents: {d: {approval: -10, population: -2000}, e: {approval: -10, population: -2000}, f: {approval: -10, population: -2000}, g: {approval: -10, population: -2000}, l: {approval: -10, population: -2000}}, issues: {"0-1": {type: "collapse", name: "Nearly everyone has died."}}}, {name: "Surrender. Acknowledge their monarch's rule, and plead to stay on as regional governors.", agencies: {s: -10, r: -10, m: -10}, constituents: {d: {approval: -5}, e: {approval: 5}, f: {approval: 5}, g: {approval: -5}, l: {approval: -5}}, rules: [{name: "monarchy-instated", enact: true}]}, {name: "Encourage guerilla warfare and anarchy.", agencies: {s: -15, r: -15, m: 5}, constituents: {d: {approval: 5}, e: {approval: -5}, f: {approval: -5}, g: {approval: 10}, l: {approval: 5}}, rules: [{name: "anarchy-instated", enact: true}]}]},
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
									election: 0,
									name:     [],
									leader:   null,
									term:     0,
									issue:    null,
									cooldown: 0,
									exists:   true,
									flag:     [createFlag(), createFlag()]
								},
								treasury: 0,
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
								members: {},
								rules:   [],
								last:    null,
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
								victory:   false,
								flag:      createFlag()
							},
							name:     null,
							district: 0,
							race:     null,
							ideology: null,
							funds:    0,
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
							}
						}
					break

					case "issue":
						return {
							id:          generateRandom(),
							name:        null,
							timeout:     getAsset("configs").defaultIssueTimeout,
							type:        null,
							options:     []
						}
					break

					case "option":
						return {
							id:          generateRandom(),
							name:        null,
							state: {
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
							issues: {}
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
		function renderHTML(REQUEST, path, callback) {
			try {
				var html = {}
				FS.readFile(path, "utf8", function (error, file) {
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
		function determineSession(REQUEST, RESPONSE, callback) {
			try {
				if (isBot(REQUEST.headers["user-agent"])) {
					REQUEST.session = null
				}
				else if (!REQUEST.cookie.session || REQUEST.cookie.session == null || REQUEST.cookie.session == 0) {
					REQUEST.session = {
						id: generateRandom(),
						updated: new Date().getTime(),
						info: {
							"ip":         REQUEST.ip,
				 			"user-agent": REQUEST.headers["user-agent"],
				 			"language":   REQUEST.headers["accept-language"],
						}
					}
				}
				else {
					REQUEST.session = {
						id: REQUEST.cookie.session,
						updated: new Date().getTime(),
						info: {
							"ip":         REQUEST.ip,
				 			"user-agent": REQUEST.headers["user-agent"],
				 			"language":   REQUEST.headers["accept-language"],
						}
					}
				}

				callback(REQUEST, RESPONSE)
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
