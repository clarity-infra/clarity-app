<template>
  <VAppBar>
      <VToolbarItems>
        <VBtn>
          <VToolbarTitle>
          ✨ Clarify
          </VToolbarTitle>
        </VBtn>
      </VToolbarItems>

      <ProjectBreadcrumbs />

      <VSpacer />

      <VTabs>
        <VTab>
            Infrastructure
        </VTab>
        <VTab disabled>
            Settings
        </VTab>
      </VTabs>

      <ProjectShare />

      <VBtn icon>
        <v-avatar>
          <v-img
            alt="John"
            src="https://cdn.vuetifyjs.com/images/john.jpg"
          ></v-img>
        </v-avatar>
      </VBtn>
    </VAppBar>
    
    
    <VMain>
      <NuxtPage />
    </VMain>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})
</script>