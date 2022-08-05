const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const teacherSchema = require("./teacher").teacherSchema;

courseSchema = new Schema(
  {
    name: { type: String },
    period: { type: Number },
    city: { type: String },
    teacher: {
      type: [teacherSchema],
      validate: [
        (val) => val.length >= 2,
        "São necessários pelo menos 2 professores válidos",
      ],
    },
    status: { type: Number },
  },
  { versionKey: false }
);

const Course = mongoose.model("Course", courseSchema, "course");

const studentModel = require("./student");

getAll = (res, query, projection) => {
  return Course.find(query, projection)
    .then((courses) => {
      if (courses.length > 0) {
        res.status(200).json(courses);
      } else {
        res.status(404).json("Nenhum curso cadastrado");
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection course:", err);
      res.status(500);
    });
};

getFiltered = (res, query, projection) => {
  return Course.find(query, projection)
    .then((course) => {
      if (course.length > 0) {
        res.status(200).json(course);
      } else {
        res.status(404).json("O curso não foi encontrado");
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection course:", err);
      res.status(500);
    });
};

post = (req, res) => {
  var course = new Course({
    name: req.body.name,
    period: req.body.period || 8,
    city: req.body.city,
    teacher: req.body.teacher,
    status: 1,
  });
  course.validate((error) => {
    if (!error) {
      return Course.create(course)
        .then((result) => {
          res.status(201).json("Curso cadastrado com sucesso!");
        })
        .catch((err) => {
          console.error("Erro ao conectar a collection course:", err);
          res.status(500);
        });
    } else {
      res.status(401).json({
        message: "Não foi possível cadastrar o curso",
        error: error.errors.teacher.message,
      });
    }
  });
};

put = (req, res, query) => {
  let course = {
    _id: req.params.id,
    name: req.body.name,
    period: req.body.period || 8,
    city: req.body.city,
    teacher: req.body.teacher,
    status: 1,
  };
  let validate = new Course(course);

  validate.validate((error) => {
    if (!error) {
      return Course.findOneAndUpdate(query, { $set: course }, { new: true })
        .then((result) => {
          // update course in student
          if (result) {
            res.status(200).json("Curso editado com sucesso!");
            studentModel.updateCourse(req.params.id, result);
          } else {
            res.status(401).json("Não é possível editar curso inexistente");
          }
        })
        .catch((err) => {
          console.error("Erro ao conectar a collection course:", err);
          res.status(500);
        });
    } else {
      res.status(401).json({
        message: "Não foi possível editar o curso",
        error: error.errors.teacher.message,
      });
    }
  });
};

remove = (req, res, query) => {
  return Course.findOneAndUpdate(query, { $set: { status: 0 } })
    .then((result) => {
      // delete course in student
      studentModel.deleteCourse(req.params.id);
      if (result) {
        console.log("O curso foi removido");
        res.status(200).json("O curso foi removido com sucesso");
      } else {
        console.log("Nenhum curso foi removido");
        res.status(204).json();
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection course:", err);
      res.status(500);
    });
};

getCourse = (id) => Course.findOne({ _id: id, status: 1 });

exports.updateTeacher = (id, set) => {
  return Course.updateMany(
    { "teacher._id": id, status: 1 },
    { $set: { "teacher.$": set } }
  );
};

exports.deleteTeacher = (id) => {
  return Course.findOneAndUpdate(
    { status: 1, "teacher._id": id },
    { $pull: { teacher: { id: id } } }
  );
};

exports.getCoursebyTeacher = () => {
  return Course.find({ status: 1 });
};

jsonAll = (res, query, projection) => {
  return Course.find(query, projection)
    .then((courses) => {
      if (courses.length > 0) {
        res.json(courses);
      } else {
        res.status(404).json();
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection course: ", err);
      res.status(500);
    });
};

jsonFiltered = (res, query, projection) => {
  return Course.find(query, projection)
    .then((course) => {
      if (course.length > 0) {
        res.json(course);
      } else {
        res.status(404).json();
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection course: ", err);
      res.status(500);
    });
};

module.exports = {
  courseSchema,
  getAll,
  getFiltered,
  post,
  put,
  remove,
  jsonAll,
  jsonFiltered,
  getCourse,
};
