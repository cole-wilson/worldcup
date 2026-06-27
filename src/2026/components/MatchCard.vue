<template>
    <div
        v-if="match"
        :id="match.id"
        class="group"
        :class="{
            current: current && match.id == current.id,
            final: match.id == finalMatchId,
        }"
        tabindex="0"
        @mouseover="$emit('showdetails', match.id)"
        @click="$emit('showdetails', match.id, true)"
        @focus="$emit('showdetails', match.id, true)"
        @mouseleave="$emit('closedetails')"
    >
        <span>
            <b>{{ matchTitle }}</b
            ><br />
            {{ time(match.datetime, false, true) }}
        </span>
        <br /><br />
        <div :class="{ future: match.status?.startsWith('future') }">
            <FlagIcon size="1" :code="flagCode(match.home_team.country)" />
            <span
                class="home"
                :class="{
                    bold:
                        match.home_team.name == match.winner ||
                        match.winner == 'Draw',
                }"
            >
                {{ matchName(match.home_team) }}
            </span>
            <span class="away biggish">
                {{ match.home_team.goals }}
                <span
                    class="pen"
                    v-if="
                        match.away_team.penalties || match.home_team.penalties
                    "
                    >({{ match.home_team.penalties }})</span
                >
            </span>
            <br />
            <span class="loss">vs.</span>
            <br />
            <FlagIcon size="1" :code="flagCode(match.away_team.country)" />
            <span
                class="home"
                :class="{
                    bold:
                        match.away_team.name == match.winner ||
                        match.winner == 'Draw',
                }"
            >
                {{ matchName(match.away_team) }}
            </span>
            <span class="away biggish">
                {{ match.away_team.goals }}
                <span
                    class="pen"
                    v-if="
                        match.away_team.penalties || match.home_team.penalties
                    "
                    >({{ match.away_team.penalties }})</span
                >
            </span>
        </div>
        <br />
    </div>
</template>

<script>
import FlagIcon from "./FlagIcon.vue";

export default {
    name: "MatchCard",
    components: { FlagIcon },
    props: {
        match: { type: Object, default: undefined },
        matches: { type: Array, required: true },
        groups: { type: Array, required: true },
        current: { type: Object, default: undefined },
        time: { type: Function, required: true },
        finalMatchId: { type: Number, default: 64 },
        thirdPlaceMatchId: { type: Number, default: 63 },
    },
    emits: ["showdetails", "closedetails"],
    computed: {
        matchTitle() {
            if (this.match.id == this.finalMatchId) return "Final";
            if (this.match.id == this.thirdPlaceMatchId) return "Third Place";
            return `Match ${this.match.id}`;
        },
    },
    methods: {
        matchName(team) {
            if (!team) return "To Be Determined";
            if (team.name && team.name != "To Be Determined") return team.name;
            return this.matchCountry(team.country, true);
        },
        flagCode(country) {
            if (/^[A-Z]{3}$/.test(country || "")) return country;
            return "TBD";
        },
        matchCountry(country, name = false) {
            if (!country || country === "TBD")
                return name ? "To Be Determined" : "TBD";

            if (/^W\d+$/.test(country)) {
                const matchId = Number(country.slice(1));
                const match = this.matches.find((m) => m.id === matchId);
                return name
                    ? match?.winner || `Winner M${matchId}`
                    : match?.winner_code || "TBD";
            }

            if (/^RU\d+$/.test(country)) {
                const matchId = Number(country.slice(2));
                return name ? `Runner-up M${matchId}` : "TBD";
            }

            if (/^[12][A-Z]$/.test(country)) {
                const rank = Number(country[0]);
                const groupLetter = country[1].toLowerCase();
                const group = this.groups.find(
                    (group) => group.letter?.toLowerCase() === groupLetter,
                );
                const actual = group?.teams?.[rank - 1];

                if (group?.complete && actual) {
                    return name
                        ? actual.name || country
                        : actual.country || country;
                }

                return name
                    ? `${rank === 1 ? "Winner" : "Runner-up"} Group ${country[1]}`
                    : country;
            }

            if (/^3[A-Z]+$/.test(country)) {
                const groups = country.slice(1).split("").join("/");
                return name ? `Third place ${groups}` : "TBD";
            }

            return country;
        },
    },
};
</script>
