<template>
    <download-excel
        :data   = users
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "filename.xls">
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
        'TextQuery': 'TextQuery',
        'IntentName': 'IntentName',
        'Confidence': 'Confidence',
        'responseId': 'responseId',
      },
    };
  },
  firebase: {
    users: usersRef,
  },
};
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .download-excel {
    margin-top: 30px;
  }
</style>
