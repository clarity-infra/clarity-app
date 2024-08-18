<template>
  <VAppBar>
      <VToolbarItems>
        <VBtn>
          <VToolbarTitle>
          ✨ Clarify
          </VToolbarTitle>
        </VBtn>
      </VToolbarItems>

      <VSpacer />

      <VDivider vertical />

      <VToolbarItems>
        <VBtn>
            Settings
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
      <slot />
    </VMain>
</template>