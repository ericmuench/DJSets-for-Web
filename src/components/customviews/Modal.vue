<template>
    <div class="modal fade" :id="modalToggleId" tabindex="-1" :aria-labelledby="contentDescription" aria-hidden="true">
        <div :class="['modal-dialog', modalType]">
            <div class="modal-content">
                <div class="modal-header bckgrnd-mediumgray">
                    <h2 class="bold-font modal-title text-light">{{title}}</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bckgrnd-mediumgray text-light">
                    <slot name="modal-content"></slot>
                </div>
                <div class="modal-footer bckgrnd-mediumgray">
                    <slot name="modal-footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import ModalManager from '../../businesslogic/util/ModalManager'

export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: 'Titel'
    },
    modalToggleId: {
      type: String,
      default: ''
    },
    contentDescription: {
      type: String,
      default: 'Dialogfenster'
    },
    modalType: {
      type: String,
      default: 'modal-xl'
    }
  },
  methods: {
    onModalShow () {
      ModalManager.markAsActive(this.modalToggleId)
      this.$emit('modalshow')
    },
    onModalDismiss () {
      ModalManager.markAsInactive(this.modalToggleId)
      this.$emit('modaldismiss')
    }
  },
  mounted () {
    const modal = document.getElementById(this.modalToggleId)
    modal.addEventListener('show.bs.modal', this.onModalShow)
    modal.addEventListener('hide.bs.modal', this.onModalDismiss)
  },
  beforeUnmount () {
    const modal = document.getElementById(this.modalToggleId)
    modal.removeEventListener('show.bs.modal', this.onModalShow)
    modal.removeEventListener('hide.bs.modal', this.onModalDismiss)
  }
}
</script>

<style scoped>
.btn-close{
  background-color: red;
}
</style>
