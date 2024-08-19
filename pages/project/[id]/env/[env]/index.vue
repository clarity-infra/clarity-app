<!-- PART OF RESEARCH -->

<template>
    <div class="h-100 w-100">
      <div ref="diagram" class="h-100 w-100"></div>
      <div class="h-100 w-100">
        <div style="position: fixed; bottom: 0; right: 0; width: 80px; height: 80px;">
          <v-speed-dial location="top left" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
              <v-fab
                v-bind="activatorProps"
                size="large"
                icon="$vuetify"
              ></v-fab>
            </template>

            <v-btn key="2" disabled>
              Add Load Balancer
            </v-btn>

            <v-btn
              prepend-icon="mdi-picture-in-picture-bottom-right"
            >
              Add Application
              <InfrastructureMinimalApplicationForm />
            </v-btn>
          </v-speed-dial>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useInfrastructureEditor } from '~/composable/ratejs';

const diagram = ref();

let createApp = () => {}

onMounted(() => {
  const infrastructureEditor = useInfrastructureEditor(diagram);

  createApp = () => {
    infrastructureEditor.addApplication()
  }
})
</script>