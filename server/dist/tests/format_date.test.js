'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const app_1 = require('../app');
describe('Testing formatDate()', () => {
    test('Format epoch 0', () => {
        const dateString = '01/01/1970 00:00:00';
        const date = new Date(dateString);
        expect((0, app_1.formatDate)(new Date(0))).toEqual(dateString);
        expect(date.getTime()).toEqual(0);
    });
    test('Format epoch 1708267593000', () => {
        const epoch = 1708267593000;
        const dateString = '18/02/2024 14:46:33';
        expect((0, app_1.formatDate)(new Date(epoch))).toEqual(dateString);
    });
});
