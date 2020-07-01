<template>
  <div>
    <b-table striped hover :items="users_data" :fields="fields"></b-table>
  </div>
</template>

<script>
import moment from 'moment';
import { usersRef } from '../firebase';

moment.locale('es-us');

export default {
  data() {
    return {
      fields: [
        {
          key: 'SessionId',
          label: 'No. sesión',
          sortable: true,
        },
        {
          key: 'Date',
          label: 'Fecha',
          sortable: true,
        },
        {
          key: 'Hour',
          label: 'Hora',
          sortable: false,
        },
        {
          key: 'index',
          label: 'No. interacción',
          sortable: false,
        },
        {
          key: 'TextQuery',
          label: 'Escrito usuario',
          sortable: false,
        },
        {
          key: 'IntentName',
          label: 'Escrito agente',
          sortable: false,
        },
        {
          key: 'Confidence',
          label: 'Certidumbre',
          sortable: false,
        },
      ],
    };
  },
  firebase: {
    users: usersRef,
  },
  computed: {
    users_data() {
      return this.users.map((user) => ({
        ...user,
        Confidence: user.Confidence,
        TextQuery:user.TextQuery,
        IntentName:user.IntentName,
        responseId:user.responseId
      }));
    },
  },

};

</script>


<style scoped>  /* "scoped" attribute limit the CSS to this component only */

  .my-panel {
    margin:32px;
  }

</style>
