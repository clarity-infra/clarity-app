<template>
  <v-breadcrumbs :items="items" >
    <template v-slot:title="{ item }">
      <v-autocomplete 
        min-width="150" 
        density="compact" 
        :items="[{text: item.title}]" 
        item-title="text" 
        auto-select-first 
        :placeholder="item.title" 
        hide-details 
        variant="plain"
      />
    </template>
  </v-breadcrumbs>
</template>
<script lang="ts" setup>
const items = ref([
  { title: 'My Teams' },
  { title: 'My First Project' },
  { title: 'Production' }
])
</script>