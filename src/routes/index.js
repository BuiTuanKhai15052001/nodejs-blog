
const coursesRouter = require('./courses');
const siteRouter = require('./site');
const meRouter = require('./me');






function route(app) {
    app.use('/', siteRouter);
    // app.use('/news', newsRouter);
    app.use('/courses', coursesRouter);
    app.use('/me',meRouter );
    
};

module.exports = route;



