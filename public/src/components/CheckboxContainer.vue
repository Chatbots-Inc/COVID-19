<template>
    <div>
        <b-form-checkbox-group
          id       = "checkbox-group-1"
          v-model  = "selected"
          :options = "optionList"
          name     = "flavour-1"
	  v-on:input = "$emit('checkbox-change', selected)"
	  stacked
	  ></b-form-checkbox-group>
    </div>
</template>

<script>
import { getChildValues } from '../firebase';

export default {
  props: ['childName'],
  data() {
    return {
      selected: [],
      optionList: getChildValues(this.childName),
    }
  },
};

</script>

<style scoped>
</style>
