---
layout: page
---
<DropDown :options="menu" defaultKey="A"/>

<!-- <abmap /> -->
<deckMap />

<script setup>
    // import abmap from '@/layouts/map.vue'
    // docs/src/layouts/app.vue
    import deckMap from '@/layouts/app.vue'
    import { menu } from './menu.js';
    import DropDown from '@/components/Dropdown.vue';
</script>
