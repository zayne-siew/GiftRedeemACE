'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const app_1 = require('../app');
describe('Testing isStaffValid()', () => {
    const staffDB = new Map();
    beforeAll(() => {
        (0, app_1.addStaff)(staffDB, {
            staff_pass_id: 'STAFF_9X28CMX',
            team_name: 'TESTING',
            created_at: Date.now(),
        });
        (0, app_1.addStaff)(staffDB, {
            staff_pass_id: 'MANAGER_PX0VWX1',
            team_name: 'TESTING',
            created_at: Date.now(),
        });
        (0, app_1.addStaff)(staffDB, {
            staff_pass_id: 'BOSS_C0X1122E',
            team_name: 'TESTING',
            created_at: Date.now(),
        });
    });
    test('Pass ID inputs are invalid by default', () => {
        expect((0, app_1.isStaffValid)(staffDB, '')).toEqual(false);
    });
    test('Unrecognised pass IDs are invalid', () => {
        expect((0, app_1.isStaffValid)(staffDB, 'Hello World!')).toEqual(false);
        expect((0, app_1.isStaffValid)(staffDB, 'MaNAGER_PX0VWX1')).toEqual(
            false
        );
        expect((0, app_1.isStaffValid)(staffDB, 'STAFF_13828XWM')).toEqual(
            false
        );
    });
    test('Recognised pass IDs are valid', () => {
        expect((0, app_1.isStaffValid)(staffDB, 'STAFF_9X28CMX')).toEqual(true);
        expect((0, app_1.isStaffValid)(staffDB, 'MANAGER_PX0VWX1')).toEqual(
            true
        );
        expect((0, app_1.isStaffValid)(staffDB, 'BOSS_C0X1122E')).toEqual(true);
    });
});
