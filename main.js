
async function getData(path) {return await (await fetch("https://worldcupjson.net"+path)).json()}

Vue.component('flag', {
	props: {code:String, size:{type:String,default:"1"}},
	template: `	<img :class="'img'+size" class="flag" :src="'https://api.fifa.com/api/v3/picture/flags-sq-'+size+'/'+code">`
})
Vue.component('match', {
	props: ['match'],
	template: `
<div :id="match.id" class="group" @mouseover="$emit('starthover')" @mouseleave="$emit('endhover')">
	<span><b>{{(match.id==64) ? "Final" : ((match.id==63) ? "Third Place" : "Match " +match.id)}}</b><br>{{this.$root.time(match.datetime)}}</span>
	<br>
	<flag size=2 :src="match.home_team.country"></flag>
	<span class="home">{{name(match.home_team)}}</span><span class="away biggish">{{match.home_team.goals||"_"}}</span>
	<br><br>
	vs.
	<br><br>
	<flag size=2 :src="match.away_team.country"></flag>
	<span class="home">{{name(match.away_team)}}</span><span class="away biggish">{{match.away_team.goals||"_"}}</span>
</div>
`,
	methods: {
		name: function(team) {
			if (team.name == "To Be Determined") {
				if (team.country.startsWith("RU")) return "#" + team.country.slice(2) + " runner-up"
				else if (team.country.startsWith("W")) return "#" + team.country.slice(1) + " winner"
				else if (team.country.startsWith("1")) return team.country.slice(1) + " winner"
				else return team.country.slice(1) + " runner-up"
			} else {
				return team.name
			}
		}
	}
})



var app = new Vue({
	el: '#app',
	data: {
		matches: [],
		groups: [],
		current: undefined,
		details: false
	},
	mounted: function () {
		document.getElementById("loader").remove()
	},
	methods: {
		fullscreenCurrent: function () {
			let elem = document.getElementById("current")
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.webkitRequestFullscreen) { /* Safari */
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) { /* IE11 */
				elem.msRequestFullscreen();
			}
		},
		showdetails: function (id) {
			detailedMatch(id)
		},
		time: function (str) {
			let date = new Date(str);
			let now = new Date();
			if (date.getFullYear()==now.getFullYear() && date.getMonth()==now.getMonth() && date.getDate()==now.getDate()) {
				let half = (date.getHours() >= 12) ? "pm" : "am";
				var hours = date.getHours() % 12;
				if (hours == 0) {
					hours = "12"
				}
				if (date.getHours()>now.getHours()) {
					return hours + half;
				} else {
					return "now!";
				}
			} else {
				return (date.getMonth()+1)+"/"+date.getDate()
			}
		}
	}
})

window.onload = async () => {
	app.matches = (await getData("/matches"))
	let teamdata = (await getData("/teams")).groups

	for (var i=0;i<teamdata.length;i++) {
		let groupname = teamdata[i].letter.toLowerCase();
		let groupteams = teamdata[i].teams;
		let groupteamids = teamdata[i].teams.map(t=>t.country);
		let groupmatchids = [];

		groupmatchids = app.matches.filter(match=>{
			return groupteamids.includes(match.home_team_country) && match.stage_name == "First stage"
		}).map(m=>m.id-1).sort((a, b)=>{return a.id-b.id})

		app.groups.push({letter:groupname, teams:groupteams.sort((a,b)=>b.group_points-a.group_points||b.goal_differential-a.goal_differential), matches:groupmatchids})
	}

	app.current = app.matches.filter(m=>m.status=="in_progress")[0]
	if (app.current === undefined) {
		console.log(app.current)
		let temp = app.matches.filter(m=>m.status=="completed").sort((a,b)=>{return Date(a.datetime) - Date(b.datetime)})
		app.current = temp[temp.length-1]
	}
	poll();
}

async function poll() {
	let newdata = (await getData("/matches/current"))[0]
	if (newdata !== undefined) {
		app.matches[newdata.id-1] = newdata;
		app.current = newdata;
	}
	setTimeout(poll, 60*1000)//1min
}
async function detailedMatch(id) {
	// if (!app.matches[id-1].updated) {
	// 	app.matches[id-1] = (await getData("/matches/"+id))
	// 	app.matches[id-1].updated = true
	// }
	app.details = app.matches[id-1]
}
