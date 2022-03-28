<template>
  <div class="shadow-sm rounded m-1 bckgrnd-darkgray-hoverable p-2 d-flex">
    <p class="h5 mx-3 my-auto">{{displayIndex}}</p>
    <div class="d-flex flex-wrap flex-grow-1">
      <div class="col-sm-5 flex-grow-1">
          <h5 class="m-0 bold-font break-word" >{{title}}</h5>
          <p class="m-0 lighter-font break-word">{{artist}}</p>
      </div>
      <div class="col-sm-5 d-flex flex-wrap">
        <p class="my-auto me-4 text-blue break-word">{{tempo}} BPM</p>
        <p class="my-auto me-4 text-danger break-word">{{musicscaleRepresentation}}</p>
        <p class="my-auto me-4 text-green break-word">{{durationString}}</p>
        <p class="my-auto me-4 text-yellow break-word">{{genre}}</p>
      </div>
    </div>
    <IconedButton
      @click.prevent="onBtnDismissClicked"
      class="my-auto"
      icName='ICClose.svg'
      :icSize='20'/>
  </div>
</template>

<script>
import IconedButton from './customviews/IconedButton'
export default {
  name: 'SongDetailItem',
  components: {
    IconedButton
  },
  props: {
    displayIndex: Number,
    title: String,
    artist: String,
    tempo: Number,
    musicscaleRepresentation: String,
    durationString: String,
    genre: String

  },
  methods: {
    onBtnDismissClicked () {
      this.$emit('dismiss')
    }
  }
}
</script>

<style scoped>
.text-blue{
    color: var(--colorBlue);
}

.text-green{
    color: var(--colorGreen);
}

.text-yellow{
    color: var(--colorYellow);
}
</style>
