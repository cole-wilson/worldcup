<template>
    <canvas></canvas>
    <div id="page">
        <div id="top">
            <header>
                <h1>2026 FIFA World Cup bracket and standings</h1>
                <span
                    >A simple website designed to help you track 2026's FIFA
                    World Cup bracket and standings. Data and flags are from
                    FIFA, thanks! Click on a match to show a play-by-play view,
                    and view live score updates! The current (or most recent)
                    game appears at the top of your screen. Once the group games
                    are done, scroll down to see an entire tournament bracket
                    also updated in real time.
                    <a
                        href="https://www.amnesty.org/en/latest/news/2026/03/global-fifa-and-world-cup-hosts-must-prevent-tournament-becoming-a-threat-to-fans-and-communities/"
                        >Learn about human rights risks and abuses.</a
                    ><br /><br />
                    (c) <a href="https://cole.ws">cole wilson 2026</a>
                    <br />
                    (c) <a href="https://reeseric.ci">reese armstrong 2026</a>
                </span>
                <br />
                <a href="//buymeacoffee.com/colewilson" class="coffee"
                    >⚽ support cole's work!</a
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
        <details :open="current && current.id > groupStageMatchCount">
            <summary><h2>Tournament Bracket</h2></summary>
            <div id="bracket" v-if="matches.length > 0">
                <br /><br /><br />
                <div
                    v-for="column in bracketColumns"
                    :key="column.key"
                    :class="['col', column.side]"
                >
                    <div v-if="column.title" class="group transparent">
                        <b>{{ column.title }}</b>
                    </div>
                    <MatchCard
                        v-for="matchId in column.matches"
                        :key="matchId"
                        :match="matchById(matchId)"
                        :matches="matches"
                        :groups="groups"
                        :current="current"
                        :time="time"
                        :final-match-id="finalMatchId"
                        :third-place-match-id="thirdPlaceMatchId"
                        @showdetails="showdetails"
                        @closedetails="closedetails"
                    />
                </div>
            </div>
        </details>
        <hr />
        <div>
            <details :open="current && current.id <= groupStageMatchCount">
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
                                        :class="{ loss: team.eliminated }"
                                        v-for="team in group.teams"
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
            <div v-if="!details.home_team_lineup || !details.away_team_lineup">
                (lineups unavailable)
            </div>
            <template v-else>
                <h5>
                    (g:goalkeeper, d:defender, m:midfielder, f:forward,
                    u:unknown)
                </h5>
                <div>
                    <span class="half left">
                        <span
                            v-for="player in details.home_team_lineup
                                .starting_eleven"
                            :key="`home-starter-${player.name}`"
                        >
                            <b>{{
                                String(player.shirt_number).padStart(2, 0)
                            }}</b>
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
                            <b>{{
                                String(player.shirt_number).padStart(2, 0)
                            }}</b
                            ><br />
                        </span>
                    </span>
                </div>
                <h4>substitutes</h4>
                <div>
                    <span class="half left">
                        <span
                            v-for="player in details.home_team_lineup
                                .substitutes"
                            :key="`home-sub-${player.name}`"
                        >
                            <b>{{
                                String(player.shirt_number).padStart(2, 0)
                            }}</b>
                            {{ player.name }}
                            <i>{{ player.position[0].toLowerCase() }}</i
                            ><br />
                        </span>
                    </span>
                    <span class="half right">
                        <span
                            v-for="player in details.away_team_lineup
                                .substitutes"
                            :key="`away-sub-${player.name}`"
                        >
                            <i>{{ player.position[0].toLowerCase() }}</i>
                            {{ player.name }}
                            <b>{{
                                String(player.shirt_number).padStart(2, 0)
                            }}</b
                            ><br />
                        </span>
                    </span>
                </div>
            </template>
            <hr />
            <h3 class="left">Team Stats:</h3>
            <div v-if="!hasTeamStats(details)">(unavailable)</div>
            <table v-else class="stats-table">
                <tbody>
                    <tr>
                        <th>{{ details.home_team.country }}</th>
                        <th></th>
                        <th>{{ details.away_team.country }}</th>
                    </tr>
                    <tr v-for="row in teamStatRows(details)" :key="row.key">
                        <td>{{ row.home }}</td>
                        <td>{{ row.label }}</td>
                        <td>{{ row.away }}</td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <h3 class="left">Officials:</h3>
            <div v-if="!details.officials || details.officials.length == 0">
                (none yet)
            </div>
            <div
                v-for="official in details.officials || []"
                :key="official.name"
                class="left"
            >
                <FlagIcon :code="official.country" />
                <b>{{ official.name }}</b>
                <i>{{ official.role }}</i>
            </div>
            <hr />
            <h3 class="left">Weather:</h3>
            <template v-if="details.weather">
                {{ details.weather.description }}<br />
                {{ Math.round(details.weather.temp_celsius * 1.8 + 32) }}&deg;F
                {{ details.weather.temp_celsius }}&deg;C
            </template>
            <template v-else>(unavailable)</template>
            <hr />
            <i
                >last updated at {{ details.last_checked_at }} -
                <a :href="'/data/2026/matches/' + details.id">details</a></i
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
import FlagIcon from "./components/FlagIcon.vue";
import MatchCard from "./components/MatchCard.vue";

