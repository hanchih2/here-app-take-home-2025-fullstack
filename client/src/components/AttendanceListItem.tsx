import { useState } from "react";
import { IAttendance } from "../models/model";
import axios from "axios";

function AttendanceListItem({attendance}: {attendance: IAttendance}) {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [editUin, setEditUin] = useState<string>(attendance.uin)
    const [editClassId, setEditClassId] = useState<string>(attendance.classId)
    const [editTakenBy, setEditTakenBy] = useState<string>(attendance.takenBy)

    const handleSave = async () => {
        const updateDate = new Date()
        const formData = {
            id: attendance._id,
            uin: editUin,
            classId: editClassId,
            takenBy: editTakenBy,
            date: updateDate
        }

        try {
            const resp = await axios.create({baseURL: 'http://127.0.0.1:4000/attendance'}).post('', formData, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            console.log(resp)
            attendance.uin = editUin
            attendance.classId = editClassId
            attendance.takenBy = editTakenBy
            attendance.date = updateDate
        } catch {

        }
    }

    const handleClickButton = async (e: React.MouseEvent) => {
        if(showForm) {
            await handleSave()
        }
        setShowForm(!showForm)
    }

    return (
        <div>
            <span>
                {!showForm &&
                    (`uin: ${attendance.uin}, classId: ${attendance.classId}, takenBy: ${attendance.takenBy}, date: ${attendance.date? new Date(attendance.date).toISOString() : "no date available"}`)
                }
                {showForm && (
                    <form>
                        uin: <input name="editUin" value={editUin} onChange={(e) => setEditUin(e.target.value)} required></input>,
                        classId: <input name="editClassId" value={editClassId} onChange={(e) => setEditClassId(e.target.value)} required></input>,
                        uin: <input name="editTakenBy" value={editTakenBy} onChange={(e) => setEditTakenBy(e.target.value)} required></input>
                    </form>
                )
                }
                <button onClick={handleClickButton}>{showForm? "save" : "edit"}</button>
            </span>
        </div>
    );
}

export default AttendanceListItem; 