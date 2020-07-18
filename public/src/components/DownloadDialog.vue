<template>
    <div class="download-dialog">
	<!-- <datepicker wrapper-class="dp-class" placeholder="Seleccionar fecha inicial"></datepicker>
	<datepicker wrapper-class="dp-class" placeholder="Seleccionar fecha final"></datepicker>
	<DownloadExcel class="download-sorted-excel" sortBy="SessionId" sortName="sesión"/>
	<DownloadExcel class="download-sorted-excel" sortBy="Name" sortName="nombre" nameList="Dr PhD Jose Luis Gonzalez"/>
	<DownloadExcel class="download-sorted-excel" sortBy="Time" sortName="fecha" startTime="1593900773580" endTime="1594069811832"/> -->
	<h1>Descargar archivo .xlsx</h1>
	<h3>Seleccionar filtros:</h3>
	<div>
		<input type="radio" v-model="sortBy" value="" checked>
		<label class="label-class" for="noFilter">ninguno</label>
	</div>
	<div>
		<input type="radio" v-model="sortBy" value="Time">
		<label class="label-class" for="date">fecha</label>
	</div>
	<div class="date-selection">
		Seleccionar rango de fechas.
		<div class="inner-date">
			desde
			<datepicker @selected="changeStartTime" wrapper-class="dp-class" placeholder="fecha inicial"></datepicker>
		</div>
		<div class="inner-date">
			hasta
			<datepicker @selected="changeEndTime" wrapper-class="dp-class" placeholder="fecha final"></datepicker>
		</div>
	</div>
	<div>
		<input type="radio" v-model="sortBy" value="Name">
		<label class="label-class" for="usuario">usuario</label>
	</div>
	<br>
	<DownloadExcel class="download-sorted-excel" :sortBy="sortBy" :startTime="startTime" :endTime="endTime"/>
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
    return {
      startTime: new Date(0),
      endTime: new Date(),
      sortBy: '',
      sortString: '',
    }
  },
  methods: {
    changeStartTime (startTime) {
      this.startTime = startTime;
    },
    changeEndTime (endTime) {
      this.endTime = endTime;
    }
  },
}

</script>

<style scoped>

  input[type="radio"] {
    margin-right: 5px;
  }

  .download-dialog {
    display: inline-block;
    text-align: left;
    padding: 15px;
    margin-left: auto;
    margin-right: auto;
    max-width: 60%;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    border-radius: 5px;
  }

  .download-dialog:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }

  .date-selection {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: flex-start;

    padding-left: 30px;
    padding-right: 30px;
  }
  
  .inner-date {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
  }

  .inner-date > div {
    margin: 10px;
  }

  .dp-class {
    text-align: center;
    flex-grow: 1;
  }

  .label-class {
    display: inline-block;
    vertical-align: middle;
  }
</style>
