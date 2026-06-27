<template>
    <canvas></canvas>
    <div id="page">
        <div id="banner">Argentina Wins!</div>
        <div id="top">
            <header>
                <h1>2022 FIFA World Cup bracket and standings</h1>
                <span
                    >A simple website designed to help you track 2022's FIFA
                    World Cup bracket and standings. Data is from
                    <a href="https://worldcupjson.net/">worldcupjson.net</a> and
                    the flags are from FIFA, thanks! Click on a match to show a
                    play-by-play view, and view live score updates! The current
                    (or most recent) game appears at the top of your screen.
                    Once the group games are done, scroll down to see an entire
                    tournament bracket also updated in real time.
                    <b
                        >If you have any suggestions, be sure to post them
                        <a href="https://news.ycombinator.com/item?id=33737258"
                            >here</a
                        >, and I'll add them ASAP!</b
                    >
                    <a
                        href="https://www.amnesty.org/en/latest/campaigns/2016/03/qatar-world-cup-of-shame/"
                        >Learn about stadium worker solidarity.</a
                    ><br /><br />
                    (c) <a href="https://cole.ws">cole wilson 2022</a></span
                >
                <a href="//buymeacoffee.com/colewilson" class="coffee"
                    >⚽ support my work!</a
                >
            </header>
            <div
                @dblclick="fullscreenCurrent"
                id="current"
                v-if="current !== undefined"
            >
                <span id="closemessage">press [esc] to exit fullscreen</span>
                <span id="openmessage" class="loss"
                    >double-click to open fullscreen</span
                >
                <br /><br />
                <span class="home center">
                    <FlagIcon
                        size="3"
                        :code="current.home_team.country"
                    /><br />
                    {{ current.home_team.name }}<br />
                    <b
                        v-if="
                            current.home_team.penalties ||
                            current.away_team.penalties
                        "
                        >({{ current.home_team.penalties }})</b
                    >
                </span>
                <span class="score">
                    <span class="big"
                        >{{ current.home_team.goals }}-{{
                            current.away_team.goals
                        }}<br /></span
                    ><br />
                    <b v-if="current.time">{{
                        current.time
                            .replaceAll("full-time", "FT")
                            .replaceAll("90'", "FT")
                    }}</b>
                    <b v-if="!current.time" class="red">FINAL</b>
                </span>
                <span class="away center">
                    <FlagIcon
                        size="3"
                        :code="current.away_team.country"
                    /><br />
                    {{ current.away_team.name }}<br />
                    <b
                        v-if="
                            current.home_team.penalties ||
                            current.away_team.penalties
                        "
                        >({{ current.away_team.penalties }})</b
                    >
                </span>
                <br /><i class="loss">updates every minute</i>
                <label class="bold" v-if="currentgamenames.length > 1"
                    ><br /><br />showing match {{ currentcount + 1 }}/{{
                        currentgamenames.length
                    }}:
                    <select @input="poll()" v-model="currentcount">
                        <option
                            v-for="(name, n) in currentgamenames"
                            :key="name"
                            :value="n"
                        >
                            {{ name }}
                        </option>
                    </select></label
                >
            </div>
            <hr />
        </div>
        <details :open="current && current.id > 48">
            <summary><h2>Tournament Bracket</h2></summary>
            <div id="bracket" v-if="matches.length > 0">
                <br /><br /><br />
                <div class="col left">
                    <MatchCard
                        :match="matches[49 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                    <MatchCard
                        :match="matches[50 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                    <MatchCard
                        :match="matches[53 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                    <MatchCard
                        :match="matches[54 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                </div>
                <div class="col left">
                    <MatchCard
                        :match="matches[58 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                    <MatchCard
                        :match="matches[57 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                </div>
                <div class="col left">
                    <MatchCard
                        :match="matches[61 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                </div>
                <div class="col middle">
                    <div class="group transparent">
                        <b>Argentina Wins!</b>
                    </div>
                    <MatchCard
                        :match="matches[64 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                    <MatchCard
                        :match="matches[63 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                </div>
                <div class="col right">
                    <MatchCard
                        :match="matches[62 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                </div>
                <div class="col right">
                    <MatchCard
                        :match="matches[60 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                    <MatchCard
                        :match="matches[59 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                </div>
                <div class="col right">
                    <MatchCard
                        :match="matches[51 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                    <MatchCard
                        :match="matches[52 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                    <MatchCard
                        :match="matches[55 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                    <MatchCard
                        :match="matches[56 - 1]"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                </div>
            </div>
        </details>
        <hr />
        <div>
            <details :open="current && current.id < 49">
                <summary><h2>Group Round</h2></summary>
                <div id="groups">
                    <div
                        v-for="group in groups"
                        :key="group.letter"
                        class="group"
                    >
                        <h3>Group {{ group.letter.toUpperCase() }}</h3>
                        <b v-if="group.complete" class="red">FINAL<br /></b>
                        <table tabindex="0" title="click to show more details">
                            <tbody>
                                <tr>
                                    <td
                                        :class="{
                                            loss:
                                                team.eliminated ||
                                                (group.complete && i > 1),
                                        }"
                                        v-for="(team, i) in group.teams"
                                        :key="`flag-${team.country}`"
                                    >
                                        <FlagIcon :code="team.country" />
                                    </td>
                                </tr>
                                <tr data-bold>
                                    <td
                                        v-for="team in group.teams"
                                        :key="`country-${team.country}`"
                                    >
                                        {{ team.country }}
                                    </td>
                                </tr>
                                <tr data-key="PTS">
                                    <td
                                        v-for="team in group.teams"
                                        :key="`points-${team.country}`"
                                    >
                                        {{ team.group_points }}
                                    </td>
                                </tr>
                                <tr data-key="GD" class="hidden">
                                    <td
                                        v-for="team in group.teams"
                                        :key="`gd-${team.country}`"
                                    >
                                        {{ team.goal_differential }}
                                    </td>
                                </tr>
                                <tr data-key="MP" class="hidden">
                                    <td
                                        v-for="team in group.teams"
                                        :key="`mp-${team.country}`"
                                    >
                                        {{ team.games_played }}
                                    </td>
                                </tr>
                                <tr data-key="W" class="hidden">
                                    <td
                                        v-for="team in group.teams"
                                        :key="`wins-${team.country}`"
                                    >
                                        {{ team.wins }}
                                    </td>
                                </tr>
                                <tr data-key="D" class="hidden">
                                    <td
                                        v-for="team in group.teams"
                                        :key="`draws-${team.country}`"
                                    >
                                        {{ team.draws }}
                                    </td>
                                </tr>
                                <tr data-key="L" class="hidden">
                                    <td
                                        v-for="team in group.teams"
                                        :key="`losses-${team.country}`"
                                    >
                                        {{ team.losses }}
                                    </td>
                                </tr>
                                <tr data-key="GF" class="hidden">
                                    <td
                                        v-for="team in group.teams"
                                        :key="`gf-${team.country}`"
                                    >
                                        {{ team.goals_for }}
                                    </td>
                                </tr>
                                <tr data-key="GA" class="hidden">
                                    <td
                                        v-for="team in group.teams"
                                        :key="`ga-${team.country}`"
                                    >
                                        {{ team.goals_against }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <div
                            v-for="match in group.matches.map(
                                (id) => matches[id],
                            )"
                            :key="match.id"
                            @mouseover="showdetails(match.id)"
                            @click="showdetails(match.id, true)"
                            @focus="showdetails(match.id, true)"
                            @mouseleave="closedetails()"
                            :class="{
                                future: match.status == 'future_scheduled',
                                current: current && match.id == current.id,
                            }"
                            class="gmatch"
                            :id="match.id"
                            tabindex="0"
                        >
                            <FlagIcon :code="match.home_team.country" />
                            <span
                                :class="{
                                    bold:
                                        match.home_team.name == match.winner ||
                                        match.winner == 'Draw',
                                }"
                                class="home"
                                >{{ match.home_team.name }}</span
                            >
                            <span
                                class="score"
                                v-if="match.status == 'completed'"
                                >{{ match.home_team.goals }}-{{
                                    match.away_team.goals
                                }}</span
                            >
                            <span
                                class="score"
                                v-if="match.status.startsWith('future')"
                                >{{ time(match.datetime) }}</span
                            >
                            <span
                                class="score"
                                v-if="match.status == 'in_progress'"
                                >now!</span
                            >
                            <span
                                :class="{
                                    bold:
                                        match.away_team.name == match.winner ||
                                        match.winner == 'Draw',
                                }"
                                class="away"
                                >{{ match.away_team.name }}</span
                            >
                            <FlagIcon :code="match.away_team.country" />
                        </div>
                    </div>
                </div>
            </details>
        </div>
        <div id="matchdetails" v-if="details" :class="{ moved: ismoved }">
            <a
                href="#"
                target="_top"
                @click.prevent="details = false"
                title="close details"
                >&times;</a
            >
            <div>
                <b>Match #{{ details.id }}</b
                ><br /><br />
                <span class="home center">
                    <FlagIcon
                        size="2"
                        :code="details.home_team.country"
                    /><br />
                    {{ details.home_team.name }}<br />
                    <i v-if="details.status != 'future_scheduled'"
                        >({{ details.home_team.penalties }} penalties)</i
                    >
                </span>
                <span class="score" v-if="details.status == 'completed'"
                    >{{ details.home_team.goals }}-{{
                        details.away_team.goals
                    }}</span
                >
                <span class="score" v-if="details.status != 'completed'"
                    >vs.</span
                >
                <span class="away center">
                    <FlagIcon
                        size="2"
                        :code="details.away_team.country"
                    /><br />
                    {{ details.away_team.name }}<br />
                    <i v-if="details.status != 'future_scheduled'"
                        >({{ details.away_team.penalties }} penalties)</i
                    > </span
                ><br /><br />
            </div>
            <span>{{ time(details.datetime, true) }}</span
            ><br />
            <span>{{ details.venue }}, {{ details.location }}</span
            ><span v-if="details.attendance"
                ><br />({{ details.attendance }} attendees)</span
            >
            <hr />
            <h3 class="left">Event List:</h3>
            <div v-if="events(details).length == 0">(none yet)</div>
            <div v-else>
                <div v-for="event in events(details)" :key="event.id">
                    <span class="half right"
                        ><span v-if="event.class == 'left'">
                            {{ event.time }} <b>{{ event.type_of_event }}</b
                            ><br />
                            {{ event.player
                            }}<del v-if="event.off"><br />{{ event.off }}</del>
                            <br /><br /> </span
                    ></span>
                    <span class="half left"
                        ><span v-if="event.class == 'right'">
                            <b>{{ event.type_of_event }}</b> {{ event.time
                            }}<br />
                            {{ event.player
                            }}<del v-if="event.off"><br />{{ event.off }}</del>
                            <br /><br /> </span
                    ></span>
                </div>
            </div>
            <hr />
            <h3 class="left">Players:</h3>
            <h5>
                (g:goalkeeper, d:defender, m:midfielder, f:forward, u:unknown)
            </h5>
            <div>
                <span class="half left">
                    <span
                        v-for="player in details.home_team_lineup
                            .starting_eleven"
                        :key="`home-starter-${player.name}`"
                    >
                        <b>{{ String(player.shirt_number).padStart(2, 0) }}</b>
                        {{ player.name }}
                        <i>{{ player.position[0].toLowerCase() }}</i
                        ><br />
                    </span>
                </span>
                <span class="half right">
                    <span
                        v-for="player in details.away_team_lineup
                            .starting_eleven"
                        :key="`away-starter-${player.name}`"
                    >
                        <i>{{ player.position[0].toLowerCase() }}</i>
                        {{ player.name }}
                        <b>{{ String(player.shirt_number).padStart(2, 0) }}</b
                        ><br />
                    </span>
                </span>
            </div>
            <h4>substitutes</h4>
            <div>
                <span class="half left">
                    <span
                        v-for="player in details.home_team_lineup.substitutes"
                        :key="`home-sub-${player.name}`"
                    >
                        <b>{{ String(player.shirt_number).padStart(2, 0) }}</b>
                        {{ player.name }}
                        <i>{{ player.position[0].toLowerCase() }}</i
                        ><br />
                    </span>
                </span>
                <span class="half right">
                    <span
                        v-for="player in details.away_team_lineup.substitutes"
                        :key="`away-sub-${player.name}`"
                    >
                        <i>{{ player.position[0].toLowerCase() }}</i>
                        {{ player.name }}
                        <b>{{ String(player.shirt_number).padStart(2, 0) }}</b
                        ><br />
                    </span>
                </span>
            </div>
            <hr />
            <h3 class="left">Officials:</h3>
            <div v-if="details.officials.length == 0">(none yet)</div>
            <div
                v-for="official in details.officials"
                :key="official.name"
                class="left"
            >
                <FlagIcon :code="official.country" />
                <b>{{ official.name }}</b>
                <i>{{ official.role }}</i>
            </div>
            <hr />
            <h3 class="left">Weather:</h3>
            {{ details.weather.description }}<br />
            {{ Math.round(details.weather.temp_celsius * 1.8 + 32) }}&deg;F
            {{ details.weather.temp_celsius }}&deg;C
            <hr />
            <i
                >last updated at {{ details.last_checked_at }} -
                <a :href="'/data/2022/matches/' + details.id">details</a></i
            >
        </div>
        <hr />
        <br />
        <div align="center">
            page views: (over 140K: counter API went down 2024)
            <img
                alt="GitHub last commit"
                src="https://img.shields.io/github/last-commit/cole-wilson/worldcup?label=last%20update"
            />
        </div>
        <br />
    </div>
