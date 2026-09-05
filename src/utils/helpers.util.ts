import slugify from 'slugify';
import { FileMimeType, FileType, S3Folder } from './enums.util';

export const generatePassword = (length: number = 16) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    const getRandomChar = (charset: string) =>
        charset[Math.floor(Math.random() * charset.length)];

    // Ensure password meets all requirements
    let password = [
        getRandomChar(uppercase),
        getRandomChar(lowercase),
        getRandomChar(numbers),
        getRandomChar(special),
    ];

    const allChars = uppercase + lowercase + numbers + special;
    for (let i = password.length; i < length; i++) {
        password.push(getRandomChar(allChars));
    }

    // Shuffle the password to make it more random
    return password.sort(() => Math.random() - 0.5).join('');
};

/**
 * Generates random characters
 * @param length - The length of the characters to generate.
 * @returns A randomly generated characters.
 */
export const generateRandomChars = (length: number = 20) => {
    const numberChars = '0123456789';
    const letterChars = 'abcdefghijklmnopqrstuvwxyz';
    const allChars = numberChars + letterChars;

    const shuffle = (str: string) =>
        str
            .split('')
            .sort(() => 0.5 - Math.random())
            .join('');

    const shuffledChars = shuffle(allChars);

    const randomChars = shuffledChars.slice(0, length);

    return randomChars;
};

export const checkUniqueName = async (Model: any, name: string) => {
    // check if user already exists
    const existingUser = await Model.findOne({ username: genSlug(name) });

    if (existingUser) return true;
    else return false;
};

export const genSlug = (arg: string) => {
    const val = slugify(arg, { lower: true, trim: true });
    return val;
};

export const createUniqueFileName = (arg: string, ext: string) => {
    const val = genSlug(arg);
    const fileName = `${val}-${Date.now()}.${ext}`;

    return fileName;
};

export const determineFileType = (mimeType: FileMimeType): FileType => {
    if (mimeType.startsWith('audio/')) return FileType.AUDIO;
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType.startsWith('video/')) return FileType.VIDEO;
    if (mimeType === 'application/pdf') return FileType.DOCUMENT;
    throw new Error(`Unsupported MIME type: ${mimeType}`);
};

export const genFileName = (
    name: string | undefined,
    fileType: FileType,
): string => {
    const baseName = name?.trim() && name.length > 0 ? name : 'troott-file';

    const now = new Date();
    const day = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]?.replace(/:/g, '-') || ''; // HH-MM-SS

    return `${baseName}-${fileType.toLowerCase()}-${day}-${time}`;
};

interface GetS3Folder {
    (mimeType: string): S3Folder;
}

export const getS3Folder: GetS3Folder = (mimeType: string): S3Folder => {
    switch (mimeType) {
        // Images
        case 'image/jpeg':
        case 'image/png':
        case 'image/webp':
        case 'image/svg+xml':
            return S3Folder.IMAGES;

        // Audio
        case 'audio/mpeg':
        case 'audio/mp3':
        case 'audio/wav':
        case 'audio/aac':
        case 'audio/x-m4a':
            return S3Folder.AUDIO;

        // Video
        case 'video/mp4':
        case 'video/webm':
            return S3Folder.VIDEOS;

        // Documents
        case 'application/pdf':
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'text/plain':
            return S3Folder.DOCUMENTS;

        default:
            return S3Folder.OTHERS;
    }
};
