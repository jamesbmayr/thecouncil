/*** websocket ***/
	/* socket */
		var socket = null
		createSocket()
		function createSocket() {
			socket = new WebSocket(location.href.replace("http","ws"))
			socket.onopen = function() { socket.send(null) }
			socket.onerror = function(error) {}
			socket.onclose = function() {
				socket = null
				window.location = "../../../../"
			}

			socket.onmessage = function(message) {
				try {
					var post = JSON.parse(message.data)
					if (post && (typeof post == "object")) {
						receivePost(post)
					}
				}
				catch (error) {}
			}
		}

	/* checkLoop */
		var checkLoop = setInterval(function() {
			if (!socket) {
				try {
					createSocket()
				}
				catch (error) {}
			}
			else {
				clearInterval(checkLoop)
			}
		}, 5000)

/*** background ***/
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

/*** submit ***/
	/* submitStart */
		document.getElementById("submit-start").addEventListener(on.click, submitStart)
		function submitStart(event) {
			if (event.target.id == "submit-start") {
				socket.send(JSON.stringify({
					action: "submitStart"
				}))
			}
		}

/*** receives ***/
	/* receivePost */
		function receivePost(data) {
			// redirect
				if (data.location) {
					window.location = data.location
				}

			// message
				if (data.message) {
					displayMessage(data.message)
				}

			// pre-start
				if (data.names) {
					if (data.names[0]) {
						for (var n in data.names) {
							createNameFlag(data.names[n])
						}
					}
					else {
						for (var n in data.names) {
							updateNameFlag(data.names[n])
						}
					}
				}

			// start
				if (data.start) {
					receiveStart(data)
				}
				if (data.show) {
					for (var s in data.show) {
						document.getElementById(data.show[s]).className = ""
					}
				}

			// new data
				if (data.data) {
					updateGovernment(data.data)
					updateIssues(data.data)
				}

			// ending
				if (data.end) {
					receiveEnd(data)
				}
		}

	/* receiveStart */
		function receiveStart(data) {
			clearInterval(backgroundLoop)
			document.getElementById("container").setAttribute("gameplay", true)
			createGovernment(data.data)

			if (data.data.state.time < 60000) {
				["nation-flag", "column-left", "government", "government-name", "government-treasury", "government-agencies", "government-agencies-s", "government-agencies-r", "government-agencies-t", "government-agencies-m", "government-constituents-line", "government-constituents", "government-constituents-d", "government-constituents-e", "government-constituents-f", "government-constituents-g", "government-constituents-l", "government-election", "government-leader"].forEach(function(id) {
					document.getElementById(id).className = "hidden"
				})
			}
		}

	/* receiveEnd */
		function receiveEnd(data) {
			document.getElementById("container").removeAttribute("gameplay")
			document.getElementById("container").setAttribute("gameover", true)

			for (var m in data.data.members) {
				createEndMember(data.data.members[m])
			}
		}