</template>

<script>
import FlagIcon from "../2026/components/FlagIcon.vue";
import MatchCard from "../2026/components/MatchCard.vue";

const locale =
    navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
const PREFIX = "/data/2022/";

async function getData(path) {
    const normalizedPath = path.replace(/^\/+/, "");
    const dataPath =
        normalizedPath === "matches"
            ? "matches/index.json"
            : `${normalizedPath}.json`;

    return await (await fetch(PREFIX + dataPath)).json();
}

export default {
    name: "App",
    components: { FlagIcon, MatchCard },
    data() {
        return {
            matches: [],
            groups: [],
            current: undefined,
            details: false,
            clicking: false,
            ismoved: false,
            currentcount: 0,
            currentgamenames: [],
            mouseX: 0,
            updated: {},
            pollTimer: undefined,
            showbanner: false,
        };
    },
    mounted() {
        setTimeout(
            () => document.documentElement.classList.add("loaded"),
            1000,
        );
        window.addEventListener("keydown", this.handleKeydown);
        window.addEventListener("focus", this.handleFocus);
        window.addEventListener("blur", this.handleBlur);
        document.body.addEventListener("click", this.handleBodyClick);
        document.body.addEventListener("mousemove", this.handleMousemove);
        this.loadData();
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeydown);
        window.removeEventListener("focus", this.handleFocus);
        window.removeEventListener("blur", this.handleBlur);
        document.body.removeEventListener("click", this.handleBodyClick);
        document.body.removeEventListener("mousemove", this.handleMousemove);
        clearInterval(this.pollTimer);
    },
    methods: {
        async loadData() {
            this.matches = await getData("/matches");
            this.override();

            let teamdata = (await getData("/teams")).groups;
            teamdata[3].teams.map((t) => {
                if (t.country == "TUN") t.group_points = 4;
                if (t.country == "FRA") t.group_points = 6;
            });

            for (let i = 0; i < teamdata.length; i++) {
                let groupname = teamdata[i].letter.toLowerCase();
                let groupteams = teamdata[i].teams;
                let groupteamids = teamdata[i].teams.map((t) => t.country);
                let maxpoints = teamdata[i].teams
                    .map((t) => t.group_points)
                    .sort((a, b) => b - a)[1];
                let groupmatchids = this.matches
                    .filter(
                        (match) =>
                            groupteamids.includes(match.home_team_country) &&
                            match.stage_name == "First stage",
                    )
                    .map((m) => m.id - 1)
                    .sort((a, b) => a - b);

                let gamecount = 0;
                for (const teamindex in groupteams) {
                    let t = groupteams[teamindex];
                    gamecount += t.games_played;
                    groupteams[teamindex].eliminated =
                        t.group_points + (3 - t.games_played) * 3 < maxpoints;
                }

                this.groups.push({
                    letter: groupname,
                    teams: groupteams.sort(
                        (a, b) =>
                            b.group_points - a.group_points ||
                            b.goal_differential - a.goal_differential,
                    ),
                    matches: groupmatchids,
                    complete: gamecount == 12,
                });
            }

            this.current = this.matches.filter(
                (m) => m.status == "in_progress",
            )[0];
            if (this.current === undefined) {
                let temp = this.matches
                    .filter((m) => m.status == "completed")
                    .sort((a, b) => Date(a.datetime) - Date(b.datetime));
                this.current = temp[temp.length - 1];
            }
            this.poll();
            this.pollTimer = setInterval(this.poll, 57 * 1000);
            this.confetti();
        },
        closebanner() {
            this.showbanner = false;
            localStorage.setItem(
                "bannerclosed",
                (localStorage.getItem("bannerclosed") | 0) + 1,
            );
        },
        fullscreenCurrent() {
            let elem = document.getElementById("current");
            if (elem.requestFullscreen) elem.requestFullscreen();
            else if (elem.webkitRequestFullscreen)
                elem.webkitRequestFullscreen();
            else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
        },
        events(match) {
            const events = [];
            for (const eindex in match.home_team_events) {
                let edata = match.home_team_events[eindex];
                edata.class = "left";
                if (edata.extra_info)
                    edata.off = JSON.parse(edata.extra_info).player_off;
                events.push(edata);
            }
            for (const eindex in match.away_team_events) {
                let edata = match.away_team_events[eindex];
                edata.class = "right";
                if (edata.extra_info)
                    edata.off = JSON.parse(edata.extra_info).player_off;
                events.push(edata);
            }
            events.sort((a, b) => a.id - b.id);
            return events;
        },
        showdetails(id, click) {
            if (!this.clicking || click) {
                this.ismoved = this.mouseX / window.innerWidth > 0.5;
                this.detailedMatch(id);
            }
            if (click && !this.clicking) this.clicking = true;
        },
        closedetails() {
            if (!this.clicking) this.details = false;
        },
        time(str, l, ish) {
            let date = new Date(str);
            if (l)
                return (
                    Intl.DateTimeFormat(locale, {
                        dateStyle: "long",
                        timeStyle: "short",
                    }).format(date) + " your time"
                );

            let now = new Date();
            let diff = (date - now) / (1000 * 60 * 60 * 24);
            if (diff > 0 && diff < 1) {
                return (
                    (date.getDate() == now.getDate() ? "  " : "+") +
                    Intl.DateTimeFormat(locale, { hour: "numeric" })
                        .format(date)
                        .replaceAll(" ", "")
                        .toLowerCase()
                );
            }
            return Intl.DateTimeFormat(locale, {
                month: ish ? "long" : "narrow",
                day: "2-digit",
            })
                .format(date)
                .replaceAll(" ", ish ? " " : "");
        },
        async poll() {
            let currentgames = await getData("/matches/current");
            this.currentgamenames = currentgames.map(
                (g) => `${g.home_team.name} v. ${g.away_team.name}`,
            );
            let newdata = currentgames[this.currentcount | 0];
            if (newdata !== undefined) {
                this.current = newdata;
                this.matches[this.current.id - 1] = newdata;
            }
        },
        override() {
            this.matches[38 - 1].winner_code = "TUN";
            this.matches[38 - 1].winner = "Tunisia";
            this.matches[38 - 1].away_team.goals = 0;

            try {
                this.updated[38].winner_code = "TUN";
                this.updated[38].winner = "Tunisia";
                this.updated[38].away_team.goals = 0;
            } catch {}
        },
        async detailedMatch(id) {
            if (!(id in this.updated))
                this.updated[id] = await getData(`/matches/${id}`);
            this.override();
            this.details = this.updated[id];
        },
        confetti() {},
        handleKeydown(e) {
            if (e.key === "Escape") {
                this.clicking = false;
                this.details = false;
                document.body.focus();
            }
        },
        handleBodyClick(e) {
            if (e.target.closest(".gmatch, #bracket .group") == null)
                this.details = false;
        },
        handleMousemove(e) {
            this.mouseX = e.clientX;
        },
        handleFocus() {
            document.title = "2022 FIFA World Cup Bracket";
        },
        handleBlur() {
            if (!this.current) return;
            document.title = `${this.current.home_team.country} ${this.current.home_team.goals}-${this.current.away_team.goals} ${this.current.away_team.country} ${this.current.time || "FINAL"}`;
        },
    },
};
</script>
