module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": true },"ant-design-vue"],// `style: true` 会加载 less 文件
    ["import",{"libraryName": 'element-plus',customStyleName: (name) => { return `element-plus/lib/theme-chalk/${name}.css`}},"element-plus"],
  ]
}
