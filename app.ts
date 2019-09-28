import * as moment from 'moment';

export default app => {
    const ctx = app.createAnonymousContext();
    app.beforeStart(async () => {
        ctx.logger.info('beforeStart');
        // 格式化时间
        Date.prototype.toJSON = function () {
            return moment(this).format('YYYY-MM-DD HH:mm:ss');
        };
    });

    app.ready(async () => {
        ctx.logger.info('=====service start succeed=====');
    });

    app.beforeClose(async () => {
        ctx.logger.info('beforeClose');
    });
};
