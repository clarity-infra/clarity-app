<template>
    <v-dialog activator="parent" max-width="340">
        <template v-slot:default="{ isActive }">
        <v-card
            prepend-icon="mdi-picture-in-picture-bottom-right"
            title="Add Application"
        >
            <template #text>
                <VTextField v-model="image" label="Image" placeholder="hello-world:latest" />
                <VTextField v-model="port" label="Port" placeholder="3000,3001,3002" />
            </template>
            <template v-slot:actions>
            <v-btn
                text="Close"
                @click="isActive.value = false"
            ></v-btn>
            <VSpacer />
            <v-btn
                text="Add"
                color="primary"
                @click="submit(); isActive.value = false"
            ></v-btn>
            </template>
        </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
const image = defineModel('image');
const port = defineModel('port');

const data = computed(() => {
    return {
        image: image.value,
        port: port.value
    }
})

const emit = defineEmits<{
    submit: [typeof data.value]
}>();

function submit() {
    emit('submit', data.value)
}
</script>