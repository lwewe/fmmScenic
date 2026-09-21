module.exports = {
    // 打包配置
    // defineConfig: {
    transpileDependencies: true,
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    // },
    // 其他配置项
    devServer: {
        client: {
            overlay: false,
        },
        proxy: {
            '/newmovie': {
                target: 'https://api.qipiao.net/', // 目标服务器地址
                // target: 'https://channel.youpiaopiao.cn', // 目标服务器地址
                changeOrigin: true,
                pathRewrite: {
                    '^/newmovie': '', // 将请求路径中的 '/api' 替换为空
                },
            },
            '/movie': {
                // target: 'https://test-open.xuankua.cn', // 目标服务器地址
                target: 'https://open.xuankua.cn', // 目标服务器地址
                changeOrigin: true,
                pathRewrite: {
                    '^/movie': '', // 将请求路径中的 '/api' 替换为空
                },
            },
            '/api': {
                // target: 'http://192.168.3.7', // 目标服务器地址
                target: 'https://sc.bjyxfl.com', // 目标服务器地址
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '', // 将请求路径中的 '/api' 替换为空
                },
            }
        },

   
    },
         configureWebpack: {
            externals: {
                "BMap": "BMap"
            }
        }
}
