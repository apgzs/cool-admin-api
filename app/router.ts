import { Application } from 'egg';
import { initRouter } from '../app/lib/router';

export default (app: Application) => {
    initRouter(app);
};
