import { glob } from 'tinyglobby';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    ALLOWED_PATHS,
    IGNORED_DIRS
} from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// agent/
const AGENT_ROOT = path.resolve(__dirname, '..');

// repository root
const PROJECT_ROOT = path.resolve(AGENT_ROOT, '..');

function isAllowed(filePath) {
    const absolute = path.resolve(PROJECT_ROOT, filePath);

    return ALLOWED_PATHS.some((allowed) =>

        absolute.startsWith(
            path.resolve(PROJECT_ROOT, allowed)
        )
    );
}

export async function loadProject() {
    const patterns = ALLOWED_PATHS.map(
        (dir) => `${dir}/**/*.{js,vue}`
    );

    const files = await glob(patterns, {
        cwd: PROJECT_ROOT,
        ignore: IGNORED_DIRS.map(
            (dir) => `**/${dir}/**`
        ),
        onlyFiles: true,
        absolute: false
    });

    const result = [];

    for (const file of files) {
        if (!isAllowed(file)) {
            continue;
        }

        const content = await fs.readFile(
            path.resolve(PROJECT_ROOT, file),
            'utf8'
        );

        result.push({
            path: file,
            content
        });
    }

    return result;
}