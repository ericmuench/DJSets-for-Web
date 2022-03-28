<template>
  <div class="bckgrnd-mediumgray text-light p-3 min-vh-100">
    <SettingsImportExportSection />
    <SettingsDangerZoneSection />
  </div>
</template>

<script>
import SettingsImportExportSection from '../components/settings/SettingsImportExportSection.vue'
import SettingsDangerZoneSection from '../components/settings/SettingsDangerZoneSection.vue'
export default {
  name: 'SettingsMenuView',
  components: {
    SettingsImportExportSection,
    SettingsDangerZoneSection
  }
}
</script>
