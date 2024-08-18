<template>
    <v-avatar>
        <v-img
            :alt="props.alt"
            :src="props.src"
        />
    </v-avatar>
</template>

<script lang="ts" setup>
const props = defineProps<{
    src: string;
    alt?: string;  
}>();
</script>