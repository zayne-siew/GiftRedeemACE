import bodyParser from 'body-parser';
import csvParser from 'csv-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import helmet from 'helmet';
import { ILogObj, Logger } from 'tslog';
import { Mutex, MutexInterface } from 'async-mutex';

const log: Logger<ILogObj> = new Logger({ minLevel: 3 });

/** An official staff member at GovTech */
export type Staff = {
    staff_pass_id: string;
    team_name: string;
    created_at: number;
};

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
export function addStaff(staffDB: Map<string, Staff>, staff: Staff): void {
    const staffID: string = staff.staff_pass_id;
    const entry: Staff | undefined = staffDB.get(staffID);

    // Handle future entries
    const now: number = Date.now();
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
    if (entry!.created_at < staff.created_at) {
        staffDB.set(staffID, staff);
    }
}

/**
 * Populates database of staff members from CSV file
 *
 * @see addStaff
 *
 * @param staffDB - Map of staff pass IDs to `Staff` objects
 * @param filePath - Filepath of CSV file to load
 */
export function populateStaffDatabase(
    staffDB: Map<string, Staff>,
    filePath: string
): void {
    log.info('Populating staff database from CSV file');

    if (!existsSync(filePath)) {
        log.error(
            `Specified filepath ${filePath} not found, database unpopulated`
        );
        return;
    }

    // Pipe CSV file into parser and read each entry line by line
    createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (staff: Staff) => addStaff(staffDB, staff))
        .on('end', () => log.info('Staff database ready for use'));
}

/**
 * Determines if a staff pass ID is valid
 *
 * @param staffDB - Map of staff pass IDs to `Staff` objects
 * @param staffID - Pass ID of staff member
 *
 * @returns True if the pass ID is present in the staff database, false otherwise
 */
export function isStaffValid(
    staffDB: Map<string, Staff>,
    staffID: string
): boolean {
    if (!staffID) {
        log.error('Staff pass ID is required but not specified');
        return false;
    } else if (!staffDB.has(staffID)) {
        log.warn(`Staff pass ID ${staffID} not found in database`);
        return false;
    }
    return true;
}

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
export async function canTeamRedeemGift(
    mutex: Mutex,
    redeemDB: Map<string, number>,
    team: string
): Promise<boolean | undefined> {
    let result: boolean | undefined = undefined;

    try {
        // Prepare to access shared database
        const release: MutexInterface.Releaser = await mutex.acquire();

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
    } catch (error: any) {
        log.fatal(new Error(error));
    }

    return result;
}

/**
 * Formats a `Date` object to a string of format "DD/MM/YYYY HH:mm:ss"
 *
 * @param date - The `Date` object to format
 *
 * @returns The formatted string
 */
export function formatDate(date: Date): string {
    return (
        `${date.getDate().toString().padStart(2, '0')}/` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
        `${date.getFullYear()} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`
    );
}

/**
 * Main server execution
 *
 * @returns Express App for hosting server
 */
function main(): Express {
    // Initialise hash maps as local databases
    const redeemDB: Map<string, number> = new Map();
    const staffDB: Map<string, Staff> = new Map();
    populateStaffDatabase(
        staffDB,
        '../assets/staff-id-to-team-mapping-long.csv'
    );
    log.trace(staffDB);

    const mutex: Mutex = new Mutex();

    // Set up Express
    const app: Express = express();
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/redeem', async (request: Request, response: Response) => {
        // Ensure valid staff pass IDs
        const staffID: string = request.body?.input;
        if (!isStaffValid(staffDB, staffID)) {
            return response
                .status(200)
                .json({ message: 'Staff pass ID not recognised.' });
        }

        // Check if team can redeem gift
        const team: string = staffDB.get(staffID)!.team_name;
        const valid: boolean | undefined = await canTeamRedeemGift(
            mutex,
            redeemDB,
            team
        );
        if (valid === undefined) {
            return response
                .status(500)
                .json({ message: 'Internal server error; try again later.' });
        } else if (valid) {
            // Expecting `redeemDB` to be updated with the new redemption record(s)
            log.info(
                `Team ${team} redeeming their gift at ` +
                    `${formatDate(new Date(redeemDB.get(team)!))}`
            );
            return response.status(200).json({
                message: `Congratulations, team ${team}! Please redeem your gift.`,
            });
        } else {
            return response.status(200).json({
                message: `Team ${team}, you have already redeemed your gift!`,
            });
        }
    });

    return app;
}

const app: Express = main();
export default app;
