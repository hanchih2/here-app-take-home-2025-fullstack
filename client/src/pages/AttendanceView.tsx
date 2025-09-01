import { IAttendance } from "../models/model"
import AttendanceListItem from "../components/AttendanceListItem"
import { useEffect, useState } from "react"
import axios from "axios"

type AttendanceResp = {
    message: string,
    data: Array<IAttendance>
}

const attendanceApi = axios.create({baseURL: 'http://127.0.0.1:4000'})

function AttendanceView() {
    const [attendance, setAttendance] = useState<IAttendance[]>([])

    const [inputUin, setInputUin] = useState<string>('')
    const [inputClassId, setInputClassId] = useState<string>('')
    const [inputTakenBy, setInputTakenBy] = useState<string>('')

    useEffect( () => {
        const fetchAttendance = async () => {
        console.log("fetch attendance")
        try {
            const resp = await attendanceApi.get<AttendanceResp>('attendance')
            console.log(resp.data.data)
            setAttendance(resp.data.data)
        } catch(e) {
            if (e instanceof Error) {
            console.log("Error: " + e.message)
            }
        }
        }
        fetchAttendance()   
    }, [])

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()


        const formData = {
            uin: inputUin,
            classId: inputClassId,
            takenBy: inputTakenBy,
            date: Date.now()
        }

        console.log(formData)

        try {
            const resp = await attendanceApi.post('attendance', formData, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            setAttendance([...attendance, resp.data.data])
            console.log(resp)
            setInputUin('')
            setInputClassId('')
            setInputTakenBy('')
        } catch {

        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                uin: <input type="text" name="uin" value={inputUin} onChange={(e) => setInputUin(e.target.value)} required></input>
                <br/>
                classId: <input type="text" name="classId" value={inputClassId} onChange={(e) => setInputClassId(e.target.value)} required></input>
                <br/>
                takenBy: <input type="text" name="takenBy" value={inputTakenBy} onChange={(e) => setInputTakenBy(e.target.value)} required></input>
                <br/>
                <button type="submit">Take Attendance</button>
            </form>
            {
                attendance.map((a, i) =>
                    <AttendanceListItem key={i} attendance={a}/>
                )
            }
        </div>
    );
}

export default AttendanceView;