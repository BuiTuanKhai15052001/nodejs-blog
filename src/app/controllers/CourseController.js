const { query } = require('express');
const Course = require('../models/Course');

const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');

class CourseController {
   //[GET] courses/:slug
   show(req, res, next) {
      Course.findOne({ slug: req.params.slug })
         .then((course) => {
            res.render('courses/show', { course: mongooseToObject(course) })
         })
         .catch(next);
   }

   //[GET]
   create(req, res, next) {
      res.render('courses/create');
   }
   //[POST]
   store(req, res) {
      const formData = req.body;
      formData.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
      const course = new Course(formData);
      course.save()
         .then(() => res.redirect('/'))
         .catch(error => {

         })
   }

   edit(req, res, next) {
      Course.findById(req.params.id)
         .then(courses => res.render('courses/edit',
            {
               courses: mongooseToObject(courses)
            }))
         .catch(next)
   }

   update(req, res, next) {
      console.log(req.body);
      console.log(req.params.id);

      const { videoId } = req.body;

      Course.updateOne({ _id: req.params.id }, {
         ...req.body,
         image: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      })
         .then(() => res.redirect('/me/stored/courses'))
         .catch(next);
   }

   destroy(req, res, next) {
      Course.delete({ _id: req.params.id })
         .then(() => res.redirect('back'))
         .catch(next);
   }


   forceDestroy(req, res, next) {
      Course.deleteOne({ _id: req.params.id })
         .then(() => res.redirect('back'))
         .catch(next);
   }

   restore(req, res, next) {
      Course.restore({ _id: req.params.id })
         .then(() => res.redirect('back'))
         .catch(next);
   }

};

module.exports = new CourseController;












