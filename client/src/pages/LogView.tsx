import { useEffect, useState } from "react";
import LogListItem from "../components/LogListItem";
import { ILog } from "../models/model"
import axios from "axios";

type LogResp = {
    message: string,
    data: Array<ILog>
  }

function LogView() {
    const [logs, setLogs] = useState<ILog[]>([])
    useEffect( () => {
        const fetchLogs = async () => {
        console.log("fetch logs")
        try {
            const resp = await axios.create({baseURL: 'http://127.0.0.1:4000'}).get<LogResp>('logs')
            // console.log(resp.data.data[0].date)
            setLogs(resp.data.data)
        } catch(e) {
            if (e instanceof Error) {
            console.log("Error: " + e.message)
            }
        }
        }
        fetchLogs()   
    }, [])
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