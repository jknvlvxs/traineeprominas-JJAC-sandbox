const userModel = require("../model/user");
const Joi = require("joi");

const schemaUser = Joi.object().keys({
  // schema for joi validate required fields
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  profile: Joi.string().required(),
});

exports.getAllUsers = (req, res) => {
  let query = { status: 1 }; //  define query and projection for search
  let projection = { _id: 1, id: 1, name: 1, lastName: 1, profile: 1 };
  return userModel.getAll(res, query, projection); // send search to model
};

exports.getFilteredUser = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query and projection for search
  let projection = { _id: 1, id: 1, name: 1, lastName: 1, profile: 1 };
  return userModel.getFiltered(res, query, projection); // send search to model
};

exports.postUser = (req, res) => {
  Joi.validate(req.body, schemaUser, (err, result) => {
    if (!err) return userModel.post(req, res);
    else res.status(422).json({ message: "Não foi possível inserir o usuário", error: err.message });
  });
};

exports.putUser = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query for search and update
  Joi.validate(req.body, schemaUser, (err, result) => {
    // joi check the required fields
    if (!err) {
      return userModel.put(req, res, query); // send put to model
    } else {
      res.status(422).json({
        // send joi error message
        message: "Não foi possível editar o usuário",
        error: err.message,
      });
    }
  });
};

exports.deleteUser = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query for search and delete
  return userModel.remove(res, query); // send delete request to model
};

exports.jsonAllUsers = (req, res) => {
  let query = { status: 1 }; //  define query and projection for search
  let projection = { _id: 1, id: 1, name: 1, lastName: 1, profile: 1 };
  return userModel.jsonAll(res, query, projection); // send search to model
};

exports.jsonFilteredUser = (req, res) => {
  let query = { _id: req.params.id, status: 1 }; //  define query and projection for search
  let projection = { _id: 1, id: 1, name: 1, lastName: 1, profile: 1 };
  return userModel.jsonFiltered(res, query, projection); // send search to model
};
