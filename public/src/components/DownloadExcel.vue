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
  props : ['sortBy', 'sortName', 'nameList', 'startTime', 'endTime'],
  data() {
    return {
      users: [],
      json_fields: {
	'No. sesión': 'SessionId',
	'Nombre de usuario': 'Name',
	'Fecha': 'Date',
	'Hora': 'Hour',
	'No. interacción': 'index',
        'Escrito usuario': 'TextQuery',
        'Escrito agente': 'IntentName',
        'Certidumbre': 'Confidence'
      },
    };
  },
  firebase() {
//    // ordenar por sesion
//    var users = usersRef.orderByChild('SessionId');
//    // obtener la lista de queries
//    users.once('value', function(snapshot) {
//      // contador para el indice
//      var i = 1;
//      // variable para comparar sesion
//      var tempkey = '';
//      // iterar sobre la lista de queries
//      snapshot.forEach(function(childSnap) {
//	// incrementar el indice o reiniciarlo
//	if (tempkey == childSnap.val()['SessionId']) {
//		i++;
//	} else {i = 1;}
//	// actualizar variable para sesion
//	tempkey = childSnap.val()['SessionId'];
//	// agregar indice a los datos
//	usersRef.child(childSnap.key).child('index').set(i);
//      });
//    });
//    
//    if (this.sortBy) {
//      return {
//           users: usersRef.orderByChild(this.sortBy),
//      }
//    } else {
//      return {
//         users: users
//      }
//    }
      var users = usersRef.orderByChild(this.sortBy);
      if (this.sortBy == 'Time') {
	// es un query, entonces se necesita usar el ref para accesar los datos
	users = users.startAt(this.startTime).endAt(this.endTime).ref;
	return {
	  users: users,
	}
      } else if (this.sortBy == 'Name') {
	return {
	  users: users.equalTo(this.nameList),
	}
      } else {
	return {
	  users: users,
	}
      }
  }
};

</script>

<style scoped>  /* "scoped" attribute limit the CSS to this component only */
  .download-excel {
    margin-top: 30px;
  }
</style>
