import { BaseService } from '../../lib/base/service';

import * as uuid from 'uuid/v1';
import * as svgCaptcha from 'svg-captcha';
import * as svgToDataURL from 'svg-to-dataurl';

/**
 * 验证 Service
 */
export default class Verify extends BaseService {

    /**
     * 获得svg验证码  验证方式都换为小写比对  有效时间为30分钟
     * @param params type验证码类型，如需在<img src=""/>,src下直接赋值，可以传type值为 dataUrl
     */
    public async captcha (params) {
        const { type, width = 150, height = 50 } = params;
        svgCaptcha.options.width = width;
        svgCaptcha.options.height = height;
        const svg = svgCaptcha.create({ color: true, background: '#fff' });
        const result = {
            captchaId: uuid(),
            data: svg.data.replace(/\"/g, "'"),
        };
        if (type === 'dataUrl') {
            result.data = svgToDataURL(result.data);
        }
        await this.app.redisSet(`verify:img:${ result.captchaId }`, svg.text.toLowerCase(), 1800);
        return result;
    }

    /**
     * 检验图片验证码
     * @param captchaId 验证码ID
     * @param value 验证码
     */
    public async check (captchaId, value) {
        const rv = await this.app.redisGet(`verify:img:${ captchaId }`);
        if (!rv || !value || value.toLowerCase() !== rv) {
            return false;
        } else {
            this.app.redisDel(`verify:img:${ captchaId }`);
            return true;
        }
    }
}
