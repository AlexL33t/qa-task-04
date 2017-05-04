const assert = require('assert');
const sinon = require('sinon');
const nock = require('nock');
const proxyquire = require('proxyquire');

describe('showTweets', () => {
    afterEach(() => {
        console.log.restore();
        console.error.restore();
        nock.cleanAll();
    });

    it('should return tweets and print it to console', done => {
        const log = sinon.spy(console, 'log');
        const error = sinon.spy(console, 'error');
        const tweets = [
            {
                'created_at': '2017-05-01T21:15:10.609Z',
                'text': 'This is tweet'
            }
        ];
        nock('https://api.twitter.com')
            .get('/1.1/search/tweets.json?q=%23urfu-testing-2016')
            .reply(200, tweets);
        const formatDate = sinon.stub();
        formatDate.withArgs(new Date(tweets[0].created_at)).returns('1 мая 2017 года в 21:15');
        formatDate.throws('Illegal arguments');
        const showTweets = proxyquire('../showTweets', {
            './formatDate': formatDate
        });

        showTweets(() => {
            assert(log.firstCall.calledWith('1 мая 2017 года в 21:15'));
            assert(log.secondCall.calledWith(tweets[0].text));
            assert(error.notCalled);
            done();
        });
    });

    it('should throw error when get request error', done => {
        const log = sinon.spy(console, 'log');
        const error = sinon.spy(console, 'error');
        const errorMessage = 'request error';
        nock('https://api.twitter.com')
            .get('/1.1/search/tweets.json?q=%23urfu-testing-2016')
            .replyWithError(errorMessage);
        const showTweets = require('../showTweets');

        showTweets(() => {
            assert(error.firstCall.calledWith(errorMessage));
            assert(log.notCalled);
            done();
        });
    });

    it('should throw error when result status code is not 200', done => {
        const log = sinon.spy(console, 'log');
        const error = sinon.spy(console, 'error');
        nock('https://api.twitter.com')
            .get('/1.1/search/tweets.json?q=%23urfu-testing-2016')
            .reply(404, '404 not found');
        const showTweets = require('../showTweets');

        showTweets(() => {
            assert(error.firstCall.calledWith(404));
            assert(log.notCalled);
            done();
        });
    });

    it('should throw error when get parse error', done => {
        const log = sinon.spy(console, 'log');
        const error = sinon.spy(console, 'error');
        const fakeJSON = 'this is fake json data } } } ';
        nock('https://api.twitter.com')
            .get('/1.1/search/tweets.json?q=%23urfu-testing-2016')
            .reply(200, fakeJSON);
        const showTweets = require('../showTweets');

        showTweets(() => {
            assert(error.calledOnce);
            assert(log.notCalled);
            done();
        });
    });
});