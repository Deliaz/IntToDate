/**
 * TODO: Main description
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.inttodate = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

    'use strict';

    //
    // Variables
    //

    var settings;

    // Default settings
    var defaults = {
        //TODO settings
        //modernYears: 1900-2100 (boolean)
        //fromYear (integer)
        //toYear (integer)
        //shortYear (boolean)
        //addThisCentury
        //forceParseInt
        //dateType: [DMY, MDY, both] (string)
    };


    //
    // Tools
    //

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function (defaults, options) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    };


    //
    // Core
    //

    /**
     * Plugin initialization
     * @param {Number} initNumber - Positive integer number with length from 4 to 8 digits
     * @param {Object} options - Object with user settings
     * @public
     */
    function init(initNumber, options) {
        if (initNumber % 1 === 0 && initNumber > 0 && typeof initNumber === 'number') {
            var len = initNumber.toString().length;

            if (len >= 4 && len <= 8) {
                settings = extend(defaults, options || {});
                return supposeDate(initNumber);
            } else {
                console.error('Invalid argument: expected length of number from 4 to 8 digits');
            }
        } else {
            console.error('Invalid argument: positive integer expected');
        }
    }


    /**
     * Suppose dates from integer
     * @param {Number|String} number - Positive integer for parse
     * @returns {Array} supposeRes - Array of objects with proposition of all possible dates
     */
    function supposeDate(number) {
        var parseRes = extractDatePairs(number);
        var supposeRes = [];

        if (parseRes && parseRes.length) {
            if (isSameNumbers(parseRes[0].x, parseRes[0].y)) {
                supposeRes = supposeRes.concat(mixDates(parseRes[0].x, parseRes[0].y, number));
            } else {
                parseRes.forEach(function (pair) {
                    supposeRes = supposeRes.concat(mixDates(pair.x, pair.y, number));
                });
            }
        }
        return supposeRes;
    }


    /**
     * Extracting pairs of numbers which may looks like day and month
     * @param {Number|String} num - Positive integer for parse. Will be convert to string
     * @returns {Array} res - Array of objects [{x:..., y:....}]
     */
    function extractDatePairs(num) {

        var stringNum = typeof num !== 'string' ? num.toString() : parseInt(num).toString();
        var originalLen = stringNum.length;
        var volatileLen = originalLen;

        //TODO: перевести на англ (translate to english)
        //TODO: сделать рефактиринг!!! сейчас неок(
        // Обрезаем последние 2 символа
        // до тех пор, пока длина строки больше 4-х
        do {
            stringNum = stringNum.slice(0, volatileLen - 2);
            volatileLen = stringNum.length;
        } while (volatileLen > 4);

        // Прогон по длине
        var a = "";
        var b = "";
        var res = [];

        switch (volatileLen) {
            case 2:
                // В маске Д.М. || М.Д. подходят любые числа, кроме ноля на второй позиции.
                // На первой позиции ноля быть не может, т. к. строка раньше была числом
                // и ноль был бы уничтожен процедурой parseInt
                if (stringNum[1] !== '0') {
                    res.push({x: stringNum[0], y: stringNum[1]})
                }
                return res;
                break;
            case 3:
                a = stringNum.slice(0, 1);
                b = stringNum.slice(1);
                if (isValidPair(a, b)) {
                    res.push({x: a, y: b});
                }
                a = stringNum.slice(0, 2);
                b = stringNum.slice(2);
                if (isValidPair(a, b)) {
                    res.push({x: a, y: b});
                }
                return res;
                break;
            case 4:
                // Если 4 числа: ДД.ММ || ММ.ДД, остальное год
                a = stringNum.slice(0, 2);
                b = stringNum.slice(2, 4);
                if (isValidPair(a, b)) {
                    res.push({x: a, y: b});
                }

                // Если 3 числа: Д.ММ || ММ.Д, остальное год
                a = stringNum.slice(0, 1);
                b = stringNum.slice(1, 3);
                var yearPrefix = stringNum.slice(3, 4);

                if (yearPrefix !== "0" && isValidPair(a, b)) {
                    res.push({x: a, y: b});
                }

                if (originalLen == 6) {
                    // Если 2 числа: Д.М || М.Д, остальное — год ГГ
                    a = stringNum[0];
                    b = stringNum[1];

                    if (isValidPair(a, b)) {
                        res.push({x: a, y: b});
                    }
                }
                return res;
                break;
        }

        return res;
    }


    /**
     * Check for numbers, which satisfy condition 'day < 31' and 'month < 12'
     * @param a
     * @param b
     * @returns {boolean}
     */
    function isValidPair(a, b) {
        a = parseInt(a);
        b = parseInt(b);
        return (!!b) && ((a <= 12 && b <= 31) || (a <= 31 && b <= 12));
    }


    /**
     * Final mixing dates
     * @param strX
     * @param strY
     * @param fullNum
     * @returns {Array}
     */
    function mixDates(strX, strY, fullNum) {
        var intX = parseInt(strX);
        var intY = parseInt(strY);
        var suppose = [];
        var year = extractYear(fullNum, strX, strY);

        // Оба элемента могут быть и датой и месяцем
        if (intX <= 12 && strY <= 12 && intX !== intY) {

            if (isAcceptableDaysInMonth(year, strX, strY)) {
                suppose.push({d: intY, m: intX, y: year});
            }
            if (isAcceptableDaysInMonth(year, strY, strX)) {
                suppose.push({d: intX, m: intY, y: year});
            }
        }
        // Подходят только в едином исполнении
        else {
            var _d = Math.max.apply(0, [intX, intY]);
            var _m = Math.min.apply(0, [intX, intY]);
            if (isAcceptableDaysInMonth(year, _m, _d)) {
                suppose.push({d: _d, m: _m, y: year});
            }
        }

        return suppose;
    }


    /**
     * Extracting only year from original number
     * @param num
     * @param strX
     * @param strY
     * @returns {Number} - Year from original number
     */
    function extractYear(num, strX, strY) {
        return parseInt(num.toString().substr(strX.length).substr(strY.length));
    }


    /**
     * Check number of days in a month
     * @param {Number} y Year
     * @param {Number} m Month
     * @param {Number} d Day
     * @returns {boolean}
     */
    function isAcceptableDaysInMonth(y, m, d) {
        return d <= new Date(y, m, 0).getDate();
    }


    /**
     * TODO
     * @param x
     * @param y
     */
    function isSameNumbers(x, y) {
        var strXY = x.toString() + y.toString();
        return strXY.slice(1) === strXY.slice(0,2);
    }


    //
    // Public APIs
    //

    return init;

});