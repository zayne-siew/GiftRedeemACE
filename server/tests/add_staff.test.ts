import { Server } from 'http';
import app, { Staff, addStaff } from '../app';

describe('Testing addStaff()', () => {
    const staffDB: Map<string, Staff> = new Map();
    let server: Server;
    beforeAll(() => server = app.listen(3000));
    afterEach(() => staffDB.clear());
    afterAll(() => server.close());

    test('Add single staff into empty database', () => {
        const staff: Staff = {
            staff_pass_id: 'STAFF_0X9294CN',
            team_name: 'TESTING',
            created_at: 0,
        };

        expect(staffDB.size).toEqual(0);

        addStaff(staffDB, staff);
        expect(staffDB.size).toEqual(1);
        expect(staffDB.get(staff.staff_pass_id)).toEqual(staff);
    });
    test('Add multiple staff with unique IDs', () => {
        const numStaff: number = 1000;
        for (let i: number = 1; i <= numStaff; i++) {
            const staff: Staff = {
                staff_pass_id: `STAFF_${i.toString().padStart(7, '0')}`,
                team_name: 'TESTING',
                created_at: i,
            };

            addStaff(staffDB, staff);
            expect(staffDB.size).toEqual(i);
        }
    });
    test('Add staff with non-unique ID', () => {
        const passID: string = 'STAFF_0X9294CN';
        const staff1: Staff = {
            staff_pass_id: passID,
            team_name: 'TESTING',
            created_at: 0,
        };
        const staff2: Staff = {
            staff_pass_id: passID,
            team_name: 'TESTING',
            created_at: 1,
        };

        addStaff(staffDB, staff1);
        expect(staffDB.size).toEqual(1);
        expect(staffDB.get(passID)).toEqual(staff1);

        addStaff(staffDB, staff2);
        expect(staffDB.size).toEqual(1);
        expect(staffDB.get(passID)).toEqual(staff2);
    });
    test('Add staff created in the future', () => {
        const staff1: Staff = {
            staff_pass_id: 'STAFF_0X9294CN',
            team_name: 'TESTING',
            created_at: Date.now() + 10000,
        };
        const staff2: Staff = {
            staff_pass_id: 'STAFF_N93MCMW9',
            team_name: 'TESTING',
            created_at: Date.now() - 10000,
        };

        addStaff(staffDB, staff1);
        addStaff(staffDB, staff2);
        expect(staffDB.size).toEqual(1);
        expect(staffDB.get(staff1.staff_pass_id)).toBeUndefined();
        expect(staffDB.get(staff2.staff_pass_id)).toEqual(staff2);
    });
});
