import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    config.keys = appInfo.name + '_1566960005072_482';

    // 中间件
    config.middleware = [ 'exception' ];

    config.jwt = {
        secret: 'KFHJALFLAJFJLF',
    };

    config.security = {
        csrf: {
            enable: false,
        },
    };

    const whitelist = [
        // images
        '.jpg', '.jpeg', // image/jpeg
        '.png', // image/png, image/x-png
        '.gif', // image/gif
        '.bmp', // image/bmp
        '.wbmp', // image/vnd.wap.wbmp
        '.webp',
        '.tif',
        '.psd',
        // text
        '.svg',
        '.js', '.jsx',
        '.json',
        '.css', '.less',
        '.html', '.htm',
        '.xml',
        // tar
        '.zip',
        '.gz', '.tgz', '.gzip',
        // video
        '.mp3',
        '.mp4',
        '.avi',
        '.xlsx',
        '.xls',
    ];

    config.multipart = {
        fileSize: '100mb',
        mode: 'file',
        whitelist,
    };

    config.redis = {
        client: {
            port: 6379,
            host: '127.0.0.1',
            password: '',
            db: 0,
        },
    };
    // 新增特殊的业务配置
    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${ appInfo.name }`
    };

    return {
        ...config,
        ...bizConfig,
    };
};
