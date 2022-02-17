<template>
    <div>
        <BuyerTable />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import BuyerTable from "@/components/Buyer/BuyerTable"
export default defineComponent({
    name:"Buyer",
    components: {
        BuyerTable
    }
})
</script>