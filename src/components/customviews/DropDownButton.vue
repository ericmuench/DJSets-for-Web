<template>
  <div>
    <button
      type="button"
      :disabled="isDisabled"
      :class="[buttonStyle, 'btn text-light dropdown-toggle']"
      data-bs-toggle="dropdown">
      {{title}}
    </button>
    <ul class="bckgrnd-lightgray dropdown-menu">
      <li
        class="text-light dropdown-item"
        v-for="item of items"
        :key="item.title">
        <slot name="item" :item="item"></slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DropDownButton',
  props: {
    title: String,
    items: {
      type: Array,
      default: () => []
    },
    buttonStyle: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isDisabled () {
      return this.disabled
    }
  }
}
</script>
