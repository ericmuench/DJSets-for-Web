import * as Bootstrap from '../../../public/style/bootstrap/bootstrap.bundle.min'

/**
 * This object manages all globally active Modals. This makes it able to kill Zombie-Modals --> They are produced by clicking the browser back button while a modal is open
 */
export default {
  activeModalIds: [],
  markAsActive (modalId) {
    this.activeModalIds.push(modalId)
  },
  markAsInactive (modalId) {
    const index = this.activeModalIds.indexOf(modalId)
    if (index >= 0) {
      this.activeModalIds.splice(index, 1)
    }
  },
  hideAllActiveModals () {
    this.activeModalIds.forEach(modalId => {
      const modal = Bootstrap.Modal.getInstance(document.getElementById(modalId))
      modal.hide()
    })
  }
}
