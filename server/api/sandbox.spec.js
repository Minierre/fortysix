const request = require('supertest')
const { should, expect } = require('chai')
const chai = require('chai')
const {
  describe, it, before, after
} = require('mocha')

const app = require('../index.js')
// let request = require('supertest')(app)

describe('goodFitnessFunction', () => {
  const body = { fitnessFunc: '"() => 5"' }
  it('should return 201', (done) => {
    request(app)
      .put('/api/room/456')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send(body)
      .expect(201, done)
  })
})

describe('infiniteLoop', () => {
  const body = { fitnessFunc: '"() => {while(true){}}"' }
  it('should return 403', (done) => {
    request(app)
      .put('/api/room/456')
      .send(body)
      .set('Accept', 'application/x-www-form-urlencoded')
      .expect(403, done)
  })
})
