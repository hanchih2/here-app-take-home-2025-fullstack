import LogListItem from "../components/LogListItem";
import { ILog } from "../models/model"


function LogView({logs} : {logs: ILog[]}) {
    // console.log(attendance[0])
    return (
        <div>
            {
                logs.map((l, i) =>
                    <LogListItem key={i} log={l}/>
                )
            }
        </div>
    );
}

export default LogView;