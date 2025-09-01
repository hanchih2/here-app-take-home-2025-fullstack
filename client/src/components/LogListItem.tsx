import { ILog } from "../models/model";

function LogListItem({log}: {log: ILog}) {
    return (
        <div>
            attendanceId={log.attendanceId}, date={log.date.toString()}, message: {log.message}
        </div>
    );
}

export default LogListItem; 