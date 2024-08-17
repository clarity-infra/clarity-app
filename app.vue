<template>
  <VApp>
    <VAppBar>
      <VToolbarItems>
        <VBtn>
          <VToolbarTitle>
          ✨ Clarify
          </VToolbarTitle>
        </VBtn>

        <VBtn>
          Project Name
        </VBtn>

        <VBtn readonly>
          /
        </VBtn>

        <VBtn>
          ENV: Production
        </VBtn>
      </VToolbarItems>

      <VSpacer />

      <VTabs>
        <VTab>
            Infrastructure
        </VTab>
        <VTab disabled>
            Settings
        </VTab>
      </VTabs>

      <VDivider vertical />

      <VToolbarItems>
        <VBtn>
          Share
        </VBtn>
      </VToolbarItems>

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
  </VApp>
</template>
