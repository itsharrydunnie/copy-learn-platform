import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import {
    IBusinessDoc,
    BusinessType,
    VerificationType,
} from '../../src/modules/business/business.interface';
import Business from '../../src/modules/business/business.model';
import { IUserDoc } from '../../src/modules/user/user.interface';
import { genUserCode } from '../../src/utils/code.util';
import { UserType } from '../../src/modules/user/user.interface';
import { genSlug } from '../../src/utils/helpers.util';

/**
 * Factory for creating test business data
 */

export interface BusinessFactoryOptions {
    businessName?: string;
    businessType?: BusinessType;
    industry?: string;
    email?: string;
    user?: IUserDoc;
    createdBy?: string;
    isPublic?: boolean;
    verificationStatus?: VerificationType;
}

/**
 * Creates a business factory data object
 */
export const createBusinessData = (
    options: BusinessFactoryOptions = {},
): Partial<IBusinessDoc> => {
    const {
        businessName = faker.company.name(),
        businessType = BusinessType.COMPANY,
        industry = faker.company.buzzNoun(),
        email,
        user,
        createdBy,
        isPublic = false,
        verificationStatus = VerificationType.UNVERIFIED,
    } = options;

    const businessEmail =
        email || user?.email || faker.internet.email().toLowerCase();
    const slug = genSlug(businessName);

    return {
        code: genUserCode(UserType.BUSINESS),
        firstName: user?.firstName || faker.person.firstName(),
        lastName: user?.lastName || faker.person.lastName(),
        slug,
        email: businessEmail,
        businessName,
        businessType,
        description: faker.company.catchPhrase(),
        size: faker.helpers.arrayElement([
            '1-10',
            '11-50',
            '51-200',
            '201-500',
            '500+',
        ]),
        industry,
        tags: faker.helpers.arrayElements(
            ['tech', 'finance', 'healthcare', 'education', 'retail'],
            { min: 1, max: 3 },
        ),
        website: faker.internet.url(),
        socials: [
            {
                name: 'twitter',
                url: `https://twitter.com/${faker.internet.userName()}`,
                username: faker.internet.userName(),
            },
        ],
        verification: {
            status: verificationStatus,
            verifiedBy: null,
            verifiedAt:
                verificationStatus === VerificationType.VERIFIED
                    ? new Date()
                    : new Date(), // Always set a date (interface requires Date, model allows undefined)
            reason: '',
        } as any, // Type assertion: interface requires Date but model allows undefined
        registration: {
            RegisteredBusinessName: businessName,
            registrationNumber: faker.string.alphanumeric(10).toUpperCase(),
            registrationDate: faker.date.past(),
            registrationCountry: faker.location.countryCode(),
        },
        isPublic,
        createdBy: createdBy || user?._id || user?.id,
        user: user?._id || user?.id,
        settings: [],
        workspaces: [],
        transactions: [],
        templates: [],
        discovery: [],
        customDomain: [],
        hackathons: [],
        entries: [],
        submissions: [],
        projects: [],
        teams: [],
        tasks: [],
    };
};

/**
 * Creates and saves a test business
 */
export const createBusiness = async (
    options: BusinessFactoryOptions = {},
): Promise<IBusinessDoc> => {
    const businessData = createBusinessData(options);
    const business = await Business.create(businessData);
    return business;
};

/**
 * Creates multiple test businesses
 */
export const createBusinesses = async (
    count: number,
    options: BusinessFactoryOptions = {},
): Promise<IBusinessDoc[]> => {
    const businesses: IBusinessDoc[] = [];
    for (let i = 0; i < count; i++) {
        businesses.push(await createBusiness(options));
    }
    return businesses;
};
