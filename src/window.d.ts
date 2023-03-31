import { PathLike } from "original-fs"

declare global { 
    interface Window {
        /**
         * A user-defined API that carries functions over from preload.ts to the renderer.
         */
        api: {
            /**
             * An example function to demonstrate the main-renderer bridge. Logs a message to the `node` console.
             * @returns A string that says "👋 Im from the example bridge function, running the renderer. "
             */
            fileSelect: () => Promise<PathLike>,
            readFile: (filePath: PathLike) => Promise<string>,
            writeFile: (filePath: PathLike, content: string) => Promise<void>
        }
    }
}