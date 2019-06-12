const courseModel = require('../model/course');
const teacherModel = require('../model/teacher');
const Joi = require('joi');

const schemaCourse = Joi.object().keys({ // schema for joi validate required fields
	name: Joi.string().required(),
	period: Joi.number(),
	city: Joi.string().required(),
	teacher: Joi.array().required(),
});

exports.getAllCourses = (req, res) => {
	//  define query and projection for search
	let query = {status:1};
	let projection = {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}

	// send to model
	return courseModel.getAll(res, query, projection)
};

exports.getFilteredCourse = (req,res) => {
	//  define query and projection for search
	let query = {'id':parseInt(req.params.id), 'status':1};
	let projection = {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}

	// send to model
	return courseModel.getFiltered(res, query, projection)
};

exports.postCourse = (req, res) => {
	(async () => { 
		if(req.body.teacher){ // if teacher is inserted
			for(let i = req.body.teacher.length-1; i > -1 ; i--){
				teacher = await teacherModel.getTeacher(req.body.teacher[i]);
				if(teacher.length > 0){ // if teacher exists
					req.body.teacher[i] = teacher[0];  // receive the course related to the inserted id
				}else{ 
					req.body.teacher.splice(i, 1); // clean if not exists
				}
			}
		}
		
		Joi.validate(req.body, schemaCourse, (err, result) =>{ // joi check the required fields
			if(!err){
				return courseModel.post(req, res) // return post to model
			}else{
				res.status(422).json({ // send joi error message
					message: 'Não foi possível inserir o curso', 
					error: err.message
				});
			}
		});
	})();
};

exports.putCourse = (req, res) => {
	let query = {'id': parseInt(req.params.id),'status': 1}; // define query for search and update
	(async () => {
		if(req.body.teacher){  // if course is inserted
			for(let i = req.body.teacher.length-1; i > -1 ; i--){
				teacher = await teacherModel.getTeacher(req.body.teacher[i]);
				if(teacher.length > 0){ // if course exists
					req.body.teacher[i] = teacher[0];  // receive the course related to the inserted id
				}else{
					req.body.teacher.splice(i, 1); // clean if not exists
				}
			}
		}
	
		Joi.validate(req.body, schemaCourse, (err, result) =>{
			if(!err){
				// send to model
	  			return courseModel.put(req, res, query)
			}else{
				res.status(422).json({
					message: 'Não foi possível inserir o curso', 
					error: err.message
				});
			}
		});
	})();
};

exports.deleteCourse = (req, res) => {
	let query = {'id': parseInt(req.params.id),'status':1}; // define query to search and delete
	return courseModel.delete(req, res, query) // send delete request to model
};

exports.jsonAllCourses = (req, res) => {
	let query = {status:1}; //  define query and projection for search
	let projection = {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}
	return courseModel.jsonAll(res, query, projection) // send search to model
};

exports.jsonFilteredCourse = (req,res) => {
	let query = {'id':parseInt(req.params.id), 'status':1}; //  define query and projection for search
	let projection = {_id:0, id:1, name:1, period:1, city:1, 'teacher.id':1, 'teacher.name':1, 'teacher.lastName':1, 'teacher.phd':1}
	return courseModel.jsonFiltered(res, query, projection) // send search to model
};