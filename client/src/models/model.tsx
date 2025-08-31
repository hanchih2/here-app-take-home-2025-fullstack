export interface IAttendance {
    uin: string;
    classId: string;
    date?: Date;
    takenBy: string;
    _id: string;
}

export interface ILog {
    attendanceId: string;
    message: string;
    date: Date;
}