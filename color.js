const path = require('path');
const { generateTheme } = require('antd-theme-generator');
// ant-design-vue/dist/antd.less
const options = {
  antDir: path.join(__dirname, './node_modules/ant-design-vue'), //对应具体位置
  stylesDir: path.join(__dirname, './src/assets/styles'),    //对应具体位置
  varFile: path.join(__dirname, './src/assets/styles/variables.less'), //对应具体位置
  mainLessFile: path.join(__dirname, './src/assets/styles/index.less'), //对应具体位置
  themeVariables: [
    '@primary-color',
    '@secondary-color',
    '@text-color',
    '@text-color-secondary',
    '@heading-color',
    '@layout-body-background',
    '@btn-primary-bg',
    '@layout-header-background',
    '@border-radius-base',
    '@link-color',
    '@select-background',
    '@input-bg',
    '@breadcrumb-base-color',
    '@breadcrumb-last-item-color',
    '@breadcrumb-link-color',
    '@breadcrumb-link-color-hover',
    '@breadcrumb-separator-color',
    '@menu-popup-bg',
    '@menu-item-active-bg',
    '@input-border-color',
    '@select-border-color'
  ],
  indexFileName: 'index.html',
  outputFilePath: path.join(__dirname, './public/color.less'),
}
generateTheme(options).then(() => {
  console.log('Theme generated successfully888');
})
.catch(error => {
  console.log('Error', error);
});
