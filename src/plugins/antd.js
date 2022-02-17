// import 'ant-design-vue/dist/antd.less';
import {
    Button,
    Layout,
    Image,
    Menu,
    Dropdown,
    Breadcrumb,
    Input,
    Select,
    Form,
    Divider,
    Modal,
    Radio,
    DatePicker,
    ConfigProvider,
    Table,
    Checkbox,
    Popover,
    Tabs,
    Upload,
    Collapse,
    Tree,
    Pagination,
    Spin,
    Message,
    AutoComplete,
    Empty,
    Badge,
    Drawer,
    Icon,
    Switch,
    Popconfirm,
    Tooltip,
    Progress,
    Space,
    Avatar
} from "ant-design-vue";
export default (app) => {
    console.log(Menu);

    app.config.globalProperties.$confirm = Modal.confirm;
    app.component(Button.name, Button)
    app.component(Layout.name, Layout)
    app.component(Layout.Content.name, Layout.Content)
    app.component(Layout.Header.name, Layout.Header)
    app.component(Layout.Sider.name, Layout.Sider)
    app.component(Image.name, Image)
    app.component(Menu.name, Menu)
    app.component(Menu.SubMenu.name, Menu.SubMenu)
    app.component(Menu.Item.name, Menu.Item)
    app.component(Menu.ItemGroup.name, Menu.ItemGroup)
    app.component(Dropdown.name, Dropdown)
    app.component(Dropdown.Button.name, Dropdown.Button)
    app.component(Breadcrumb.name, Breadcrumb)
    app.component(Breadcrumb.Item.name, Breadcrumb.Item)
    app.component(Input.name, Input)
    app.component(Input.Search.name, Input.Search)
    app.component(Input.Password.name, Input.Password)
    app.component(Select.name, Select)
    app.component(Select.Option.displayName, Select.Option)
    app.component(Form.name, Form)
    app.component(Form.Item.name, Form.Item)
    app.component(Modal.name, Modal)
    app.component(Radio.name, Radio)
    app.component(Radio.Group.name, Radio.Group)
    app.component(Radio.Button.name, Radio.Button)
    app.component(Divider.name, Divider)
    app.component(DatePicker.name, DatePicker)
    app.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
    app.component(ConfigProvider.name, ConfigProvider)
    app.component(Table.name, Table)
    app.component(Table.Column.name, Table.Column)
    app.component(Table.ColumnGroup.name, Table.ColumnGroup)
    app.component(Checkbox.name, Checkbox)
    app.component(Checkbox.Group.name, Checkbox.Group)
    app.component(Popover.name, Popover)
    app.component(Tabs.name, Tabs)
    app.component(Tabs.TabContent.name, Tabs.TabContent)
    app.component(Tabs.TabPane.name, Tabs.TabPane)
    app.component(Upload.name, Upload)
    app.component(Upload.Dragger.name, Upload.Dragger)
    app.component(Collapse.name, Collapse)
    app.component(Collapse.Panel.name, Collapse.Panel)
    app.component(Tree.name, Tree)
    app.component(Tree.DirectoryTree.name, Tree.DirectoryTree)
    app.component(Tree.TreeNode.name, Tree.TreeNode)
    app.component(Pagination.name, Pagination)
    app.component(Spin.name, Spin)
    app.component(AutoComplete.name, AutoComplete)
    app.component(Empty.displayName, Empty)
    app.component(AutoComplete.Option.displayName, AutoComplete.Option)
    app.component(Badge.name, Badge)
    app.component(Badge.Ribbon.name, Badge.Ribbon)
    app.component(Drawer.name, Drawer)
    app.component(Icon.name, Icon)
    app.component(Switch.name, Switch)
    app.component(Popconfirm.name, Popconfirm)
    app.component(Tooltip.name, Tooltip)
    app.component(Progress.name, Progress)
    app.component(Message.name, Message)
    app.component(Space.name, Space)
    app.component(Avatar.name, Avatar)
};