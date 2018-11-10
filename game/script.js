/*** websocket ***/
	/* socket */
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

/*** submit ***/
	/* submitStart */
		try { document.getElementById("submit-start").addEventListener(on.click, submitStart) } catch (error) {}
		function submitStart(event) {
			if (event.target.id == "submit-start") {
				socket.send(JSON.stringify({
					action: "submitStart"
				}))
			}
		}

	/* submitRecall */
		try { document.getElementById("submit-recall").addEventListener(on.click, submitRecall) } catch (error) {}
		function submitRecall(event) {
			if (event.target.id == "submit-recall") {
				socket.send(JSON.stringify({
					action:    "submitRecall"
				}))
			}
		}

	/* submitCampaign */
		try { document.getElementById("submit-campaign").addEventListener(on.click, submitCampaign) } catch (error) {}
		function submitCampaign(event) {
			if (event.target.id == "submit-campaign") {
				socket.send(JSON.stringify({
					action:    "submitCampaign"
				}))
			}
		}

	/* submitTally */
		try { document.getElementById("submit-tally").addEventListener(on.click, submitTally) } catch (error) {}
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
							action:    "submitSelection",
							selection: event.target.id.split("-")[1]
						}))
					}
			}
		}

	/* submitOption */
		function submitOption(event) {
			if (event.target.className == "option") {
				// unselect
					if (event.target.getAttribute("selected")) {
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
						event.target.setAttribute("selected", true)

						socket.send(JSON.stringify({
							action:    "submitOption",
							selection: event.target.value.split("-")[1]
						}))
					}
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

			// leadership change
				if (data.members && window.member) {
					updateButtons(data)
				}

			// new data
				if (data && window.member) {
					document.getElementById("data").innerHTML = JSON.stringify(data, "\t", 2)

					updateIssues(data)
					updateMember(data.members[window.id], data.rules)
				}
				else if (data) {
					document.getElementById("data").innerHTML = JSON.stringify(data, "\t", 2)
					
					updateGovernment(data)
					updateIssues(data)
					for (var m in data.members) {
						updateMember(data.members[m], data.rules)
					}
				}
		}

	/* receiveStart */
		function receiveStart(data) {
			// observers
				if (!window.member) {
					document.getElementById("submit-start").setAttribute("hidden", true)					
					createGovernment(data)
					
					for (var m in data.members) {
						createMember(data.members[m])
					}
				}

			// members
				else {
					createMember(data.members[window.id])
				}
		}

/*** creates ***/
	/* createIssue */
		function createIssue(data, rules) {
			// container
				var issue = document.createElement("div")
					issue.className = "issue"
					issue.id = "issue-" + data.id
					issue.setAttribute("intensity", data.intensity)
					issue.addEventListener(on.click, submitIssue)
				document.getElementById("issues").appendChild(issue)

			// text
				var name = document.createElement("div")
					name.className = "issue-name"
					name.innerText = data.name
				issue.appendChild(name)

				var description = document.createElement("div")
					description.className = "issue-description"
					description.innerText = data.description
				issue.appendChild(description)

				var timeout = document.createElement("div")
					timeout.className = "issue-timeout"
					timeout.innerText = Math.round(data.timeout / 1000)
				issue.appendChild(timeout)

			// options
				for (var o in data.options) {
					var subdata = data.options[o]

					// container
						var option = document.createElement("div")
							option.className = "option"
							option.id = "option-" + subdata.id
							option.addEventListener(on.click, submitOption)
						issue.appendChild(option)

					// text
						var name = document.createElement("div")
							name.className = "option-name"
							name.innerText = subdata.name
						option.appendChild(name)

						var description = document.createElement("div")
							description.className = "option-description"
							description.innerText = subdata.description
						option.appendChild(description)

					// money
						var treasury = document.createElement("div")
							treasury.className = "option-treasury"
							treasury.innerText = subdata.treasury > 0 ? "+" + subdata.treasury : subdata.treasury
						option.appendChild(treasury)

						var funds = document.createElement("div")
							funds.className = "option-funds"
							funds.innerText = subdata.funds > 0 ? "+" + subdata.funds : subdata.funds
						option.appendChild(funds)

					// agencies
						var agencies = document.createElement("div")
							agencies.className = "option-agencies"
						option.appendChild(agencies)

						for (var a in subdata.agencies) {
							var element = document.createElement("div")
								element.className = "option-agencies-" + a
								element.innerText = subdata.agencies[a] > 0 ? "+" + subdata.agencies[a] : subdata.agencies[a]
								element.setAttribute("direction", subdata.agencies[a] > 0 ? "up" : subdata.agencies[a] < 0 ? "down" : "none")
								element.setAttribute("accuracy", rules.includes("accurate-estimates") ? "high" : "low") // rule: accurate-estimates
							agencies.appendChild(element)
						}

					// constituents
						var constituents = document.createElement("div")
							constituents.className = "option-constituents"
						option.appendChild(constituents)

						for (var c in subdata.constituents) {
							var element = document.createElement("div")
								element.className = "option-constituents-" + c
								element.innerText = subdata.constituents[c].approval > 0 ? "+" + subdata.constituents[c].approval : subdata.constituents[c].approval
								element.setAttribute("direction", subdata.constituents[c].approval > 0 ? "up" : subdata.constituents[c].approval < 0 ? "down" : "none")
								element.setAttribute("accuracy", rules.includes("accurate-polling") ? "high" : "low") // rule: accurate-polling
							constituents.appendChild(element)
						}

				}
		}

	/* createGovernment */
		function createGovernment(data) {
			// container
				var government = document.getElementById("government")

			// text
				var name = document.createElement("div")
					name.className = "government-name"
				government.appendChild(name)

			// election
				var election = document.createElement("div")
					election.className = "government-election"
				government.appendChild(election)

			// leader
				var leader = document.createElement("div")
					leader.className = "government-leader"
				government.appendChild(leader)

			// treasury
				var treasury = document.createElement("div")
					treasury.className = "government-treasury"
				government.appendChild(treasury)

			// agencies
				var agencies = document.createElement("div")
					agencies.className = "government-agencies"
				government.appendChild(agencies)

				for (var a in data.agencies) {
					var element = document.createElement("div")
						element.className = "government-agencies-" + a
					agencies.appendChild(element)
				}

			// constituents
				var constituents = document.createElement("div")
					constituents.className = "government-constituents"
				government.appendChild(constituents)

				for (var c in data.constituents) {
					var element = document.createElement("div")
						element.className = "government-constituents-" + c
					constituents.appendChild(element)
				}

			// data
				updateGovernment(data)
		}

	/* createMember */
		function createMember(data) {
			// container
				var member = document.createElement("div")
					member.className = "member"
					member.id = "member-" + data.id
				document.getElementById("members").appendChild(member)

			// text
				var name = document.createElement("div")
					name.className = "member-name"
					name.innerText = data.name
				member.appendChild(name)

				var race = document.createElement("div")
					race.classrace = "member-race"
					race.innerText = data.race
				member.appendChild(race)

			// ideology
				var ideology = document.createElement("div")
					ideology.className = "member-ideology"
				member.appendChild(ideology)

				var name = document.createElement("div")
					name.className = "member-ideology-name"
					name.innerText = data.ideology.name
				ideology.appendChild(name)

				var description = document.createElement("div")
					description.className = "member-ideology-description"
					description.innerText = data.ideology.description
				ideology.appendChild(description)

				for (var i in data.ideology) {
					var element = document.createElement("div")
						element.className = "member-ideology-" + i
						element.innerText = data.ideology[i][0] + " - " + data.ideology[i][1]
					ideology.appendChild(element)
				}

			// funds
				var funds = document.createElement("div")
					funds.className = "member-funds"
				member.appendChild(funds)

			// constituents
				var constituents = document.createElement("div")
					constituents.className = "member-constituents"
				member.appendChild(constituents)

				for (var c in data.constituents) {
					var element = document.createElement("div")
						element.className = "member-constituents-" + c
					contituents.appendChild(element)
				}

			// data
				updateMember(data)
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
						var issue = document.getElementById("issue-" + data.issues[i].id)
						if (issue) {
							// remove from id queue
								ids.splice(ids.indexOf(data.issues[i].id), 1)

							// timeout down
								issue.querySelector(".issue-timeout").innerText = Math.round(data.issues[i].timeout / 1000)

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
				for (var i in ids.length) {
					document.getElementById("issue-" + ids[i]).remove()
				}
		}

	/* updateGovernment */
		function updateGovernment(data) {
			var government = document.getElementById("government") || false
			if (government) {
				// stats
					government.querySelector(".government-name"    ).innerText = data.state.name
					government.querySelector(".government-election").innerText = Math.round((data.state.election - data.state.time) / 1000)
					government.querySelector(".government-leader"  ).innerText = data.state.leader ? data.state.leader.name : "?"
					government.querySelector(".government-treasury").innerText = data.treasury
					government.querySelector(".government-treasury").setAttribute("direction", data.treasury > 0 ? "up" : data.treasury < 0 ? "down" : "none")

				// agencies
					government.querySelector(".government-agencies-s").innerText = data.agencies.s
					government.querySelector(".government-agencies-r").innerText = data.agencies.r
					government.querySelector(".government-agencies-t").innerText = data.agencies.t
					government.querySelector(".government-agencies-m").innerText = data.agencies.m

				// contituents
					government.querySelector(".government-constituents-d").innerText = data.constituents.d.approval + "% x" + data.constituents.d.population
					government.querySelector(".government-constituents-e").innerText = data.constituents.e.approval + "% x" + data.constituents.e.population
					government.querySelector(".government-constituents-f").innerText = data.constituents.f.approval + "% x" + data.constituents.f.population
					government.querySelector(".government-constituents-g").innerText = data.constituents.g.approval + "% x" + data.constituents.g.population
					government.querySelector(".government-constituents-l").innerText = data.constituents.l.approval + "% x" + data.constituents.l.population
			}
		}

	/* updateMember */
		function updateMember(data, rules) {
			var member = document.getElementById("member-" + data.id)
			if (member) {
				// funds
					member.querySelector(".member-funds").innerText = data.funds
					if (window.id == data.id || rules.includes("financial-disclosure")) {
						member.querySelector(".member-funds").removeAttribute("hidden")
					}
					else {
						member.querySelector(".member-funds").setAttribute("hidden", true)
					}

				// contituents
					if (window.id == data.id) {
						member.querySelector(".member-constituents-d").innerText = data.constituents.d.approval + "% x" + data.constituents.d.population
						member.querySelector(".member-constituents-e").innerText = data.constituents.e.approval + "% x" + data.constituents.e.population
						member.querySelector(".member-constituents-f").innerText = data.constituents.f.approval + "% x" + data.constituents.f.population
						member.querySelector(".member-constituents-g").innerText = data.constituents.g.approval + "% x" + data.constituents.g.population
						member.querySelector(".member-constituents-l").innerText = data.constituents.l.approval + "% x" + data.constituents.l.population
					}

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
		}

	/* updateButtons */
		function updateButtons(data) {
			if (window.leader && data.members[window.id] && !data.members[window.id].state.leader) {
				window.leader = false
				document.getElementById("submit-recall").removeAttribute("hidden")
				document.getElementById("submit-tally" ).setAttribute(   "hidden", true)
			}
			else if (!window.leader && data.members[window.id] && data.members[window.id].state.leader) {
				window.leader = true
				document.getElementById("submit-tally" ).removeAttribute("hidden")
				document.getElementById("submit-recall").setAttribute(   "hidden", true)
			}
		}
