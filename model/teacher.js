const mongoose = require('mongoose');
const Schema = mongoose.Schema;

teacherSchema = new Schema({
	id: {type: Number},
	name: {type: String},
	lastName: {type: String},
	phd: {type: Boolean, validate: [val => {return val == true}, 'É obrigatório o professor possuir phd']},
	status: {type: Number}
}, {versionKey: false});

const Teacher = mongoose.model('Teacher', teacherSchema, 'teacher');

const courseModel = require('./course');
const studentModel = require('./student');

var id;
Teacher.countDocuments({}, (err, count) => {
	id = count;
});

getAll = (res, query, projection) => {
	return Teacher.find(query, projection)
	.then(teachers => {
		if(teachers.length > 0){
			res.status(200).send(teachers);        
		}else{
			res.status(404).send('Nenhum professor cadastrado');
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection teacher: ", err);
		res.status(500);
	});
};

getFiltered = (res, query, projection) => {
	return Teacher.find(query, projection)
	.then(teacher => {
		if(teacher.length > 0){
			res.status(200).send(teacher);        
		}else{
			res.status(404).send('O professor não foi encontrado');
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection teacher: ", err);
		res.status(500);
	});
};

post = (req, res) => {
	let teacher = new Teacher({id: ++id, name: req.body.name, lastName: req.body.lastName, phd: req.body.phd, status: 1});
	teacher.validate(error => {
		if(!error){
			return Teacher.create(teacher) 
			.then(result => {
				res.status(201).send('Professor cadastrado com sucesso!');
			})
			.catch(err => {
				id--;
				console.error("Erro ao conectar a collection teacher: ", err);
				res.status(500);
			});
		}else{
			id--;
			res.status(401).json({
				message: 'Não foi possível cadastrar o professor', 
				error: error.errors.phd.message
			});
		}
	}) 
};

put = (req, res, query) => {
	let teacher = ({id:parseInt(req.params.id), name: req.body.name, lastName: req.body.lastName, phd: req.body.phd, status: 1});
	let validate = new Teacher(teacher);

	validate.validate(error =>{
		if(!error){
			return Teacher.findOneAndUpdate(query, {$set: teacher}, {returnOriginal:false})
			.then(async (result) => {
				if(result){ // if professor exists
					res.status(200).send('Professor editado com sucesso!');
					//  updates the course that contains this teacher
					await courseModel.updateTeacher(parseInt(req.params.id), result);
					// receives the updated teacher and updates the student that contains this teacher
					courseModel.getCoursebyTeacher().then(courses => {
						for(var i = 0; i<courses.length; i++){
							studentModel.updateTeacher(courses[i]);
						}
					});
				}else{
					res.status(401).send('Não é possível editar professor inexistente');
				}
			})
			.catch(err => {
					console.error("Erro ao conectar a collection teacher: ", err);
					res.status(500);
			});
		}else{
			res.status(401).json({
				message: 'Não foi possível editar o professor', 
				error: error.errors.phd.message
			});
		}
	})
};

remove = async (req, res, query) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	return Teacher.findOneAndUpdate(query, {$set: {status:0}}).session(session)
	.then(async (result) => {
		//  updates the course that contains that teacher
		await courseModel.deleteTeacher(parseInt(req.params.id)).session(session);
		
		// receives the updated teacher and updates the student that contains this teacher
		await courseModel.getCoursebyTeacher().session(session).then(async courses => {
			for(var i = 0; i<courses.length; i++){
				await studentModel.updateTeacher(courses[i]).session(session);
			}
		});
		
		if(result){ // if professor exists
			console.log('O professor foi removido');
			res.status(200).send('O professor foi removido com sucesso');
		}else{
			res.status(204).send();
			console.log('Nenhum professor foi removido');
		}
		await session.commitTransaction();
		session.endSession();
	}).catch(async err => {
		res.status(500).send('Ocorreu um erro interno, tente novamente mais tarde')
		await session.abortTransaction();
		session.endSession();
		throw err;
	})
};

getTeacher = (id) => {
	return Teacher.find({'id':id, 'status':1});
};

jsonAll = (res, query, projection) => {
	return Teacher.find(query, projection)
	.then(teachers => {
		if(teachers.length > 0){ 
			res.json(teachers);        
		}else{
			res.status(404).json();
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection teacher: ", err);
		res.status(500);
	});
};

jsonFiltered = (res, query, projection) => {
	return Teacher.find(query, projection)
	.then(teacher => {
		if(teacher.length > 0){
			res.json(teacher);        
		}else{
			res.status(404).json();
		}
	})
	.catch(err => {
		console.error("Erro ao conectar a collection teacher: ", err);
		res.status(500);
	});
};

module.exports = {teacherSchema, getAll, getFiltered, post, put, remove, jsonAll, jsonFiltered, getTeacher};