module.exports = {
    devServer: {
        port: 3000,
        disableHostCheck: true,
    },
    publicPath: './',
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        'primary-color':'#3c56cc',
                        'link-color':'#3c56cc',
                        'btn-primary-bg':'#3c56cc',
                        'layout-body-background':"color(~`colorPalette('@{link-color}', 1) `)",
                        'border-radius-base':'8px',
                        'font-size-base':'14px',
                        'font-size-sm':'12px',
                        'input-height-base':'32px',
                        'btn-font-size-sm':'12px',
                        /* 'dropdown-menu-bg':'#58bfc1', */
                        'dropdown-selected-color': "color(~`colorPalette('@{link-color}', 1) `)",
                        'menu-popup-bg':"color(~`colorPalette('@{link-color}', 1) `)",
                        'select-background':"color(~`colorPalette('@{link-color}', 1) `)",
                        'input-bg':"color(~`colorPalette('@{link-color}', 1) `)",
                        'menu-item-active-bg':"color(~`colorPalette('@{link-color}', 1) `)",
                        'input-border-color':"color(~`colorPalette('@{link-color}', 1) `)",
                        'select-border-color':"color(~`colorPalette('@{link-color}', 1) `)",
                        'breadcrumb-base-color':'#3c56cc',
                        'breadcrumb-last-item-color':'#7f857c',
                        'breadcrumb-link-color':'#3c56cc',
                        'breadcrumb-link-color-hover':"color(~`colorPalette('@{link-color}', 5) `)",
                        'breadcrumb-separator-color':'#3c56cc'
                        
                    },
                    javascriptEnabled: true,
                },
            },
        },
    },
}
