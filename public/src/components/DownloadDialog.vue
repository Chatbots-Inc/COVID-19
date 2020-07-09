<template>
    <div class="download-dialog">
	<datepicker placeholder="Seleccionar fecha inicial"></datepicker>
	<datepicker placeholder="Seleccionar fecha final"></datepicker>
	<DownloadExcel class="download-sorted-excel" sortBy="SessionId" sortName="sesión"/>
	<DownloadExcel class="download-sorted-excel" sortBy="Name" sortName="nombre" nameList="Dr PhD Jose Luis Gonzalez"/>
	<DownloadExcel class="download-sorted-excel" sortBy="Time" sortName="fecha" startTime="1593900773580" endTime="1594069811832"/>
    </div>
</template>

<script>
import firebase from 'firebase';
// @ is an alias to /src
import DownloadExcel from '@/components/DownloadExcel.vue';

export default {
  name: 'DownloadDialog',
  components: {
    DownloadExcel,
  },
  data () {
    return {}
  }
}

</script>

<style>
</style>
