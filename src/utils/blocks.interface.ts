/**
 * Block Interface
 * Defines the structure for content blocks used in projects, tasks, and other entities.
 * Blocks allow flexible content composition (text, images, code, lists, etc.)
 */
export interface IBlockDoc {
    type: BlockType;
    content: string;
    metadata?: BlockMetadata;
    children?: IBlockDoc[]; // Nested blocks for complex content
    order: number; // For ordering within a parent
}

/**
 * Block Types
 * Enumerates all supported block types
 */
export enum BlockType {
    // Text blocks
    PARAGRAPH = 'paragraph',
    HEADING_1 = 'heading_1',
    HEADING_2 = 'heading_2',
    HEADING_3 = 'heading_3',
    HEADING_4 = 'heading_4',
    HEADING_5 = 'heading_5',
    HEADING_6 = 'heading_6',
    QUOTE = 'quote',
    CODE = 'code',

    // List blocks
    BULLETED_LIST = 'bulleted_list',
    NUMBERED_LIST = 'numbered_list',
    CHECKLIST = 'checklist',

    // Media blocks
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    FILE = 'file',

    // Interactive blocks
    LINK = 'link',
    BUTTON = 'button',
    EMBED = 'embed',

    // Layout blocks
    DIVIDER = 'divider',
    SPACER = 'spacer',

    // Advanced blocks
    TABLE = 'table',
    MENTION = 'mention',
    HASHTAG = 'hashtag',

    // Custom blocks
    CUSTOM = 'custom',
}

/**
 * Block Metadata
 * Additional information about a block
 */
export interface BlockMetadata {
    // Text styling
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    code?: boolean;
    color?: string;
    backgroundColor?: string;

    // Alignment
    align?: 'left' | 'center' | 'right' | 'justify';

    // List properties
    checked?: boolean; // For checklist items
    level?: number; // For list nesting

    // Code properties
    language?: string; // Programming language for code blocks

    // Media properties
    alt?: string; // Alt text for images
    width?: number;
    height?: number;
    url?: string; // External URL for media

    // Link properties
    href?: string;
    target?: '_self' | '_blank' | '_parent' | '_top';

    // Embed properties
    embedUrl?: string;
    embedType?: 'youtube' | 'vimeo' | 'twitter' | 'github' | 'custom';

    // Table properties
    rows?: number;
    columns?: number;
    tableData?: string[][];

    // Custom data
    custom?: Record<string, any>;

    // References
    mentions?: string[]; // Array of user IDs
    tags?: string[]; // Array of tags
}

/**
 * Block Input DTO
 * Used when creating/updating blocks
 */
export interface CreateBlockDTO {
    type: BlockType;
    content: string;
    metadata?: BlockMetadata;
    children?: CreateBlockDTO[];
    order?: number;
}

/**
 * Block Update DTO
 */
export interface UpdateBlockDTO {
    type?: BlockType;
    content?: string;
    metadata?: BlockMetadata;
    children?: IBlockDoc[];
    order?: number;
}
