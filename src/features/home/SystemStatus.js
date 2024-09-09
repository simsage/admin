import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getSystemStatus} from "../auth/authSlice";
import Api from "../../common/api";

// SimSage cluster status display (k8s nodes and services)
export default function SystemStatus() {
    const dispatch = useDispatch();

    const system_status = useSelector((state) => state.authReducer.system_status)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state.authReducer.session)

    useEffect(() => {
        if (system_status === undefined && session && session.id && organisation_id) {
            dispatch(getSystemStatus({organisation_id: organisation_id, session_id: session.id}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [system_status, session, organisation_id]);

    return (
        <div className={"overflow-y-auto dialog-height"}>
            <div className="p-4">
                <div className="row fw-bold mb-2">
                    <div className="col-12">SimSage Cluster</div>
                </div>
                <div className="row fw-bold mb-2">
                    <div className="col-2">Node</div>
                    <div className="col-1">Status</div>
                    <div className="col-2">Up since</div>
                    <div className="col-2">Labels</div>
                    <div className="col-1">IP address</div>
                    <div className="col-1">CPU</div>
                    <div className="col-1">Memory</div>
                    <div className="col-2"></div>
                </div>
                {
                    system_status && system_status.nodeList &&
                    system_status.nodeList.map((node, index) => {
                        return (
                            <div className="row" key={index}>
                                <div className="col-2">{node.name}</div>
                                <div className="col-1">{node.status}</div>
                                <div className="col-2">{Api.unixTimeConvert(node.startedDateTime)}</div>
                                <div className="col-2">{node.labelList.join(",")}</div>
                                <div className="col-1">{node.ipAddress}</div>
                                <div className="col-1">{node.cpu}</div>
                                <div className="col-1">{Api.formatSizeUnits(node.memory)}</div>
                                <div className="col-2"></div>
                            </div>
                        )
                    })
                }

            </div>


            <div className="p-4">
                <div className="row fw-bold mb-2">
                    <div className="col-12">SimSage Services</div>
                </div>
                <div className="row fw-bold mb-2">
                    <div className="col-2">Pod</div>
                    <div className="col-2">Image</div>
                    <div className="col-1">Node</div>
                    <div className="col-1">Restarts</div>
                    <div className="col-3">Status</div>
                    <div className="col-3"></div>
                </div>
                {
                    system_status && system_status.podList &&
                    system_status.podList.map((pod, index) => {

                        return (
                            <div className="row" key={index}>
                                <div className="col-2">{pod.pod}</div>
                                <div className="col-2">{pod.image}</div>
                                <div className="col-1">{pod.node}</div>
                                <div className="col-1">{pod.restartCount}</div>
                                <div className="col-3">{pod.phase}</div>
                                <div className="col-3"></div>
                            </div>
                        )
                    })
                }

            </div>

        </div>
    )
}

