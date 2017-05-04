const MONTHS = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
];

/**
 * Форматирование даты
 *
 * @param {String} date
 */
function formatDate(date) {
    if (arguments.length !== 1) {
        throw new Error('Количество аргументов должно быть равным 1');
    }
    const currentDate = new Date();
    const parsedDate = new Date(date);
    if (parsedDate.toString() === 'Invalid Date') {
        throw new Error('Некорректный формат даты');
    }
    if (parsedDate > currentDate) {
        throw new Error('Дата не может быть в будущем времени');
    }
    if (parsedDate.toDateString() === currentDate.toDateString()) {
        return getHoursAndMinutes(parsedDate);
    }
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);
    if (parsedDate.toDateString() === yesterday.toDateString()) {
        return 'вчера в ' + getHoursAndMinutes(parsedDate);
    }
    if (parsedDate.getFullYear() === currentDate.getFullYear()) {
        return getDayAndMonth(parsedDate) + ' в ' + getHoursAndMinutes(parsedDate);
    } else {
        return getDayAndMonth(parsedDate) + ' ' + parsedDate.getFullYear() + ' года в ' + getHoursAndMinutes(parsedDate);
    }
}

function getDayAndMonth(date) {
    return date.getDate() + ' ' + MONTHS[date.getMonth()];
}

function getHoursAndMinutes(date) {
    return getNumberWithZero(date.getHours()) + ':' + getNumberWithZero(date.getMinutes());
}

function getNumberWithZero(number) {
    return number < 10 ? '0' + number : number;
}

module.exports = formatDate;