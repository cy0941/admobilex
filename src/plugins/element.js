import { ElTable, ElTableColumn, ElMessage, ElMessageBox, ElTooltip,ElPopover,ElPopconfirm,ElEmpty } from "element-plus";
import lang from "element-plus/lib/locale/lang/zh-cn";
import locale from "element-plus/lib/locale";

export default (app) => {
    locale.use(lang);
    app.config.globalProperties.$message = ElMessage;
    app.component(ElTable.name, ElTable)
    app.component(ElTooltip.name, ElTooltip)
    app.component(ElMessage.name, ElMessage)
    app.component(ElTableColumn.name, ElTableColumn)
    app.component(ElMessageBox.name, ElMessageBox)
    app.component(ElPopover.name, ElPopover)
    app.component(ElPopconfirm.name, ElPopconfirm)
    app.component(ElEmpty.name, ElEmpty)
};