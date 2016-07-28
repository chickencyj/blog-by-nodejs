var crypto = require('crypto')

function getRandomString(len) {
  if (!len) len = 16

  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex')
}

var should = require('should')
var app = require('../../app')
var Article = require('../../app/models/article')

var article

// test
describe('<Unit Test', function() {
  describe('Model Article:', function() {
    before(function(done) {
      article = {
        title: getRandomString(),
        text: 'articleText'
      }

      done()
    })
   })

    describe('Article save', function() {
      it('should save without problems', function(done) {
        var _article = new Article(article)

        _article.save(function(err) {
          should.not.exist(err)
          _article.remove(function(err) {
            should.not.exist(err)
            done()
          })
        })
      })

      it('should have default pv 0', function(done) {
        var _article = new Article(article)

        _article.save(function(err) {
          _article.pv.should.equal(0)

          _article.remove(function(err) {
            done()
          })
        })
      })

    after(function(done) {
      // clear article info
      done()
    })
  })
})