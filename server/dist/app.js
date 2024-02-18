'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.formatDate =
    exports.canTeamRedeemGift =
    exports.isStaffValid =
    exports.populateStaffDatabase =
    exports.addStaff =
        void 0;
const body_parser_1 = __importDefault(require('body-parser'));
const csv_parser_1 = __importDefault(require('csv-parser'));
const cors_1 = __importDefault(require('cors'));
const express_1 = __importDefault(require('express'));
const fs_1 = require('fs');
const helmet_1 = __importDefault(require('helmet'));
const tslog_1 = require('tslog');
const async_mutex_1 = require('async-mutex');
const log = new tslog_1.Logger({ minLevel: 3 });
/**
 * Add new `Staff` object as an entry into the staff database
 *
 * @remarks
 * The function expects unique staff pass IDs by default.
 * If duplicate staff pass IDs are found, keep the entry with the least redeeming privileges,
 * i.e. the most recently-created entry.
 *
 * The function expects staff records to be created before the current time.
 * Entries created in the future (after the current epoch timestamp) will be discarded.
 *
 * @param staffDB - Map of staff pass IDs to `Staff` objects
 * @param staff - New `Staff` entry to be added into the database
 */
function addStaff(staffDB, staff) {
    const staffID = staff.staff_pass_id;
    const entry = staffDB.get(staffID);
    // Handle future entries
    const now = Date.now();
    if (now < staff.created_at) {
        log.warn(`Staff with ID ${staffID} created in the future`);
        return;
    }
    // Handle non-duplicate entries
    else if (entry === undefined) {
        staffDB.set(staffID, staff);
        return;
    }
    // Handle duplicate entries - keep the most recently-created entry
    log.warn(
        `Duplicate staff pass ID ${staffID} found; discarding outdated entry`
    );
    if (entry.created_at < staff.created_at) {
        staffDB.set(staffID, staff);
    }
}
exports.addStaff = addStaff;
/**
 * Populates database of staff members from CSV file
 *
 * @see addStaff
 *
 * @param staffDB - Map of staff pass IDs to `Staff` objects
 * @param filePath - Filepath of CSV file to load
 */
function populateStaffDatabase(staffDB, filePath) {
    log.info('Populating staff database from CSV file');
    if (!(0, fs_1.existsSync)(filePath)) {
        log.error(
            `Specified filepath ${filePath} not found, database unpopulated`
        );
        return;
    }
    // Pipe CSV file into parser and read each entry line by line
    (0, fs_1.createReadStream)(filePath)
        .pipe((0, csv_parser_1.default)())
        .on('data', staff => addStaff(staffDB, staff))
        .on('end', () => log.info('Staff database ready for use'));
}
exports.populateStaffDatabase = populateStaffDatabase;
/**
 * Determines if a staff pass ID is valid
 *
 * @param staffDB - Map of staff pass IDs to `Staff` objects
 * @param staffID - Pass ID of staff member
 *
 * @returns True if the pass ID is present in the staff database, false otherwise
 */
function isStaffValid(staffDB, staffID) {
    if (!staffID) {
        log.error('Staff pass ID is required but not specified');
        return false;
    } else if (!staffDB.has(staffID)) {
        log.warn(`Staff pass ID ${staffID} not found in database`);
        return false;
    }
    return true;
}
exports.isStaffValid = isStaffValid;
/**
 * Determines if a team can redeem their gift
 *
 * @remarks
 * The function prevents concurrent modification to the redeem database
 * to avoid allowing two staff members to simultaneously redeem their team gifts.
 *
 * The function asserts that the team name provided is valid.
 *
 * @param mutex - Mutex to lock the redeem database
 * @param redeemDB - Map of all team(s) that have redeemed their gift to the epoch timestamp that the gift was redeemed
 * @param team - Name of team intending to redeem gift
 *
 * @returns True if the team can redeem their gift, false otherwise; undefined if any errors occur
 */
function canTeamRedeemGift(mutex, redeemDB, team) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = undefined;
        try {
            // Prepare to access shared database
            const release = yield mutex.acquire();
            try {
                result = !redeemDB.has(team);
                if (result) {
                    // Update shared database with new redemption record
                    redeemDB.set(team, Date.now());
                }
            } finally {
                release();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error) {
            log.fatal(new Error(error));
        }
        return result;
    });
}
exports.canTeamRedeemGift = canTeamRedeemGift;
/**
 * Formats a `Date` object to a string of format "DD/MM/YYYY HH:mm:ss"
 *
 * @param date - The `Date` object to format
 *
 * @returns The formatted string
 */
function formatDate(date) {
    return (
        `${date.getDate().toString().padStart(2, '0')}/` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
        `${date.getFullYear()} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`
    );
}
exports.formatDate = formatDate;
/**
 * Main server execution
 *
 * @returns Express App for hosting server
 */
function main() {
    // Initialise hash maps as local databases
    const redeemDB = new Map();
    const staffDB = new Map();
    populateStaffDatabase(
        staffDB,
        '../assets/staff-id-to-team-mapping-long.csv'
    );
    log.trace(staffDB);
    const mutex = new async_mutex_1.Mutex();
    // Set up Express
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.post('/redeem', (request, response) =>
        __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Ensure valid staff pass IDs
            const staffID =
                (_a = request.body) === null || _a === void 0
                    ? void 0
                    : _a.input;
            if (!isStaffValid(staffDB, staffID)) {
                return response
                    .status(200)
                    .json({ message: 'Staff pass ID not recognised.' });
            }
            // Check if team can redeem gift
            const team = staffDB.get(staffID).team_name;
            const valid = yield canTeamRedeemGift(mutex, redeemDB, team);
            if (valid === undefined) {
                return response
                    .status(500)
                    .json({
                        message: 'Internal server error; try again later.',
                    });
            } else if (valid) {
                // Expecting `redeemDB` to be updated with the new redemption record(s)
                log.info(
                    `Team ${team} redeeming their gift at ` +
                        `${formatDate(new Date(redeemDB.get(team)))}`
                );
                return response.status(200).json({
                    message: `Congratulations, team ${team}! Please redeem your gift.`,
                });
            } else {
                return response.status(200).json({
                    message: `Team ${team}, you have already redeemed your gift!`,
                });
            }
        })
    );
    return app;
}
const app = main();
exports.default = app;
