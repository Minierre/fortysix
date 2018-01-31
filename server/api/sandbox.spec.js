const request = require('supertest')
const { should, expect } = require('chai')
const chai = require('chai')
const {
  describe, it, before, after
} = require('mocha')

const app = require('../index.js')
// let request = require('supertest')(app)

describe('goodFunction', () => {
  it('should return 201', (done) => {
    request(app)
      .put('/room/456')
      .send({
        fitnessFunc: '() => {return 5}'
      })
      .set('Accept', 'application/x-www-form-urlencoded')
      .end((err, res) => {
        console.log(res);
        done()
      })
  })
})

describe('infiniteLoop', () => {
  it('should return 400', (done) => {
    request(app)
      .put('/room/456')
      .send({
        fitnessFunc: '() => {while(true){}}'
      })
      .set('Accept', 'application/x-www-form-urlencoded')
      .expect(400, done)
  })
})
