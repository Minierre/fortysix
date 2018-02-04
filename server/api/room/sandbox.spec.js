const request = require('supertest')
const { should, expect } = require('chai')
const chai = require('chai')
const { describe, it, beforeEach, afterEach } = require('mocha')
const app = require('../../index.js')
const db = require('../../db')
const Room = db.model('room')


// Make sure databbase is seeded
describe('sandbox penetration testing', () => {

  let roomHash

  beforeEach(() => {
    return Room.create({}).then((room) => {
      roomHash = room.roomHash
    })
  })

  afterEach(() => {
    return Room.destroy({
      where: {
        roomHash
      }
    })
  })

  describe('goodFitnessFunction', () => {
    const body = { fitnessFunc: '"() => 5"' }
    it('should return 201', (done) => {
      request(app)
        .put(`/api/room/${roomHash}`)
        .set('Accept', 'application/x-www-form-urlencoded')
        .send(body)
        .expect(201, done)
    })
  })

  xdescribe('infiniteLoop', () => {
    const body = { fitnessFunc: '"() => {while(true){}}"' }
    it('should return 403', (done) => {
      request(app)
        .put(`/api/room/${roomHash}`)
        .send(body)
        .set('Accept', 'application/x-www-form-urlencoded')
        .expect(403, done)
    })
  })
})

