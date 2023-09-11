<template>
  <div class="container-fluid text-center">
  <h3>Benvenuti al sito di gestione delle richieste per LAB2GO 2023/2024</h3>
  <p>
    
    <div v-if="!user">Per accedere potete utilizzare la credenziali in calce alla mail relativa alla ricezione della richiesta di partecipazione.</div>
    <div v-else>Su questo sito potete attraverso le voci di menu:
        <ul>
          <li>"Richieste": visualizzare e eventualmente modificare le vostre richieste fino alla data di chiusura delle sottomissioni (30/09/2023)</li>
          <li>"Gestione" : in caso di accettazione della vostra richiesta, inserire e gestire la lista degli studenti partecipanti al progetto per la creazione dei relativi account wiki</li>
        </ul>
    </div>
    Per qualunque problema potete contattarci a <a href="mailto:info.lab2go@gmail.com">info.lab2go@gmail.com</a>
  </p>
</div>
</template>

<script>

// @ is an alias to /src
import useUser from '@/composables/user.composable';

export default {
  name: 'HomeView',
  setup(){
    const { user }=useUser()

    return{
      user
    }
  }
  
  
}
</script>

<style scoped>
ul{
  list-style-type: none;
  
}
</style>
