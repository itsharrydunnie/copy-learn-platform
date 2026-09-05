import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from '../../utils/logger.util';
import Role from '@/modules/authentication/role/role.model';
import { IRoleDoc } from '../../utils/interfaces.util';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @name rolesData
 * @description Reads and parses the roles data from JSON file
 * @type {Object} rolesData - Contains array of role objects
 */
const rolesData = JSON.parse(
    fs.readFileSync(`${__dirname.split('config')[0]}_data/roles.json`, 'utf-8'),
);

/**
 * @name seedRoles
 * @description Seeds the roles collection in the database using environment variables
 * @returns {Promise<void>}
 * @throws {Error} If there's an error reading the file or inserting data
 */
const seedRoles = async () => {
    try {
        const roles: Array<IRoleDoc> = await Role.find({});

        if (roles.length === 0) {
            const seed = await Role.insertMany(rolesData);

            if (seed) {
                logger.log({
                    data: 'Roles data seeded successfully',
                    type: 'info',
                });

                // Optional: Log each inserted role
                for (const role of seed) {
                    logger.log({
                        data: `Role ${role.name} seeded successfully`,
                        type: 'info',
                    });
                }
            }
        } else {
            logger.log({
                data: 'Roles already exist, seeding skipped',
                type: 'info',
            });
        }
    } catch (error) {
        logger.log({
            label: 'SEEDING_ERROR',
            data: `Failed to seed roles: ${(error as Error).message}`,
            type: 'error',
        });
    }
};

export default seedRoles;
