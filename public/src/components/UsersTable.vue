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
          key: 'TextQuery',
          label: 'TextQuery',
          sortable: false,
        },
        {
          key: 'IntentName',
          label: 'IntentName',
          sortable: true,
        },
        {
          key: 'Confidence',
          label: 'Confidence',
          sortable: false,
        },
        {
          key: 'responseId',
          label: 'responseId',
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
