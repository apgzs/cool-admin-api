import * as ipdb from 'ipip-ipdb';

/**
 * 帮助类
 */
export default class Helper {
    /**
     * 获得请求IP
     */
    public static async getReqIP () {
        // @ts-ignore
        const req = this.ctx.req;
        return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress;
    }

    /**
     * 根据IP获得请求地址
     * @param ip 为空时则为当前请求的IP地址
     */
    public static async getIpAddr (ip?: string) {
        if (!ip) {
            ip = await this.getReqIP();
        }
        const bst = new ipdb.BaseStation('app/resource/ipip/ipipfree.ipdb');
        const result = bst.findInfo(ip, 'CN');
        let addr = '';
        if (result) {
            if (result.regionName === result.cityName) {
                addr = result.countryName + result.regionName;
            } else {
                addr = result.countryName + result.regionName + result.cityName;
            }
        }
        if (addr.indexOf('本机') !== -1) {
            addr = '本机地址';
            return addr;
        }
        if (addr.indexOf('局域网') !== -1) {
            addr = '局域网';
        }
        return addr;
    }
}
