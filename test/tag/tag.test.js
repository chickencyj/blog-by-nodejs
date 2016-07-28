var crypto = require('crypto')
var bcrypt = require('bcrypt')

function getRandomString(len) {
  if (!len) len = 16

  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex')
}

var should = require('should')
var app = require('../../app')
var Tag = require('../../app/models/tag')

var tag

// test
describe('<Unit Test', function() {
  describe('Model Tag:', function() {
    before(function(done) {
      tag = {
        name: getRandomString()
      }

      done()
    })

    describe('Before Method save', function() {
      it('should begin without test tag', function(done) {
        Tag.find({name: tag.name}, function(err, tags) {
          tags.should.have.length(0)

          done()
        })
      })
    })

    describe('Tag save', function() {
      it('should save without problems', function(done) {
        var _tag = new Tag(tag)

        _tag.save(function(err) {
          should.not.exist(err)
          _tag.remove(function(err) {
            should.not.exist(err)
            done()
          })
        })
      })

      it('should fail to save an existing tag', function(done) {
        var _tag1 = new Tag(tag)

        _tag1.save(function(err) {
          should.not.exist(err)

          var _tag2 = new Tag(tag)

          _tag2.save(function(err) {
            should.exist(err)

            _tag1.remove(function(err) {
              if (!err) {
                _tag2.remove(function(err) {
                  done()
                })
              }
            })
          })
        })
      })
    })

    after(function(done) {
      // clear tag info
      done()
    })
  })
})