import { Staff, addStaff, isStaffValid } from '../app';

describe('Testing isStaffValid()', () => {
    const staffDB: Map<string, Staff> = new Map();
    beforeAll(() => {
        addStaff(staffDB, {
            staff_pass_id: 'STAFF_9X28CMX',
            team_name: 'TESTING',
            created_at: Date.now(),
        });
        addStaff(staffDB, {
            staff_pass_id: 'MANAGER_PX0VWX1',
            team_name: 'TESTING',
            created_at: Date.now(),
        });
        addStaff(staffDB, {
            staff_pass_id: 'BOSS_C0X1122E',
            team_name: 'TESTING',
            created_at: Date.now(),
        });
    });

    test('Pass ID inputs are invalid by default', () => {
        expect(isStaffValid(staffDB, '')).toEqual(false);
    });
    test('Unrecognised pass IDs are invalid', () => {
        expect(isStaffValid(staffDB, 'Hello World!')).toEqual(false);
        expect(isStaffValid(staffDB, 'MaNAGER_PX0VWX1')).toEqual(false);
        expect(isStaffValid(staffDB, 'STAFF_13828XWM')).toEqual(false);
    });
    test('Recognised pass IDs are valid', () => {
        expect(isStaffValid(staffDB, 'STAFF_9X28CMX')).toEqual(true);
        expect(isStaffValid(staffDB, 'MANAGER_PX0VWX1')).toEqual(true);
        expect(isStaffValid(staffDB, 'BOSS_C0X1122E')).toEqual(true);
    });
});
