<template>
  <a
    :href="`${dataType},${encodeURIComponent(fileContent)}`"
    :download="fileName">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'DownloadTrigger',
  props: {
    fileName: {
      type: String,
      required: true
    },
    fileContent: {
      type: String,
      default: ''
    },
    dataType: {
      type: String,
      required: true
    }
  }
}
</script>
