import { IAttendance } from "../models/model"
import AttendanceListItem from "../components/AttendanceListItem"

function AttendanceView({attendance} : {attendance: IAttendance[]}) {
    console.log(attendance[0])
    return (
        <div>
            {
                attendance.map((a, i) =>
                    <AttendanceListItem key={i} attendance={a}/>
                )
            }
        </div>
    );
}

export default AttendanceView;