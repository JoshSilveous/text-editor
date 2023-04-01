import { PathLike } from "original-fs"

declare global { 
    interface Window {
        /**
         * A user-defined API that carries functions over from preload.ts to the renderer
         */
        api: {
            /**
             * Prompts user to select a file, or create a new file, using OS dialog
             * @returns The path to selected file
             */
            fileSelect: () => Promise<PathLike>,
            /**
             * Reads a file
             * @param filePath The path to the file
             * @returns Selected file's data
             */
            readFile: (filePath: PathLike) => Promise<string>,
            /**
             * Re-writes a file with provided content
             * @param filePath The path to the file being modified
             * @param content The new data
             */
            writeFile: (filePath: PathLike, content: string) => Promise<void>
        }
    }
}