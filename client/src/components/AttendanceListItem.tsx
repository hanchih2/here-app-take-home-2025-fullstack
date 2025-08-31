import { IAttendance } from "../models/model";

function AttendanceListItem({attendance}: {attendance: IAttendance}) {
    return (
        <div>
            uin: {attendance.uin}, classId: {attendance.classId}, date: {attendance.date? attendance.date.toString() : "no date available"}, takenBy: {attendance.takenBy}
        </div>
    );
}

export default AttendanceListItem; 