/*** creates ***/
	/* createNameFlag */
		function createNameFlag(name) {
			var firstOpenSlot = 0
			Array.from(document.querySelectorAll("#flags-background .flag-outer")).forEach(function(f) {
				if (f && f.getAttribute("slot") == firstOpenSlot) {
					firstOpenSlot++
				}
			})

			// flag
				var flagOuter = document.createElement("div")
					flagOuter.id = "flag-outer-" + name
					flagOuter.setAttribute("slot", firstOpenSlot)
					flagOuter.className = "flag-outer"
					flagOuter.style.backgroundColor = "var(--" + chooseRandom(Object.keys(colors)) + "-3)"
					if (firstOpenSlot % 4 < 2) {
						flagOuter.style.left = "calc((" + (firstOpenSlot % 4) + " * 12.5vw) + 2vw)"
					}
					else {
						flagOuter.style.left = "calc((" + (firstOpenSlot % 4) + " * 12.5vw) + 50vw)"
					}
					flagOuter.style.bottom = "calc((" + Math.floor(firstOpenSlot / 4) + " * 20vh) + 10vh)"
					
				document.getElementById("flags-background").appendChild(flagOuter)

			// name
				var text = document.createElement("div")
					text.className = "flag-text"
					text.innerText = name
				flagOuter.appendChild(text)

			// pole
				var pole = document.createElement("div")
					pole.className = "flag-pole"
				flagOuter.appendChild(pole)
		}

	/* createIssue */
		function createIssue(data, rules) {
			// container
				var issue = document.createElement("div")
					issue.className = "issue"
					issue.id = "issue-" + data.id
					issue.setAttribute("type", data.type)
				document.getElementById("issues").appendChild(issue)

			// text
				var timeout = document.createElement("div")
					timeout.className = "issue-timeout"
					timeout.innerText = Math.max(0, Math.round(data.timeout / 1000))
				issue.appendChild(timeout)

				var name = document.createElement("div")
					name.className = "issue-name"
					name.innerText = data.name
				issue.appendChild(name)				

			// options
				for (var o in data.options) {
					var subdata = data.options[o]

					// container
						var option = document.createElement("div")
							option.className = "option"
							option.id = "option-" + subdata.id
						issue.appendChild(option)

					// text
						var name = document.createElement("div")
							name.className = "option-name"
							name.innerText = subdata.name
						option.appendChild(name)

					// money
						if (subdata.treasury) {
							var treasury = document.createElement("div")
								treasury.className = "option-treasury"
								treasury.innerText = subdata.treasury > 0 ? "+" + subdata.treasury : subdata.treasury
							option.appendChild(treasury)
						}

						if (subdata.funds) {
							var funds = document.createElement("div")
								funds.className = "option-funds"
								funds.innerText = subdata.funds > 0 ? "+" + subdata.funds : subdata.funds
							option.appendChild(funds)
						}

					// agencies
						var agencies = document.createElement("div")
							agencies.className = "option-agencies"
						option.appendChild(agencies)

						for (var a in subdata.agencies) {
							var element = document.createElement("div")
								element.className = "option-agencies-" + a
								element.innerText = a
								element.setAttribute("direction", subdata.agencies[a] > 0 ? "up" : subdata.agencies[a] < 0 ? "down" : "none")
								element.setAttribute("accuracy", rules.includes("accurate-estimates") ? "high" : "low") // rule: accurate-estimates
							agencies.appendChild(element)

							var span = document.createElement("span")
								span.className = "option-agencies-number-" + a
								span.innerText = "(" + (subdata.agencies[a] > 0 ? "+" + subdata.agencies[a] : subdata.agencies[a]) + ")"
							element.appendChild(span)
						}

					// constituents
						var constituents = document.createElement("div")
							constituents.className = "option-constituents"
						option.appendChild(constituents)

						for (var c in subdata.constituents) {
							var element = document.createElement("div")
								element.className = "option-constituents-" + c
								element.innerText = c
								element.setAttribute("direction", subdata.constituents[c].approval > 0 ? "up" : subdata.constituents[c].approval < 0 ? "down" : "none")
								element.setAttribute("accuracy", rules.includes("accurate-polling") ? "high" : "low") // rule: accurate-polling
							constituents.appendChild(element)

							var span = document.createElement("span")
								span.className = "option-agencies-number-" + a
								span.innerText = "(" + (subdata.constituents[c].approval > 0 ? "+" + subdata.constituents[c].approval : subdata.constituents[c].approval) + ")"
							element.appendChild(span)
						}

				}
		}

	/* createGovernment */
		function createGovernment(data) {
			// flag
				var flag = document.createElement("canvas")
					flag.id = "nation-flag"
					flag.setAttribute("height", 1000)
					flag.setAttribute("width",  1500)
				createFlag(flag, data.state.flag)
				document.getElementById("container").appendChild(flag)

			// container
				var government = document.getElementById("government")

			// text
				var name = document.createElement("div")
					name.id = "government-name"
				government.appendChild(name)

			// election
				var election = document.createElement("div")
					election.id = "government-election"
				government.appendChild(election)

			// leader
				var leader = document.createElement("div")
					leader.id = "government-leader"
				government.appendChild(leader)

			// treasury
				var treasury = document.createElement("div")
					treasury.id = "government-treasury"
				government.appendChild(treasury)

			// agencies
				var agencies = document.createElement("div")
					agencies.id = "government-agencies"
				government.appendChild(agencies)

				for (var a in data.agencies) {
					var line = document.createElement("div")
						line.className = "government-agencies-line"
					agencies.appendChild(line)

					var label = document.createElement("div")
						label.className = "government-agencies-label"
						label.innerText = (a == "s") ? "Social Services" : (a == "r") ? "Regulation" : (a == "t") ? "Tech & Education" : "Military"
					line.appendChild(label)

					var dot = document.createElement("div")
						dot.id = "government-agencies-" + a
					line.appendChild(dot)

					var span = document.createElement("span")
						span.id = "government-agencies-numbers-" + a
					dot.appendChild(span)					
				}

			// constituents
				var line = document.createElement("div")
					line.id = "government-constituents-line"
				government.appendChild(line)

				var constituents = document.createElement("div")
					constituents.id = "government-constituents"
				government.appendChild(constituents)

				for (var c in data.constituents) {
					var element = document.createElement("div")
						element.id = "government-constituents-" + c
						element.innerText = (c == "d") ? "dwarves" : (c == "e") ? "elves" : (c == "f") ? "fairies" : (c == "g") ? "goblins" : "lizardfolk"
					constituents.appendChild(element)

					var span = document.createElement("span")
						span.id = "government-constituents-numbers-" + c
					element.appendChild(span)
				}

			// data
				updateGovernment(data)
		}

	/* createEndMember */
		function createEndMember(data) {
			// container
				var member = document.createElement("div")
					member.className = "end-member"
					member.id = "end-member-" + data.id
				document.getElementById("end").appendChild(member)

			// name	
				var name = document.createElement("div")
					name.className = "end-member-name"
					name.innerText = data.name
				if (data.state.achieved && data.state.reelected) { name.setAttribute("winner", true) }
				member.appendChild(name)

			// ideology
				var ideology = document.createElement("div")
					ideology.className = "end-member-ideology"
					ideology.innerText = data.ideology.name
				if (data.state.achieved) { ideology.setAttribute("achieved", true) }
				member.appendChild(ideology)
			
			// reelection
				var reelection = document.createElement("div")
					reelection.className = "end-member-reelection"
					reelection.innerText = "reelected"
				if (data.state.reelected) { reelection.setAttribute("reelected", true) }
				member.appendChild(reelection)
		}

