<template>
  <Modal @modalshow="onShow" :title="modalTitle" :modalToggleId="modalToggleId">
    <template v-slot:modal-content>
      <form :class="[wasValidated ? 'was-validated' : '']">
          <label class="mt-3 h5 bold-font" for="title-description-view-input-title">Titel:</label>
          <input
            class="form-control text-light shadow-sm"
            type="text"
            autocomplete="off"
            placeholder="Bitte einen Titel angeben..."
            id="title-description-view-input-title"
            v-model="title"
            @input="onValidationFieldInputChanged"
            :class="[titleIsValid ? 'is-valid' : 'is-invalid', , 'needs-validation']"
            required>
          <label class="mt-3 h5 bold-font" for="title-description-view-input-title">Beschreibung:</label>
          <textarea
            rows="10"
            v-model="description"
            autocomplete="off"
            placeholder="Bitte eine Beschreibung angeben... (Optional)"
            class="form-control text-light shadow-sm"
            id="title-description-view-input-description"></textarea>
      </form>
    </template>
    <template v-slot:modal-footer>
      <div>
        <input class="mx-3 p-2 btn btn-secondary" type="button" data-bs-dismiss="modal" value="Abbrechen">
        <input
          class="p-2 btn btn-success"
          data-bs-dismiss="modal"
          type="submit"
          :disabled="!titleIsValid"
          @click.prevent="onMainActionTriggered"
          :value="mainActionTitle">
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from '../components/customviews/Modal'
import { isNotEmptyOrBlank } from '../businesslogic/util/StringUtils'

export default {
  name: 'TitleDescriptionView',
  components: {
    Modal
  },
  props: {
    modalTitle: {
      type: String,
      default: 'Titel und Beschreibung'
    },
    mainActionTitle: {
      type: String,
      default: 'Speichern'
    },
    shouldResetWhenOpened: {
      type: Boolean,
      default: false
    },
    modalToggleId: String,
    initTitle: {
      type: String,
      default: ''
    },
    initDescription: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      wasValidated: false,
      title: this.initTitle,
      description: this.initDescription
    }
  },
  methods: {
    onMainActionTriggered (e) {
      this.wasValidated = true
      this.$emit('mainaction', this.title, this.description)
    },
    onValidationFieldInputChanged () {
      this.wasValidated = false
    },
    onShow () {
      if (this.shouldResetWhenOpened) {
        this.reset()
      }
    },
    reset () {
      this.title = this.initTitle
      this.description = this.initDescription
    }
  },
  computed: {
    titleIsValid: function () {
      return isNotEmptyOrBlank(this.title)
    }
  }
}
</script>
