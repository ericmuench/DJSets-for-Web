<template>
  <div @click="onChangeCheckedByClick" :class="[isChecked ? 'bckgrnd-accent-hoverable' : 'bckgrnd-darkgray-hoverable', 'd-sm-flex align-items-center py-2 px-3 shadow-sm rounded']">
    <div class="flex-grow-1">
      <h4 class="bold-font">{{title}}</h4>
      <h6 class="lighter-font">{{subtitle}}</h6>
    </div>
    <input type="checkbox" class="form-check-input" :checked="isChecked"/>
  </div>
</template>

<script>
export default {
  name: 'CheckableSimpleItem',
  /* model: {
    prop: 'isChecked',
    event: 'click'
  }, */
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    subtitle: {
      type: String,
      default: 'Subtitle'
    },
    isChecked: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      checked: this.isChecked
    }
  },
  methods: {
    onChangeCheckedByClick () {
      const emitEvent = (!this.isChecked) ? 'check' : 'uncheck'
      this.$emit(emitEvent)
    }
  }
}
</script>

<style scoped>
div{
  word-break: break-all;
}

.form-check-input{
  width: 24px;
  height: 24px;
}
</style>
