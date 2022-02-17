<template>
  <div>
      <Report :type="2"/>
  </div>
</template>

<script>
import {defineComponent} from "vue"
import Report from "@/components/Report/Report"
export default defineComponent ({
    name:"MaterialReport",
    components: {
        Report
    }
})
</script>