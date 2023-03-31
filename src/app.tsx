import { PathLike } from 'original-fs'
import React from 'react'



export default function App() {

    // An example of a function that uses the ipc context bridge.
    // This function, example(), is running from the main file, and has access to node modules.
    const [filePath, setFilePath] = React.useState<PathLike>("")
    const [fileContent, setFileContent] = React.useState("")
    const [isChanged, setIsChanged] = React.useState(false)
    const contentRef = React.useRef(null)
    

    async function handleOpenFile() {
        let selection = await window.api.fileSelect()
        setFileContent(await window.api.readFile(selection))
        setFilePath(selection)
    }

    async function handleSave(e: any) {
        let content = contentRef.current.innerText
        await window.api.writeFile(filePath, content)
        setIsChanged(false)
        e.target.innerText = "Changes Saved"
        setTimeout(() => {
            e.target.innerText = "Save Changes"
        }, 1500)

    }
    
    return (
    <div id="main">
        <h1>Silveous's awesome file editor</h1>
        <h3>CSET4250 Extra Credit II</h3>
        { filePath == "" ? 
            <div id="buttonwrapper">
                <button onClick={handleOpenFile}>Open File or Create New File</button>
            </div>
            :
            <>
                <div id="filepath">
                    <strong>File Opened:</strong> { filePath as string }
                </div>
                <div 
                    id="filedisplay" 
                    contentEditable="true" 
                    onInput={() => setIsChanged(true)}
                    ref={contentRef}
                >
                    { fileContent }
                </div>
                <div id="buttonwrapper">
                    <button 
                        onClick={handleSave}
                        disabled={!isChanged}
                    >
                        Save Changes
                    </button>
                    <button onClick={() => setFilePath("")}>Close File</button>
                </div>
            </>
        }
    </div>
    )
}