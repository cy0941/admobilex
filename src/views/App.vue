<template>
    <div>
        <AppTable/>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import AppTable from "@/components/APP/AppTable"
export default defineComponent({
    name:"App",
    components: {
        AppTable
    }
})
</script>