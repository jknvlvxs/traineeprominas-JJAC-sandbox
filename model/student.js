const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courseSchema = require("./course").courseSchema;

studentSchema = new Schema(
  {
    name: { type: String },
    lastName: { type: String },
    age: {
      type: Number,
      min: [
        17,
        "A idade inserida é {VALUE} anos de idade, a idade mínima permitida é 17!",
      ],
    },
    course: { type: ObjectID },
    status: { type: Number },
  },
  { versionKey: false }
);

const Student = mongoose.model("Student", studentSchema, "student");

getAll = (res, query, projection) => {
  return Student.find(query, projection)
    .then((students) => {
      if (students.length > 0) {
        res.status(200).json(students);
      } else {
        res.status(404).json("Nenhum estudante cadastrado");
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection student: ", err);
      res.status(500);
    });
};

getFiltered = (res, query, projection) => {
  return Student.find(query, projection)
    .then((student) => {
      if (student.length > 0) {
        res.status(200).json(student);
      } else {
        res.status(404).json("O estudante não foi encontrado");
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection student: ", err);
      res.status(500);
    });
};

post = (req, res) => {
  var student = new Student({
    name: req.body.name,
    lastName: req.body.lastName,
    age: req.body.age,
    course: req.body.course,
    status: 1,
  });
  student.validate((error) => {
    if (!error) {
      return Student.create(student)
        .then((result) => {
          res.status(201).json(student);
        })
        .catch((err) => {
          console.error("Erro ao conectar a collection student: ", err);
          res.status(500);
        });
    } else {
      try {
        res.status(401).json({
          message: "Não foi possível cadastrar o estudante",
          error: [error.errors.course.message, error.errors.age.message],
        });
      } catch (TypeError) {
        try {
          res.status(401).json({
            message: "Não foi possível cadastrar o estudante",
            error: error.errors.course.message,
          });
        } catch (TypeError) {
          res.status(401).json({
            message: "Não foi possível cadastrar o estudante",
            error: error.errors.age.message,
          });
        }
      } finally {
      }
    }
  });
};

put = (req, res, query) => {
  var student = {
    id: req.params.id,
    name: req.body.name,
    lastName: req.body.lastName,
    age: req.body.age,
    course: req.body.course,
    status: 1,
  };
  var validate = new Student(student);
  validate.validate((error) => {
    if (!error) {
      return Student.findOneAndUpdate(query, { $set: student })
        .then((result) => {
          if (result) {
            res.status(200).json(student);
          } else {
            res.status(401).json("Não é possível editar estudante inexistente");
          }
        })
        .catch((err) => {
          console.error("Erro ao conectar a collection student: ", err);
          res.status(500);
        });
    } else {
      try {
        res.status(401).json({
          message: "Não foi possível cadastrar o estudante",
          error: [error.errors.course.message, error.errors.age.message],
        });
      } catch (TypeError) {
        try {
          res.status(401).json({
            message: "Não foi possível cadastrar o estudante",
            error: error.errors.course.message,
          });
        } catch (TypeError) {
          res.status(401).json({
            message: "Não foi possível cadastrar o estudante",
            error: error.errors.age.message,
          });
        }
      }
    }
  });
};

remove = (res, query) => {
  return Student.findOneAndUpdate(query, { $set: { status: 0 } })
    .then((result) => {
      if (result) {
        // if student exists
        console.log("O estudante foi removido");
        res.status(200).json("O estudante foi removido com sucesso");
      } else {
        console.log("Nenhum estudante foi removido");
        res.status(204).json();
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection student: ", err);
      res.status(500);
    });
};

exports.updateCourse = async (id, set) => {
  return await Student.findOneAndUpdate(
    { "course.id": id, status: 1 },
    { $set: { "course.$": set } }
  );
};

exports.deleteCourse = async (id) => {
  return await Student.findOneAndUpdate(
    { "course.id": id, status: 1 },
    { $set: { status: 0 } }
  );
};

exports.updateTeacher = async (course, session) => {
  return await Student.findOneAndUpdate(
    { status: 1, "course.id": course.id },
    { $set: { "course.$": course } }
  ).session(session);
};

jsonAll = (res, query, projection) => {
  return Student.find(query, projection)
    .then((students) => {
      if (students.length > 0) {
        res.json(students);
      } else {
        res.status(404).json();
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection student: ", err);
      res.status(500);
    });
};

jsonFiltered = (res, query, projection) => {
  return Student.find(query, projection)
    .then((student) => {
      if (student.length > 0) {
        res.json(student);
      } else {
        res.status(404).json();
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection student: ", err);
      res.status(500);
    });
};

module.exports = {
  studentSchema,
  getAll,
  getFiltered,
  post,
  put,
  remove,
  jsonAll,
  jsonFiltered,
};
