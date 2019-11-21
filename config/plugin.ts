import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    typeorm: {
        enable: true,
        package: 'egg-ts-typeorm',
    },
    jwt: {
        enable: true,
        package: 'egg-jwt',
    },
    oss: {
        enable: true,
        package: 'egg-oss',
    },
};

export default plugin;
