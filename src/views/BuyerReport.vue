<template>
  <div>
      <Report :type="1"/>
  </div>
</template>

<script>
import {defineComponent} from "vue"
import Report from "@/components/Report/Report"
export default defineComponent ({
    name:"BuyerReport",
    components: {
        Report
    }
})
</script>