const locale =
    navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
const PREFIX = "/data/2026/";

async function getData(path) {
    return await (await fetch(PREFIX + path.replace(/^\/+/, ""))).json();
}

function eventMinute(time) {
    const match = /^(\d+)'(?:\+(\d+)')?$/.exec(time || "");
    if (!match) return Number.POSITIVE_INFINITY;
    return Number(match[1]) + (match[2] ? Number(match[2]) / 100 : 0);
}

export default {
    name: "App",
    components: { FlagIcon, MatchCard },
    data() {
        return {
            groupStageMatchCount: 72,
            finalMatchId: 104,
            thirdPlaceMatchId: 103,
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
            pendingMatchRequests: {},
            pollTimer: undefined,
            showbanner: false,
        };
    },
    computed: {
        bracketColumns() {
            return [
                {
                    key: "left-round-of-32",
                    side: "left",
                    title: "Round of 32",
                    matches: [74, 77, 73, 75, 83, 84, 81, 82],
                },
                {
                    key: "left-round-of-16",
                    side: "left",
                    title: "Round of 16",
                    matches: [89, 90, 93, 94],
                },
                {
                    key: "left-quarterfinals",
                    side: "left",
                    title: "Quarterfinals",
                    matches: [97, 98],
                },
                {
                    key: "left-semifinal",
                    side: "left",
                    title: "Semifinal",
                    matches: [101],
                },
                {
                    key: "finals",
                    side: "middle",
                    title: "Finals",
                    matches: [104, 103],
                },
                {
                    key: "right-semifinal",
                    side: "right",
                    title: "Semifinal",
                    matches: [102],
                },
                {
                    key: "right-quarterfinals",
                    side: "right",
                    title: "Quarterfinals",
                    matches: [99, 100],
                },
                {
                    key: "right-round-of-16",
                    side: "right",
                    title: "Round of 16",
                    matches: [91, 92, 95, 96],
                },
                {
                    key: "right-round-of-32",
                    side: "right",
                    title: "Round of 32",
                    matches: [76, 78, 79, 80, 86, 88, 85, 87],
                },
            ];
        },
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
        range(start, end) {
            return Array.from(
                { length: end - start + 1 },
                (_, index) => start + index,
            );
        },
        matchById(id) {
            return this.matches.find((match) => match.id === id);
        },
        async loadData() {
            this.matches = await getData("/matches");
            this.override();

            let teamdata = (await getData("/teams")).groups;

            // 2026 format: top 2 of each group plus the 8 best third-place
            // teams (across all groups) advance, so a team can't be greyed
            // out just for falling out of the top 2 in its own group.
            const THIRD_PLACE_QUALIFIER_COUNT = 8;

            // FIFA's actual tiebreaker order for final standings: points,
            // then goal differential, then goals scored.
            const standingsRank = (a, b) =>
                (b.group_points ?? 0) - (a.group_points ?? 0) ||
                (b.goal_differential ?? 0) - (a.goal_differential ?? 0) ||
                (b.goals_for ?? 0) - (a.goals_for ?? 0);

            // once both groups are finished there's no more uncertainty to
            // be generous about, so a tie at the same points total is
            // settled by the same tiebreaker rather than left "still alive"
            const beatsOnTiebreak = (a, b) => standingsRank(a, b) < 0;

            this.groups = [];
            let groupInfos = [];

            for (let i = 0; i < teamdata.length; i++) {
                const group = teamdata[i];
                const groupname = (
                    group.letter || String.fromCharCode(97 + i)
                ).toLowerCase();
                let groupteams = group.teams || [];
                let groupteamids = groupteams.map((t) => t.country);
                let standings = [...groupteams].sort(standingsRank);
                let pointsDesc = standings.map((t) => t.group_points ?? 0);
                let maxpoints = pointsDesc[1] ?? 0;
                // a team's eventual third-placer can never finish with
                // fewer points than whoever currently sits third, since
                // points only ever go up
                let thirdPlaceFloor = pointsDesc[2] ?? 0;
                let thirdPlaceTeam = standings[2] ?? {
                    group_points: 0,
                    goal_differential: 0,
                    goals_for: 0,
                };
                let groupmatchids = this.matches
                    .filter(
                        (match) =>
                            groupteamids.includes(match.home_team_country) &&
                            ["first stage", "group stage"].includes(
                                match.stage_name?.toLowerCase(),
                            ),
                    )
                    .map((m) => m.id - 1)
                    .sort((a, b) => a - b);

                let gamecount = groupteams.reduce(
                    (sum, t) => sum + (t.games_played ?? 0),
                    0,
                );
                let complete = gamecount == 12;
                let teamCeilings = [];
                for (const t of groupteams) {
                    const gamesPlayed = t.games_played ?? 0;
                    const groupPoints = t.group_points ?? 0;
                    const ceiling = groupPoints + (3 - gamesPlayed) * 3;
                    teamCeilings.push(ceiling);

                    if (complete) {
                        // no games left in this group: the final order is
                        // fully decided, and only the team that actually
                        // finished third is eligible for the wildcard pool
                        const rank = standings.indexOf(t);
                        t.outOfTopTwo = rank >= 2;
                        t.canReachThird = rank === 2;
                    } else {
                        t.outOfTopTwo = ceiling < maxpoints;
                        t.canReachThird = ceiling >= thirdPlaceFloor;
                    }
                }

                groupInfos.push({
                    groupname,
                    groupteams,
                    groupmatchids,
                    gamecount,
                    complete,
                    thirdPlaceFloor,
                    thirdPlaceTeam,
                    teamCeilings,
                });
            }

            for (const info of groupInfos) {
                const otherGroups = groupInfos.filter(
                    (other) => other !== info,
                );
                info.groupteams.forEach((t, index) => {
                    const ceiling = info.teamCeilings[index];
                    const outOfThirdPlaceRace = otherGroups.filter((other) =>
                        info.complete && other.complete
                            ? beatsOnTiebreak(other.thirdPlaceTeam, t)
                            : other.thirdPlaceFloor > ceiling,
                    ).length;
                    const canStillBeBestThird =
                        t.canReachThird &&
                        outOfThirdPlaceRace < THIRD_PLACE_QUALIFIER_COUNT;
                    t.eliminated = t.outOfTopTwo && !canStillBeBestThird;
                    delete t.outOfTopTwo;
                    delete t.canReachThird;
                });

                this.groups.push({
                    letter: info.groupname,
                    teams: info.groupteams.sort(standingsRank),
                    matches: info.groupmatchids,
                    complete: info.complete,
                });
            }

            this.groups.sort((a, b) => a.letter.localeCompare(b.letter));

            this.current = this.matches.filter(
                (m) => m.status == "in_progress",
            )[0];
            if (this.current === undefined) {
                let temp = this.matches
                    .filter((m) => m.status == "completed")
                    .sort(
                        (a, b) => new Date(a.datetime) - new Date(b.datetime),
                    );
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
        hasTeamStats(match) {
            return Boolean(
                match?.home_team_statistics && match?.away_team_statistics,
            );
        },
        teamStatRows(match) {
            if (!this.hasTeamStats(match)) return [];

            const stats = [
                ["attempts_on_goal", "Attempts"],
                ["on_target", "On target"],
                ["off_target", "Off target"],
                ["blocked", "Blocked"],
                ["corners", "Corners"],
                ["offsides", "Offsides"],
                ["num_passes", "Passes"],
                ["passes_completed", "Passes completed"],
                ["tackles", "Tackles"],
                ["free_kicks", "Free kicks"],
                ["goal_kicks", "Goal kicks"],
                ["throw_ins", "Throw-ins"],
                ["yellow_cards", "Yellow cards"],
                ["red_cards", "Red cards"],
                ["fouls_committed", "Fouls"],
            ];

            return stats.map(([key, label]) => ({
                key,
                label,
                home: match.home_team_statistics[key] ?? "—",
                away: match.away_team_statistics[key] ?? "—",
            }));
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
            events.sort((a, b) => eventMinute(a.time) - eventMinute(b.time));
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
            let startOfToday = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
            );
            let startOfMatchDay = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
            );
            let dayDiff = Math.round(
                (startOfMatchDay - startOfToday) / (1000 * 60 * 60 * 24),
            );
            if (dayDiff === 0 || dayDiff === 1) {
                return (
                    (dayDiff === 0 ? "  " : "+") +
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
            if (!(id in this.updated)) {
                if (!(id in this.pendingMatchRequests))
                    this.pendingMatchRequests[id] = getData(`/matches/${id}`);
                this.updated[id] = await this.pendingMatchRequests[id];
                delete this.pendingMatchRequests[id];
            }
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
            document.title = "2026 FIFA World Cup Bracket";
        },
        handleBlur() {
            if (!this.current) return;
            document.title = `${this.current.home_team.country} ${this.current.home_team.goals}-${this.current.away_team.goals} ${this.current.away_team.country} ${this.current.time || "FINAL"}`;
        },
    },
};
</script>
