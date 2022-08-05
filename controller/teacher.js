const teacherModel = require("../model/teacher");
const Joi = require("joi");

const schemaTeacher = Joi.object().keys({
  // schema for joi validate required fields
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  phd: Joi.boolean().required(),
});

exports.getAllTeachers = (req, res) => {
  let query = { status: 1 }; //  define query and projection for search
  let projection = { _id: 1, id: 1, name: 1, lastName: 1, phd: 1 };

  return teacherModel.getAll(res, query, projection); // send search to model
};

exports.getFilteredTeacher = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query and projection for search
  let projection = { _id: 1, id: 1, name: 1, lastName: 1, phd: 1 };

  return teacherModel.getFiltered(res, query, projection); // send search to model
};

exports.postTeacher = (req, res) => {
  // joi check the required fields
  Joi.validate(req.body, schemaTeacher, (err, result) => {
    if (!err) {
      return teacherModel.post(req, res); // return post to model
    } else {
      res.status(422).json({
        // send joi error message
        message: "Não foi possível inserir o professor",
        error: err.message,
      });
    }
  });
};

exports.putTeacher = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query for search and update

  Joi.validate(req.body, schemaTeacher, (err, result) => {
    // joi check the required fields
    if (!err) {
      return teacherModel.put(req, res, query); // send put to model
    } else {
      res.status(422).json({
        // send joi error message
        message: "Não foi possível inserir o professor",
        error: err.message,
      });
    }
  });
};

exports.deleteTeacher = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query and set for search and delete

  return teacherModel.remove(req, res, query); // send delete request to model
};

exports.jsonAllTeachers = (req, res) => {
  let query = { status: 1 }; //  define query and projection for search
  let projection = { _id: 1, id: 1, name: 1, lastName: 1, phd: 1 };
  return teacherModel.jsonAll(res, query, projection); // send search to model
};

exports.jsonFilteredTeacher = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query and projection for search
  let projection = { _id: 1, id: 1, name: 1, lastName: 1, phd: 1 };
  return teacherModel.jsonFiltered(res, query, projection); // send search to model
};
