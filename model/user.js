const mongoose = require("mongoose");
const Schema = mongoose.Schema;

userSchema = new Schema(
  {
    name: { type: String },
    lastName: { type: String },
    profile: {
      type: String,
      enum: {
        values: ["guest", "admin"],
        message: "O profile {VALUE} é inválido",
      },
    },
    status: { type: Number },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema, "user");

getAll = (res, query, projection) => {
  return User.find(query, projection)
    .then((users) => {
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).json("Nenhum usuário cadastrado");
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection user: ", err);
      res.status(500);
    });
};

getFiltered = (res, query, projection) => {
  return User.find(query, projection)
    .then((user) => {
      if (user.length > 0) res.status(200).json(user);
      else res.status(404).json("O usuário não foi encontrado");
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection user: ", err);
      res.status(500);
    });
};

post = (req, res) => {
  let user = new User({
    name: req.body.name,
    lastName: req.body.lastName,
    profile: req.body.profile,
    status: 1,
  });
  user.validate((error) => {
    if (!error) {
      return User.create(user)
        .then((result) => {
          res.status(201).json("Usuário cadastrado com sucesso!");
        })
        .catch((err) => {
          console.error("Erro ao conectar a collection user: ", err);
          res.status(500);
        });
    } else {
      res.status(401).json({
        message: "Não foi possível cadastrar o usuário",
        error: error.errors.profile.message,
      });
    }
  });
};

put = (req, res, query) => {
  let user = {
    _id: req.params.id,
    name: req.body.name,
    lastName: req.body.lastName,
    profile: req.body.profile,
    status: 1,
  };
  let validate = new User(user);

  validate.validate((error) => {
    if (!error) {
      return User.findOneAndUpdate(query, { $set: user })
        .then((result) => {
          if (result) {
            res.status(200).json("Usuário editado com sucesso!");
          } else {
            res.status(401).json("Não é possível editar usuário inexistente");
          }
        })
        .catch((err) => {
          console.error("Erro ao conectar a collection user: ", err);
          res.status(500);
        });
    } else {
      res.status(401).json({
        message: "Não foi possível cadastrar o usuário",
        error: error.errors.profile.message,
      });
    }
  });
};

remove = (res, query) => {
  return User.findOneAndUpdate(query, { $set: { status: 0 } })
    .then((result) => {
      if (result) {
        // if user exists
        console.log("O usuário foi removido");
        res.status(200).json("O usuário foi removido com sucesso");
      } else {
        console.log("Nenhum usuário foi removido");
        res.status(204).json();
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection user: ", err);
      res.status(500);
    });
};

jsonAll = (res, query, projection) => {
  return User.find(query, projection)
    .then((users) => {
      if (users.length > 0) {
        res.json(users);
      } else {
        res.status(404).json();
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection user: ", err);
      res.status(500);
    });
};

jsonFiltered = (res, query, projection) => {
  return User.find(query, projection)
    .then((user) => {
      if (user.length > 0) {
        res.json(user);
      } else {
        res.status(404).json();
      }
    })
    .catch((err) => {
      console.error("Erro ao conectar a collection user: ", err);
      res.status(500);
    });
};

module.exports = {
  userSchema,
  getAll,
  getFiltered,
  post,
  put,
  remove,
  jsonAll,
  jsonFiltered,
};
