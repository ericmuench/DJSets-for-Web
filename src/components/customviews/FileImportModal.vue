<template>
  <Modal :modalToggleId="modalToggleId" :title="title" modalType="modal-scrollable modal-fullscreen">
    <template v-slot:modal-content>
      <input
        type="file"
        :accept="acceptedTypes"
        @change="onImportFileChanged"
        class="form-control text-light shadow-sm"/>
      <slot name="fileData"></slot>
    </template>
    <template v-slot:modal-footer>
      <input class="py-2 px-3 btn btn-secondary" type="button" value="Abbrechen" data-bs-dismiss="modal">
      <button
        v-if="mainActions.length == 1"
        :disabled="canImportData"
        class="btn btn-success"
        data-bs-dismiss="modal"
        @click="mainActions[0].onClick">{{mainActions[0].title}}</button>
      <DropDownButton
        v-else-if="mainActions.length > 1"
        title='Importieren'
        buttonStyle="btn-success"
        :items="mainActions"
        :disabled="!canImportData">
        <template v-slot:item="{ item }">
          <div data-bs-dismiss="modal" @click="item.onClick">{{item.title}}</div>
        </template>
      </DropDownButton>
    </template>
  </Modal>
</template>

<script>
import Modal from './Modal'
import DropDownButton from './DropDownButton'
import { isNotEmptyOrBlank } from '../../businesslogic/util/StringUtils'

export default {
  name: 'FileImportModal',
  components: {
    Modal,
    DropDownButton
  },
  props: {
    modalToggleId: {
      type: String,
      required: true
    },
    title: String,
    mainActions: {
      type: Array,
      default: () => []
    },
    fileInputParser: {
      type: Function,
      default: () => {}
    },
    acceptedTypes: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      fileContent: '',
      fileData: null,
      fileReader: new FileReader()
    }
  },
  methods: {
    onImportFileChanged (ev) {
      this.reset()
      if (ev.target.files[0] instanceof Blob) {
        this.fileReader.readAsText(ev.target.files[0])
      }
    },
    onLoadFileContent (ev) {
      this.fileContent = ev.target.result
      this.fileData = this.fileInputParser(this.fileContent)
      this.$emit('filedatachanged', this.fileData)
    },
    reset () {
      this.fileContent = ''
      this.fileData = null
      this.$emit('filedatachanged', this.fileData)
    }
  },
  computed: {
    canImportData () {
      return this.fileData !== null && isNotEmptyOrBlank(this.fileContent)
    }
  },
  created () {
    this.fileReader.onload = this.onLoadFileContent
  }
}
</script>
