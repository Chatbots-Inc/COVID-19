<template>
    <div class="download-sorted-excel">
        <download-excel
            :data   = users
            :fields = "json_fields"
            worksheet = "My Worksheet"
            name    = "queries_meddy.xls">
    	    <b-button variant="success">Descargar (ordenado por {{ sortName }})</b-button>
        </download-excel>
    </div>
</template>

<script>
import { usersRef } from '../firebase';

export default {
  props : ['sortBy', 'sortName'],
  data() {
    return {
      users: [],
      json_fields: {
	'SessionId': 'SessionId',
	'Date': 'Date',
        'TextQuery': 'TextQuery',
        'IntentName': 'IntentName',
        'Confidence': 'Confidence',
        'responseId': 'responseId',
      },
    };
  },
  firebase() {
    if (this.sortBy) {
      return {
           users: usersRef.orderByChild(this.sortBy),
      }
    } else {
      return {
         users: usersRef
      }
    }
  },
};
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .download-excel {
    margin-top: 30px;
  }
</style>
