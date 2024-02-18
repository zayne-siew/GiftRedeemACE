'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
Object.defineProperty(exports, '__esModule', { value: true });
const app_1 = __importStar(require('../app'));
describe('Testing addStaff()', () => {
    const staffDB = new Map();
    let server;
    beforeAll(() => (server = app_1.default.listen(3000)));
    afterEach(() => staffDB.clear());
    afterAll(() => server.close());
    test('Add single staff into empty database', () => {
        const staff = {
            staff_pass_id: 'STAFF_0X9294CN',
            team_name: 'TESTING',
            created_at: 0,
        };
        expect(staffDB.size).toEqual(0);
        (0, app_1.addStaff)(staffDB, staff);
        expect(staffDB.size).toEqual(1);
        expect(staffDB.get(staff.staff_pass_id)).toEqual(staff);
    });
    test('Add multiple staff with unique IDs', () => {
        const numStaff = 1000;
        for (let i = 1; i <= numStaff; i++) {
            const staff = {
                staff_pass_id: `STAFF_${i.toString().padStart(7, '0')}`,
                team_name: 'TESTING',
                created_at: i,
            };
            (0, app_1.addStaff)(staffDB, staff);
            expect(staffDB.size).toEqual(i);
        }
    });
    test('Add staff with non-unique ID', () => {
        const passID = 'STAFF_0X9294CN';
        const staff1 = {
            staff_pass_id: passID,
            team_name: 'TESTING',
            created_at: 0,
        };
        const staff2 = {
            staff_pass_id: passID,
            team_name: 'TESTING',
            created_at: 1,
        };
        (0, app_1.addStaff)(staffDB, staff1);
        expect(staffDB.size).toEqual(1);
        expect(staffDB.get(passID)).toEqual(staff1);
        (0, app_1.addStaff)(staffDB, staff2);
        expect(staffDB.size).toEqual(1);
        expect(staffDB.get(passID)).toEqual(staff2);
    });
    test('Add staff created in the future', () => {
        const staff1 = {
            staff_pass_id: 'STAFF_0X9294CN',
            team_name: 'TESTING',
            created_at: Date.now() + 10000,
        };
        const staff2 = {
            staff_pass_id: 'STAFF_N93MCMW9',
            team_name: 'TESTING',
            created_at: Date.now() - 10000,
        };
        (0, app_1.addStaff)(staffDB, staff1);
        (0, app_1.addStaff)(staffDB, staff2);
        expect(staffDB.size).toEqual(1);
        expect(staffDB.get(staff1.staff_pass_id)).toBeUndefined();
        expect(staffDB.get(staff2.staff_pass_id)).toEqual(staff2);
    });
});
