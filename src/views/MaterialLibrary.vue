<template>
    <div>
        <MaterialList :type="2"/>
    </div>
</template>

<script>
import {defineComponent} from "vue"
import MaterialList from "@/components/MaterialLibrary/MaterialList"
export default defineComponent ({
    name:"MaterialLibrary",
    components: {
        MaterialList
    }
})
</script>