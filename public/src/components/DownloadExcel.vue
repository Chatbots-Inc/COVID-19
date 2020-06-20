<template>
    <download-excel
        :data   = users
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "queries_meddy.xls">
        <b-button variant="success">Descargar Excel</b-button>
    </download-excel>
</template>

<script>
import { usersRef } from '../firebase';

export default {
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
  firebase: {
    users: usersRef.orderByChild('SessionId'),
  },
};
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .download-excel {
    margin-top: 30px;
  }
</style>
