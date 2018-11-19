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
		try { document.getElementById("select-council").addEventListener(on.click, selectCouncil) } catch (error) {}
		function selectCouncil(event) {
			document.getElementById("select-council").setAttribute("selected", true)
			document.getElementById("select-district").removeAttribute("selected")

			document.getElementById("issues").removeAttribute("hidden")
			document.getElementById("members").setAttribute("hidden", true)
		}

	/* selectDistrict */
		try { document.getElementById("select-district").addEventListener(on.click, selectDistrict) } catch (error) {}
		function selectDistrict(event) {
			document.getElementById("select-district").setAttribute("selected", true)
			document.getElementById("select-council").removeAttribute("selected")

			document.getElementById("members").removeAttribute("hidden")
			document.getElementById("issues").setAttribute("hidden", true)
		}

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
						console.log("unselecting")
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
						console.log("selecting")
						document.querySelectorAll(".option[selected]").forEach(function(element) {
							element.removeAttribute("selected")
						})
						event.target.setAttribute("selected", true)

						socket.send(JSON.stringify({
							action:    "submitOption",
							selection: event.target.id.split("-")[1]
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
					receiveStart(data.data)
				}

			// leadership change
				if (data.data && data.data.members && window.member) {
					updateButtons(data.data)
				}

			// new data
				if (data.data && window.member) {
					updateIssues(data.data)
					updateMember(data.data, data.data.members[window.id], data.data.rules)
				}
				else if (data.data) {
					document.getElementById("data").innerHTML = JSON.stringify(data.data, "\t", 2)
					
					updateGovernment(data.data)
					updateIssues(data.data)
					for (var m in data.data.members) {
						updateMember(data.data, data.data.members[m], data.data.rules)
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
						createMember(data, data.members[m], data.rules)
					}
				}

			// members
				else {
					createMember(data, data.members[window.id], data.rules)
					createFlag(document.querySelector("#select-council canvas" ), data.state.flag)
					createFlag(document.querySelector("#select-district canvas"), data.members[window.id].state.flag)
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
					timeout.innerText = Math.round(data.timeout / 1000)
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
							option.addEventListener(on.click, submitOption)
						issue.appendChild(option)

					// text
						var name = document.createElement("div")
							name.className = "option-name"
							name.innerText = subdata.name
						option.appendChild(name)

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
						element.innerText = c
					constituents.appendChild(element)

					var span = document.createElement("div")
						span.className = "government-constituents-numbers-" + c
					element.appendChild(span)
				}

			// data
				updateGovernment(data)
		}

	/* createMember */
		function createMember(government, data, rules) {
			// container
				var member = document.createElement("div")
					member.className = "member"
					member.id = "member-" + data.id
				document.getElementById("members").appendChild(member)

			// info
				var info = document.createElement("div")
					info.className = "member-info"
				member.appendChild(info)
				
				var name = document.createElement("div")
					name.className = "member-name"
					name.innerText = data.name
				info.appendChild(name)

				var district = document.createElement("div")
					district.className = "member-district"
					district.innerText = "District " + data.district
				info.appendChild(district)

				var race = document.createElement("div")
					race.className = "member-race"
					race.innerText = data.race.singular
					race.style.color = "var(--race-" + data.race.short + ")"
				info.appendChild(race)

			// funds
				var funds = document.createElement("div")
					funds.className = "member-funds"
				member.appendChild(funds)

			// constituents
				var line = document.createElement("div")
					line.className = "member-constituents-line"
				member.appendChild(line)

				var constituents = document.createElement("div")
					constituents.className = "member-constituents"
				if (!window.id || window.id !== data.id) {
					constituents.setAttribute("hidden", true)
				}
				member.appendChild(constituents)

				for (var c in data.constituents) {
					var element = document.createElement("div")
						element.className = "member-constituents-" + c
						element.innerText = c
					constituents.appendChild(element)

					var span = document.createElement("span")
						span.className = "member-constituents-numbers-" + c
					element.appendChild(span)
				}

			// ideology
				var ideology = document.createElement("div")
					ideology.className = "member-ideology"
				if (!window.id || window.id !== data.id) {
					ideology.setAttribute("hidden", true)
				}
				member.appendChild(ideology)

				var name = document.createElement("div")
					name.className = "member-ideology-name"
					name.innerText = data.ideology.name
				ideology.appendChild(name)

				var description = document.createElement("div")
					description.className = "member-ideology-description"
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
							dot.className = "member-ideology-dot-" + i
						line.appendChild(dot)

						var element = document.createElement("div")
							element.className = "member-ideology-" + i
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
			try {
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
				for (var i in ids) {
					document.getElementById(ids[i]).remove()
				}
			} catch (error) {console.log(error)}
		}

	/* updateGovernment */
		function updateGovernment(data) {
			var government = document.getElementById("government") || false
			if (government) {
				// stats
					government.querySelector(".government-name"    ).innerText = data.state.name
					government.querySelector(".government-election").innerText = Math.round((data.state.election - data.state.time) / 1000)
					government.querySelector(".government-leader"  ).innerText = data.state.leader ? data.members[data.state.leader].name : "?"
					government.querySelector(".government-treasury").innerText = data.treasury
					government.querySelector(".government-treasury").setAttribute("direction", data.treasury > 0 ? "up" : data.treasury < 0 ? "down" : "none")

				// agencies
					government.querySelector(".government-agencies-s").innerText = data.agencies.s
					government.querySelector(".government-agencies-r").innerText = data.agencies.r
					government.querySelector(".government-agencies-t").innerText = data.agencies.t
					government.querySelector(".government-agencies-m").innerText = data.agencies.m

				// population
					var population = 0
					for (var c in data.constituents) {
						population += data.constituents[c].population
					}

				// constituents
					for (var c in data.constituents) {
						var element = government.querySelector(".government-constituents-" + c)
							element.style.height = (data.constituents[c].approval) + "%"
							element.style.width  = (data.constituents[c].population / population * 100) + "%"

						var span = government.querySelector(".government-constituents-numbers-" + c)
							span.innerText = data.constituents[c].approval + "% x" + data.constituents[c].population
					}
			}
		}

	/* updateMember */
		function updateMember(government, data, rules) {
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

				// population
					var population = 0
					for (var c in data.constituents) {
						population += data.constituents[c].population
					}

				// constituents
					for (var c in data.constituents) {
						var element = member.querySelector(".member-constituents-" + c)
							element.style.height = (data.constituents[c].approval) + "%"
							element.style.width  = (data.constituents[c].population / population * 100) + "%"

						var span = member.querySelector(".member-constituents-numbers-" + c)
							span.innerText = data.constituents[c].approval + "% x" + data.constituents[c].population
					}

				// ideologies
					["r", "s", "t", "m"].forEach(function(a) {
						document.querySelectorAll(".member-ideology-dot-" + a).forEach(function (dot) {
							dot.style.left = government.agencies[a] + "%"
						})
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
