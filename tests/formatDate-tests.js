const assert = require('assert');
const sinon = require('sinon');
const formatDate = require('../formatDate');

function getFakeClock(year, month, day) {
    return sinon.useFakeTimers(new Date(year, month, day, 23, 30).getTime());
}

function runSuccessTest(date, expected) {
    const actual = formatDate(date);
    assert.equal(actual, expected);
}

describe('formatDate', () => {
    describe('Throw error', () => {
        it('should throw error when date format is incorrect', () => {
            const cb = () => formatDate('Incorrect date format');

            assert.throws(cb, /Некорректный формат даты/);
        });

        it('should throw error when number of arguments is more than one', () => {
            const cb = () => formatDate(new Date(), new Date());

            assert.throws(cb, /Количество аргументов должно быть равным 1/);
        });

        it('should throw error when no arguments given', () => {
            const cb = () => formatDate();

            assert.throws(cb, /Количество аргументов должно быть равным 1/);
        });

        it('should throw error when date relates to the future', () => {
            const clock = getFakeClock(2017, 5, 1);
            const cb = () => formatDate(new Date(2017, 5, 2));

            assert.throws(cb, /Дата не может быть в будущем времени/);
            clock.restore();
        });
    });

    describe('Return value', () => {
        let clock;

        afterEach(() => {
            clock.restore();
        });

        it('should return only hh:mm when date is today', () => {
            clock = getFakeClock(2017, 5, 1);
            runSuccessTest(new Date(2017, 5, 1, 12, 12), '12:12');
        });

        it('should return correct hh:mm when hours and minutes less than zero', () => {
            clock = getFakeClock(2017, 5, 1);
            runSuccessTest(new Date(2017, 5, 1, 9, 1), '09:01');
        });

        it('should return `вчера в hh:mm` when date is yesterday', () => {
            clock = getFakeClock(2017, 5, 2);
            runSuccessTest(new Date(2017, 5, 1, 12, 12), 'вчера в 12:12');
        });

        it('should return `dd month в hh:mm` when date relates to this year', () => {
            clock = getFakeClock(2017, 5, 3);
            runSuccessTest(new Date(2017, 5, 1, 12, 12), '1 июня в 12:12');
        });

        it('should return `dd month year года в hh:mm` when date is year ago', () => {
            clock = getFakeClock(2017, 5, 3);
            runSuccessTest(new Date(2016, 5, 3, 9, 30), '3 июня 2016 года в 09:30');
        });
    });
});