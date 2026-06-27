<template>
    <img
        :class="`img${size}`"
        class="flag"
        :src="`/flag/${code}/${size}`"
        :alt="code"
        @error="$event.target.remove()"
    />
</template>

<script>
export default {
    name: "FlagIcon",
    props: {
        code: String,
        size: {
            type: [String, Number],
            default: "1",
        },
    },
};
</script>
