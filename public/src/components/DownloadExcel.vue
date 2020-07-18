<template>
    <div class="download-sorted-excel">
        <download-excel
	    :fetch  = "fetchData"
            :fields = "jsonFields"
            name    = "queries_meddy.xls">
    	    <b-button variant="success">Descargar</b-button>
        </download-excel>
    </div>
</template>

<script>
import { getFilteredData, exportFields } from '../firebase';

export default {
  props: ['sortBy', 'startTime', 'endTime', 'nameList'],
  data() {
    return {
      jsonFields: exportFields,
    }
  },
  methods: {
    fetchData: function () {
      return getFilteredData(this.sortBy, [this.startTime.getTime(), this.endTime.getTime()])
    }
  },
};

</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .download-excel {
    margin-top: 30px;
  }
</style>
