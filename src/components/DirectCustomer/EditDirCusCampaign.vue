<template>
    <div class="editDirCusCampaign">
        <a-tabs type="card" v-model:activeKey="activeKey">
            <a-tab-pane key="1" :tab="$t('home.DirCusCampaigns')">
                <CreateDirCusCampaign :type="1"/>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="$t('newCampaign.creatives')">
                <CreateProduction :type="1"/>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
import CreateDirCusCampaign from "@/components/DirectCustomer/CreateDirCusCampaign"
import CreateProduction from "@/components/DirectCustomer/CreateProduction"
import { useRoute } from 'vue-router'
import { defineComponent, ref , onMounted } from 'vue';
import store from "@/store";
export default defineComponent({
    setup() {
        const route = useRoute();
        const activeKey = ref('1');
        onMounted(() => {
            activeKey.value=route.query.activeKey;
        });

        return {
            activeKey
        };
    },
    components: {
        CreateDirCusCampaign,
        CreateProduction
    }
});
</script>

<style scoped>
    @import "../../assets/css/index.css";
</style>