const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');

const app = require('../app');

describe('PUT /api/v1/user', function() {
  it('it should PUT a user with "guess" on profile', () => {
    return request(app)
    .put('/api/v1/user/1')
    .send({ name: "UpdatedName1", lastName: "UpdatedLastName1", profile: "guess" })
    .then(function(res) { 
      assert.equal(res.status, 200);
    });
  });

  it('it should PUT a user with "admin" on profile', () => {
    return request(app)
    .put('/api/v1/user/2')
    .send({ name: "UpdatedName2", lastName: "UpdatedLastName2", profile: "admin" })
    .then(function(res) { 
      assert.equal(res.status, 200);
    });
  });

  it('it should NOT PUT a user without "guess" or "admin" on profile', () => {
    return request(app)
    .put('/api/v1/user/1')
    .send({ name: "UpdatedName3", lastName: "UpdatedLastName3", profile: "not a admin or guess" })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
});

describe('PUT /api/v1/teacher', function() {
  it('it should PUT a teacher with "phd=true"', () => {
    return request(app)
    .put('/api/v1/teacher/1')
    .send({ name: "UpdatedName1", lastName: "UpdatedLastName1", phd:true })
    .then(function(res) { 
      assert.equal(res.status, 200);
    });
  });

  it('it should PUT a second teacher with "phd=true"', () => {
    return request(app)
    .put('/api/v1/teacher/2')
    .send({ name: "UpdatedName2", lastName: "UpdatedLastName2", phd:true })
    .then(function(res) { 
      assert.equal(res.status, 200);
    });
  });

  it('it should NOT PUT a teacher without "phd=true"', () => {
    return request(app)
    .put('/api/v1/teacher/1')
    .send({ name: "UpdatedName3", lastName: "UpdatedLastName3", phd:false })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
});

describe('PUT /api/v1/course', function() {
  it('it should PUT a course with more than 2 teachers', () => {
    return request(app)
    .put('/api/v1/course/1')
    .send({ name:"UpdatedName1", period:"UpdatedPeriod1", city:"UpdatedCity1", teacher:[1, 2]})
    .then(function(res) { 
      assert.equal(res.status, 200);
    });
  });

  it('it should NOT PUT a course without more than 2 teachers', () => {
    return request(app)
    .put('/api/v1/course/1')
    .send({ name:"UpdatedName2", period:"UpdatedPeriod2", city:"UpdatedCity2", teacher:[1]})
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
});

describe('PUT /api/v1/student', function() {
  it('it should PUT a student with "age >= 17" and valid course', () => {
    return request(app)
    .put('/api/v1/student/1')
    .send({ name: "UpdatedName1", lastName: "UpdatedLastName1", age: 18, course:[1] })
    .then(function(res) { 
      assert.equal(res.status, 200);
    });
  });

  it('it should NOT PUT a user without "age >= 17" even if he is on a valid course', () => {
    return request(app)
    .put('/api/v1/student/1')
    .send({ name: "UpdatedName2", lastName: "UpdatedLastName2", age: 16, course:[1] })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  });

  it('it should NOT PUT a user without a valid course even if he have "age >= 17"', () => {
    return request(app)
    .put('/api/v1/student/1')
    .send({ name: "UpdatedName3", lastName: "UpdatedLastName3", age: 18, course:[2] })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  });

  it('it should NOT PUT a user without "age >= 17" and a valid course', () => {
    return request(app)
    .put('/api/v1/student/1')
    .send({ name: "UpdatedName4", lastName: "UpdatedLastName4", age: 16, course:[2] })
    .then(function(res) { 
      assert.equal(res.status, 401);
    }); 
  })
});