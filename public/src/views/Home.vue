<template>
  <div class="home">
    <b-button variant="outline-danger" @click="logout">Logout</b-button>
    <!--<datepicker placeholder="Seleccionar fecha inicial"></datepicker>
    <datepicker placeholder="Seleccionar fecha final"></datepicker>
    <DownloadExcel class="download-sorted-excel" sortBy="SessionId" sortName="sesión"/>
    <DownloadExcel class="download-sorted-excel" sortBy="Name" sortName="nombre" nameList="Dr PhD Jose Luis Gonzalez"/>
    <DownloadExcel class="download-sorted-excel" sortBy="Time" sortName="fecha" startTime="1593900773580" endTime="1594069811832"/> -->
    <br><DownloadDialog></DownloadDialog>
    <UsersTable class="users-table"/>
  </div>


</template>

<script>
import firebase from 'firebase';
// @ is an alias to /src
import UsersTable from '@/components/UsersTable.vue';
import DownloadExcel from '@/components/DownloadExcel.vue';
import DownloadDialog from '@/components/DownloadDialog.vue';

export default {
  name: 'home',
  components: {
    UsersTable,
    DownloadExcel,
    DownloadDialog
  },
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login');
      });
    },
  },
};
</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */

  .home > * + * {
    margin-top: 30px;
  }

</style>
