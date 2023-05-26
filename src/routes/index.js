
const coursesRouter = require('./courses');
const siteRouter = require('./site');
const meRouter = require('./me');
const userRouter =require('./user')


function route(app) {
    app.use('/', siteRouter);
    app.use('/courses', coursesRouter);
    app.use('/me',meRouter );
    app.use('/user', userRouter)
    
};

module.exports = route;



