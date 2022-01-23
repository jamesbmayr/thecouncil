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

/*** select ***/
	/* selectCouncil */
		document.getElementById("select-council").addEventListener(on.click, selectCouncil)
		function selectCouncil(event) {
			document.getElementById("select-council").setAttribute("selected", true)
			document.getElementById("select-district").removeAttribute("selected")

			document.getElementById("issues").removeAttribute("hidden")
			document.getElementById("member").setAttribute("hidden", true)
		}

	/* selectDistrict */
		document.getElementById("select-district").addEventListener(on.click, selectDistrict)
		function selectDistrict(event) {
			document.getElementById("select-district").setAttribute("selected", true)
			document.getElementById("select-council").removeAttribute("selected")

			document.getElementById("member").removeAttribute("hidden")
			document.getElementById("issues").setAttribute("hidden", true)
		}

/*** submit ***/
	/* submitRecall */
		document.getElementById("submit-recall").addEventListener(on.click, submitRecall)
		function submitRecall(event) {
			if (event.target.id == "submit-recall") {
				socket.send(JSON.stringify({
					action:    "submitRecall"
				}))
			}
		}

	/* submitCampaign */
		document.getElementById("submit-campaign").addEventListener(on.click, submitCampaign)
		function submitCampaign(event) {
			if (event.target.id == "submit-campaign") {
				socket.send(JSON.stringify({
					action:    "submitCampaign"
				}))
			}
		}

	/* submitTally */
		document.getElementById("submit-tally").addEventListener(on.click, submitTally)
		function submitTally(event) {
			if (event.target.id == "submit-tally") {
				socket.send(JSON.stringify({
					action:    "submitTally"
				}))
			}
		}

	/* submitIssue */
		function submitIssue(event) {
			if (event.target.className == "issue") {
				// unselect
					if (event.target.getAttribute("selected")) {
						socket.send(JSON.stringify({
							action:    "submitIssue",
							selection: null
						}))
					}

				// select
					else {
						socket.send(JSON.stringify({
							action:    "submitIssue",
							selection: event.target.id.split("-")[1]
						}))
					}
			}
		}

	/* submitOption */
		function submitOption(event) {
			if (event.target.className == "option-circle") {
				// unselect
					if (event.target.parentNode.getAttribute("selected")) {
						document.querySelectorAll(".option[selected]").forEach(function(element) {
							element.removeAttribute("selected")
						})

						socket.send(JSON.stringify({
							action:    "submitOption",
							selection: null
						}))
					}

				// select
					else {
						document.querySelectorAll(".option[selected]").forEach(function(element) {
							element.removeAttribute("selected")
						})
						event.target.parentNode.setAttribute("selected", true)

						socket.send(JSON.stringify({
							action:    "submitOption",
							selection: event.target.parentNode.id.split("-")[1]
						}))
					}

				return false
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

			// starting
				if (data.start) {
					receiveStart(data)
				}
				if (data.show) {
					for (var s in data.show) {
						document.getElementById(data.show[s]).className = ""
					}
				}

			// recall / leader / campaign
				if (data.showRecall !== undefined || data.showTally !== undefined || data.showCampaign !== undefined) {
					updateButtons(data)
				}
				if (data.recall) {
					selectCouncil()
				}

			// new data
				if (data.data) {
					updateIssues(data.data)
					updateMember(data.data, data.data.members[window.id], data.data.rules)
				}

			// end
				if (data.end) {
					receiveEnd(data)
				}
		}

	/* receiveStart */
		function receiveStart(data) {
			document.getElementById("container").setAttribute("gameplay", true)
			
			createMember(data.data, data.data.members[window.id], data.data.rules)
			createFlag(document.querySelector("#select-council canvas" ), data.data.state.flag)
			createFlag(document.querySelector("#select-district canvas"), data.data.members[window.id].state.flag)

			updateButtons(data)

			if (data.data.state.time < 60000) {
				["action-bar", "member", "member-info", "member-name", "member-district", "member-race", "member-ideology", "member-constituents-line", "member-constituents", "member-constituents-d", "member-constituents-e", "member-constituents-f", "member-constituents-g", "member-constituents-l", "member-funds", "mode-bar"].forEach(function(id) {
					document.getElementById(id).className = "hidden"
				})
			}
		}

	/* receiveEnd */
		function receiveEnd(data) {
			document.getElementById("container").removeAttribute("gameplay")
			document.getElementById("container").setAttribute("gameover", true)

			document.getElementById("select-district").setAttribute("selected", true)
			document.getElementById("select-council").removeAttribute("selected")

			document.getElementById("member").removeAttribute("hidden")
			document.getElementById("issues").setAttribute("hidden", true)

			var memberData = data.data.members[window.id]

			// ideology
				if (memberData.state.achieved) {
					document.getElementById("member-ideology-name").setAttribute("achieved", true)
				}
				else {
					document.getElementById("member-ideology-name").setAttribute("unachieved", true)	
				}
			
			// reelection
				if (memberData.state.reelected) {
					document.getElementById("member-constituents").setAttribute("reelected", true)
				}
				else {
					document.getElementById("member-constituents").setAttribute("unreelected", true)	
				}
		}

/*** creates ***/
	/* createIssue */
		function createIssue(data, rules) {
			// container
				var issue = document.createElement("div")
					issue.className = "issue"
					issue.id = "issue-" + data.id
					issue.setAttribute("type", data.type)
					issue.addEventListener(on.click, submitIssue)
				document.getElementById("issues").appendChild(issue)

			// text
				var timeout = document.createElement("div")
					timeout.className = "issue-timeout"
					timeout.innerText = getMinSec(data.timeout)
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

					// circle
						var circle = document.createElement("div")
							circle.className = "option-circle"
							circle.addEventListener(on.click, submitOption)
						option.appendChild(circle)

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

	/* createMember */
		function createMember(government, data, rules) {
			// container
				var member = document.getElementById("member")

			// info
				var info = document.createElement("div")
					info.id = "member-info"
				member.appendChild(info)
				
				var name = document.createElement("div")
					name.id = "member-name"
					name.innerText = data.name
				info.appendChild(name)

				var district = document.createElement("div")
					district.id = "member-district"
					district.innerText = "District " + data.district
				info.appendChild(district)

				var race = document.createElement("div")
					race.id = "member-race"
					race.innerText = data.race.singular
					race.style.color = "var(--race-" + data.race.short + ")"
				info.appendChild(race)

			// funds
				var funds = document.createElement("div")
					funds.id = "member-funds"
				member.appendChild(funds)

			// constituents
				var line = document.createElement("div")
					line.id = "member-constituents-line"
				member.appendChild(line)

				var constituents = document.createElement("div")
					constituents.id = "member-constituents"
				member.appendChild(constituents)

				for (var c in data.constituents) {
					var element = document.createElement("div")
						element.id = "member-constituents-" + c
						element.innerText = c
					constituents.appendChild(element)

					var span = document.createElement("span")
						span.id = "member-constituents-numbers-" + c
					element.appendChild(span)
				}

			// ideology
				var ideology = document.createElement("div")
					ideology.id = "member-ideology"
				member.appendChild(ideology)

				var name = document.createElement("div")
					name.id = "member-ideology-name"
					name.innerText = data.ideology.name
				ideology.appendChild(name)

				var description = document.createElement("div")
					description.id = "member-ideology-description"
					description.innerText = data.ideology.description
				ideology.appendChild(description)
				if (data.ideology.other) {
					description.innerText += " [" + data.ideology.other + "]"
				}

				for (var i in data.ideology) {
					if (["r", "s", "t", "m"].includes(i)) {
						var line = document.createElement("div")
							line.className = "member-ideology-line"
						ideology.appendChild(line)

						var dot = document.createElement("div")
							dot.id = "member-ideology-dot-" + i
						line.appendChild(dot)

						var element = document.createElement("div")
							element.id = "member-ideology-" + i
							element.innerText = i + ": " + data.ideology[i][0] + "-" + data.ideology[i][1]
							element.style.width = (data.ideology[i][1] - data.ideology[i][0]) + "%"
							element.style["margin-left"] = data.ideology[i][0] + "%"
						ideology.appendChild(element)
					}
				}

			// data
				updateMember(government, data, rules)
		}

/*** updates ***/
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
								issue.querySelector(".issue-timeout").innerText = getMinSec(data.issues[i].timeout)

							// selected state
								if (data.issues[i].id == data.state.issue) {
									issue.setAttribute("selected", true)
								}
								else {
									issue.removeAttribute("selected")
									issue.querySelectorAll(".option").forEach(function(o) {
										o.removeAttribute("selected")
									})
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
		}

	/* updateMember */
		function updateMember(government, data, rules) {
			var member = document.getElementById("member")

			// campaigning ?
				if (data.state.campaign) {
					document.getElementById("submit-campaign").setAttribute("campaigning", true)
				}
				else {
					document.getElementById("submit-campaign").removeAttribute("campaigning")
				}

			// recalling ?
				if (!government.state.leader) {
					document.getElementById("submit-recall").setAttribute("recalling", true)
				}
				else {
					document.getElementById("submit-recall").removeAttribute("recalling")
				}

			// funds
				document.getElementById("member-funds").innerText = data.funds

			// population
				var population = 0
				for (var c in data.constituents) {
					population += data.constituents[c].population
				}

			// constituents
				for (var c in data.constituents) {
					var element = document.getElementById("member-constituents-" + c)
						element.style.height = (data.constituents[c].approval) + "%"
						element.style.width  = (data.constituents[c].population / population * 100) + "%"

					var span = document.getElementById("member-constituents-numbers-" + c)
						span.innerText = data.constituents[c].approval + "% x" + data.constituents[c].population
				}

			// ideologies
				var arr = ["r", "s", "t", "m"]
				arr.forEach(function(a) {
					document.getElementById("member-ideology-dot-" + a).style.left = government.agencies[a] + "%"
				})

			// leader
				if (data.state.leader) {
					member.setAttribute("leader", true)
				}
				else {
					member.removeAttribute("leader")
				}

			// campaign
				if (data.state.campaign) {
					member.setAttribute("campaign", true)
				}
				else {
					member.removeAttribute("campaign")
				}
		}

	/* updateButtons */
		function updateButtons(data) {
			// elements
				var actionBar = document.getElementById("action-bar")

			// recall
				if (data.showRecall == true) {
					actionBar.setAttribute("showRecall", true)
				}
				else if (data.showRecall == false) {
					actionBar.removeAttribute("showRecall")
				}

			// tally
				if (data.showTally == true) {
					actionBar.setAttribute("showTally", true)
				}
				else if (data.showTally == false) {
					actionBar.removeAttribute("showTally")
				}

			// campaign
				if (data.showCampaign == true) {
					actionBar.setAttribute("showCampaign", true)
				}
				else if (data.showCampaign == false) {
					actionBar.removeAttribute("showCampaign")
				}
		}