/*** updates ***/
	/* updateNameFlag */
		function updateNameFlag(name) {
			if (name) {
				var flag = document.getElementById("flag-outer-" + name)
				if (flag) {
					flag.remove()
				}
			}
		}

	/* updateIssues */
		function updateIssues(data) {
			// get existing issues
				var ids = Array.from(document.querySelectorAll(".issue")).map(function (element) {
					return element.id
				}) || []

			// update issues
				for (var i in data.issues) {
					// existing issue
						var issue = document.getElementById("issue-" + data.issues[i].id) || false
						if (issue) {
							// remove from id queue
								ids.splice(ids.indexOf(data.issues[i].id), 1)

							// timeout down
								issue.querySelector(".issue-timeout").innerText = Math.max(0, Math.round(data.issues[i].timeout / 1000))

							// selected state
								if (data.issues[i].id == data.state.issue) {
									issue.setAttribute("selected", true)
								}
								else {
									issue.removeAttribute("selected")
								}
						}

					// new issue
						else {
							createIssue(data.issues[i], data.rules)
						}
				}

			// remove old issues
				for (var i in ids) {
					document.getElementById(ids[i]).remove()
				}

			// update last issue
				document.getElementById("results-name").innerText = data.last.name
				document.getElementById("results-options").innerHTML = ""
				for (var o in data.last.options) {
					// option
						var option = document.createElement("div")
							option.className = "results-option"
						document.getElementById("results-options").appendChild(option)

					// name
						var name = document.createElement("div")
							name.className = "results-option-name"
							name.innerText = data.last.options[o].name
						option.appendChild(name)

					// voters
						var voters = document.createElement("div")
							voters.className = "results-option-voters"
							var list = []
							for (var v in data.last.options[o].state.votes) {
								list.push(data.members[data.last.options[o].state.votes[v]].name)
							}
							voters.innerText = list.join(", ")
						option.appendChild(voters)
					
					// selected
						if (data.last.options[o].state.selected) {
							option.setAttribute("selected", true)
						}
				}
		}

	/* updateGovernment */
		function updateGovernment(data) {
			var government = document.getElementById("government") || false
			if (government) {
				// stats
					document.getElementById("government-name"    ).innerText = data.rules.includes("alternate-name") ? data.state.name[1] : data.state.name[0]
					document.getElementById("government-election").innerText = Math.round((data.state.election - data.state.time) / 1000)
					document.getElementById("government-leader"  ).innerText = "leader: " + (data.state.leader ? data.members[data.state.leader].name + (data.rules.includes("financial-disclosure") ? (" ($" + data.members[data.state.leader].funds + ")") : "") : "?")
					document.getElementById("government-treasury").innerText = data.treasury
					document.getElementById("government-treasury").setAttribute("direction", data.treasury > 0 ? "up" : data.treasury < 0 ? "down" : "none")

				// agencies
					for (var a in data.agencies) {
						var dot = document.getElementById("government-agencies-" + a)
							dot.style.left = data.agencies[a] + "%"

						var span = document.getElementById("government-agencies-numbers-" + a)
							span.innerText = data.agencies[a]
					}

				// population
					var population = 0
					for (var c in data.constituents) {
						population += data.constituents[c].population
					}

				// constituents
					for (var c in data.constituents) {
						var element = document.getElementById("government-constituents-" + c)
							element.style.height = (data.constituents[c].approval) + "%"
							element.style.width  = (data.constituents[c].population / population * 100) + "%"

						var span = document.getElementById("government-constituents-numbers-" + c)
							span.innerText = data.constituents[c].approval + "% x" + data.constituents[c].population
					}
			}
		}
