
async function getData(path) {return await (await fetch("https://worldcupjson.net"+path)).json()}

Vue.component('flag', {
	props: {code:String, size:{type:String,default:"1"}},
	template: `<img :class="'img'+size" :src="'https://api.fifa.com/api/v3/picture/flags-sq-'+size+'/'+code">`
})
Vue.component('match', {
	props: ['match'],
	template: `
<div :id="match.id" class="group">
	<span>{{(match.id==64)?"Final":match.id}}</span>
	<br>
	<flag size=2 :src="match.home_team.country"></flag>
	<span class="home">{{match.home_team.name}}</span><span class="away">{{match.home_team.goals}}</span>
	<br><br>
	vs.
	<br><br>
	<flag size=2 :src="match.away_team.country"></flag>
	<span class="home">{{match.away_team.name}}</span><span class="away">{{match.away_team.goals}}</span>
</div>
`
})



var app = new Vue({
	el: '#app',
	data: {
		matches: [],
		groups: [],
		current: undefined
	},
	methods: {
		time: function (str) {
			let date = new Date(str);
			let half = (date.getHours() >= 12) ? "PM" : "AM";
			var hours = date.getHours() % 12;
			let mins = date.getMinutes();
			if (hours == 0) {
				hours = "12"
			}
			return hours + ":" + mins + " " + half;
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
		}).map(m=>m.id-1).map(m=>app.matches[m]).sort((a, b)=>{return a.id-b.id})

		app.groups.push({letter:groupname, teams:groupteams, matches:groupmatchids})
	}

	app.current = app.matches.filter(m=>m.status=="current")[0]
	if (app.current === undefined) {
		let temp = app.matches.filter(m=>m.status=="completed").sort((a,b)=>{return Date(a.datetime) - Date(b.datetime)})
		app.current = temp[temp.length-1]
	}
}
