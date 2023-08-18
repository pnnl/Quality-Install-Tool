import { FC, useState } from "react";
import TextInput from "./text_input"
import { pathToId } from "../utilities/paths_utils";

interface NotesInputProps {
    value?: string | null,
    updateValue: ((id: string, notes: string) => void) | undefined;
    id: string,
}
const NotesInput: FC<NotesInputProps> =({
    value,
    updateValue,
    id
}) => {
    const [notes, updateNotes] = useState(value)
    const notesId = `${id}.notes`
    const handleNotesChange = (inputValue: string) => {
        updateNotes(inputValue)
        updateValue && updateValue(notesId, inputValue)
    }
    return (
        <TextInput
            id={notesId}
            label="Notes"
            value={
                notes || ''
            }
            updateValue={value => {
                handleNotesChange(value)
            }}
            min={0}
            max={280}
            regexp={/.*/}
            disabled={
                !updateValue
            }
        />
    )
}

export default NotesInput
