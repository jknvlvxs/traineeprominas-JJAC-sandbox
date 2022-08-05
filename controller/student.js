const studentModel = require("../model/student");
const courseModel = require("../model/course");
const Joi = require("joi");

const schemaStudent = Joi.object().keys({
  // schema for joi validate required fields
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number().required(),
  course: Joi.any().required(),
});

exports.getAllStudents = (req, res) => {
  let query = { status: 1 }; //  define query and projection for search
  let projection = {
    _id: 1,
    name: 1,
    lastName: 1,
    age: 1,
    course: 1,
  };
  return studentModel.getAll(res, query, projection); // send search to model
};

exports.getFilteredStudent = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query and projection for search
  let projection = {
    _id: 1,
    name: 1,
    lastName: 1,
    age: 1,
    course: 1,
  };
  return studentModel.getFiltered(res, query, projection); // send search to model
};

exports.postStudent = (req, res) => {
  (async () => {
    req.body.course = (await courseModel.getCourse(req.body.course))._id;

    Joi.validate(req.body, schemaStudent, (err, result) => {
      // joi check the required fields
      if (!err) {
        return studentModel.post(req, res); // return post to model
      } else {
        res.status(422).json({
          // send joi error message
          message: "Não foi possível inserir o curso",
          error: err.message,
        });
      }
    });
  })();
};

exports.putStudent = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query for search and update
  (async () => {
    req.body.course = (await courseModel.getCourse(req.body.course))._id;

    Joi.validate(req.body, schemaStudent, (err, result) => {
      // joi check the required fields
      if (!err) {
        return studentModel.put(req, res, query); // return post to model
      } else {
        res.status(422).json({
          // send joi error message
          message: "Não foi possível inserir o curso",
          error: err.message,
        });
      }
    });
  })();
};

exports.deleteStudent = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query for search and delete
  return studentModel.remove(res, query); // send delete request to model
};

exports.jsonAllStudents = (req, res) => {
  let query = { status: 1 }; //  define query and projection for search
  let projection = {
    _id: 1,
    name: 1,
    lastName: 1,
    age: 1,
    "course._id": 1,
    "course.name": 1,
    "course.period": 1,
    "course.city": 1,
    "course.teacher._id": 1,
    "course.teacher.name": 1,
    "course.teacher.lastName": 1,
    "course.teacher.phd": 1,
  };
  return studentModel.jsonAll(res, query, projection); // send search to model
};

exports.jsonFilteredStudent = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query and projection for search
  let projection = {
    _id: 1,
    name: 1,
    lastName: 1,
    age: 1,
    "course._id": 1,
    "course.name": 1,
    "course.period": 1,
    "course.city": 1,
    "course.teacher._id": 1,
    "course.teacher.name": 1,
    "course.teacher.lastName": 1,
    "course.teacher.phd": 1,
  };
  return studentModel.jsonFiltered(res, query, projection); // send search to model
};
