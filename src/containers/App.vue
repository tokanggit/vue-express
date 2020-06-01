<template>
  <div id="app">
    <div>{{ welcome }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

const states = mapState({
  welcome: state => state.dummy.welcome,
});

export default {
  name: 'app',
  computed: {...states},
}
</script>
