import { ConfigEnv, UserConfigExport, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import * as path from "path";
// import UnoCSS from "unocss/vite";
import Unocss from 'unocss/vite'

let resolve = (url: any) => path.resolve(__dirname, url);

export default (configEnv: ConfigEnv): UserConfigExport => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(configEnv.mode, process.cwd(), "");
  const { VITE_PORT, VITE_PUBLIC_PATH } = env;
  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "@": resolve("./src"),
        "@assets": resolve("./src/assets"),
      },
    },
    server: {
      https: false,
      host: true, // host: "0.0.0.0"
      port: Number(VITE_PORT),
      open: false,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:3000",
          ws: true,
          /** 是否允许跨域 */
          changeOrigin: true,
          rewrite: path => path.replace("/api", "")
        },
      },
    },
    build: {
      /** 消除打包大小超过 500kb 警告 */
      chunkSizeWarningLimit: 2000,
      /** Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效 */
      minify: "terser",
      /** 在打包代码时移除 console.log、debugger 和 注释 */
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
          pure_funcs: ["console.log"],
        },
        format: {
          /** 删除注释 */
          comments: false,
        },
      },
      /** 打包后静态资源目录 */
      assetsDir: "static",
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
      }),
      Unocss(),
    ],
  };
};
