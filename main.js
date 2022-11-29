const locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
// const locale = "en-GB"
var mouseX;

async function getData(path) {return await (await fetch("https://worldcupjson.net"+path)).json()}

Vue.component('flag', {
	props: {code:String, size:{type:String,default:"1"}},
	template: `	<img v-if="!(/\d/g).test(code)" :class="'img'+size" class="flag" :src="'https://api.fifa.com/api/v3/picture/flags-sq-'+size+'/'+code" :alt="code">`
})
Vue.component('match', {
	props: ['match'],
	template: `
<div :id="match.id"
	class="group"
	@mouseover="$root.showdetails(match.id)"
	@click="$root.showdetails(match.id, true)"
	@focus="$root.showdetails(match.id, true)"
	tabindex=0
	:class="{future:match.status.startsWith('future'),current:match.id==$root.current.id}"
	@mouseleave="$root.closedetails()">
	<span><b>{{(match.id==64) ? "Final" : ((match.id==63) ? "Third Place" : "Match " +match.id)}}</b><br>{{this.$root.time(match.datetime, false, true)}}</span>
	<br>
	<flag size=2 :src="match.home_team.country"></flag>
	<span class="home">{{name(match.home_team)}}</span><span class="away biggish">{{match.home_team.goals||" "}}</span>
	<br><br>
	vs.
	<br><br>
	<flag size=2 :src="match.away_team.country"></flag>
	<span class="home">{{name(match.away_team)}}</span><span class="away biggish">{{match.away_team.goals||" "}}</span>
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
		details: false,
		clicking: false,
		ismoved: false,
		currentcount: 0,
		currentgamenames: []
	},
	mounted: function () {
		setTimeout(_=>document.documentElement.classList.add("loaded"), 1000)
	},
	methods: {
		poll: poll,
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
		events: function(match) {
			var e = [];
			for (eindex in match.home_team_events) {
				let edata = match.home_team_events[eindex];
				edata.class = "left";
				if (edata.extra_info) edata.off = JSON.parse(edata.extra_info).player_off
				e.push(edata)
			}
			for (eindex in match.away_team_events) {
				let edata = match.away_team_events[eindex];
				edata.class = "right";
				if (edata.extra_info) edata.off = JSON.parse(edata.extra_info).player_off
				e.push(edata)
			}
			e.sort((a,b)=>a.id-b.id)
			return e
		},
		showdetails: function (id, click) {
			if (!this.clicking || click) {
				this.ismoved = (mouseX / window.innerWidth > 0.5)
				detailedMatch(id)
			}
			if (click && !this.clicking) {this.clicking=true}
		},
		closedetails: function () {
			if (!this.clicking) {
				this.details = false;
			}
		},
		time: function (str, l,ish) {
			let date = new Date(str);
			if (l) {
				return Intl.DateTimeFormat(locale, {dateStyle:"long", timeStyle:"short"}).format(date) + " your time";
			}

			let now = new Date();
			let diff = (date-now) / (1000 * 60 * 60 * 24);
			if (diff > 0 && diff < 1) {
				return Intl.DateTimeFormat(locale, {hour:"numeric"}).format(date).replaceAll(" ","").toLowerCase() + (date.getDate()==now.getDate()? "  " : "+1");
			} else {
				return Intl.DateTimeFormat(locale, {month:ish?'long':'narrow',day:'2-digit'}).format(date).replaceAll(" ",ish?" ":"");
			}
		}
	}
})

window.onkeydown = (e) => {if (e.key === "Escape") {app.clicking = false;app.details = false;document.body.focus()}}
document.body.onclick = (e) => {if (e.target.closest(".gmatch, #bracket .group")==null){app.details=false}}
document.body.onmousemove = (e) => {mouseX = e.clientX}

window.onload = async () => {
	app.matches = (await getData("/matches"))
	let teamdata = (await getData("/teams")).groups

	for (var i=0;i<teamdata.length;i++) {
		let groupname = teamdata[i].letter.toLowerCase();
		let groupteams = teamdata[i].teams;
		let groupteamids = teamdata[i].teams.map(t=>t.country);
		let groupmatchids = [];

		let maxpoints = teamdata[i].teams.map(t=>t.group_points).sort((a,b)=>b-a)[1]

		groupmatchids = app.matches.filter(match=>{
			return groupteamids.includes(match.home_team_country) && match.stage_name == "First stage"
		}).map(m=>m.id-1).sort((a, b)=>{return a.id-b.id})

		for (teamindex in groupteams) {
			let t = groupteams[teamindex]
			groupteams[teamindex].eliminated = t.group_points + ((3-t.games_played)*3) < maxpoints
			console.log(groupteams[teamindex].eliminated)
		}

		app.groups.push({letter:groupname, teams:groupteams.sort((a,b)=>b.group_points-a.group_points||b.goal_differential-a.goal_differential), matches:groupmatchids})
	}

	app.current = app.matches.filter(m=>m.status=="in_progress")[0]
	if (app.current === undefined) {
		console.log(app.current)
		let temp = app.matches.filter(m=>m.status=="completed").sort((a,b)=>{return Date(a.datetime) - Date(b.datetime)})
		app.current = temp[temp.length-1]
	}
	poll();
	setInterval(poll, 57*1000)// every 57 seconds
}
window.onfocus = () => {document.title = "2022 FIFA World Cup Bracket"}
window.onblur = () => {
	document.title = app.current.home_team.country
		+ " "
		+ app.current.home_team.goals
		+ "-"
		+ app.current.away_team.goals
		+ " "
		+ app.current.away_team.country
		+ " "
		+ (app.current.time||'FINAL')
}

async function poll() {
	let currentgames = (await getData("/matches/current"))
	app.currentgamenames = currentgames.map(g=>g.home_team.name + " v. " + g.away_team.name);
	let newdata = currentgames[app.currentcount|0]
	if (newdata !== undefined) {
		app.matches[newdata.id-1] = newdata;
		app.current = newdata;
	}
}
var updated = {};
async function detailedMatch(id) {
	if (!(id in updated)) {
		updated[id] = (await getData("/matches/"+id))
	}
	app.details = updated[id]
}
