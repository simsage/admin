import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getDocumentStats, showUpdateStatsForm} from "../document_management/documentSlice";
import StatsGrowthDetail from "./StatsGrowthDetail";
import DocumentBreakdown from "./DocumentBreakdown";
import RefreshStatsAsk from "./RefreshStatsAsk";
import {IMAGES} from "../../common/api";

/*
 kb_stats.globalStats
   {documentCountByMonth, documentSizeByMonth, documentTypeMap,
    languageMap, totalByteSize, totalDocumentSize}
 kb_stats.sourceMap
 kb_stats.sourceStats
 */
export default function DocumentStatsHome() {
    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const [displayStyle, setDisplayStyle] = useState('bytes'); // bytes or count
    const [displayTypeList, setDisplayTypeList] = useState([{key: 0, name: ''}]);
    const [selectedDisplayType, setSelectedDisplayType] = useState(0);
    const [selectedSourceStats, setSelectedSourceStats] = useState({});

    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const kb_stats = useSelector((state) => state.documentReducer.kb_stats);

    const language_lookup = {
        "en": "English",
        "pt": "Portuguese",
        "nl": "Dutch",
        "de": "German",
        "fr": "French",
        "es": "Spanish",
        "it": "Italian",
        "tr": "Turkish",
        "el": "Greek",
        "ar": "Arabic",
        "ko": "Korean",
        "ja": "Japanese",
        "ru": "Russian",
        "hi": "Hindi",
        "zh": "Chinese language groups",
        "unknown": "unknown"
    }

    useEffect(() => {
        re_get_statistics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kb_id])

    useEffect(() => {
        if (kb_stats && kb_stats.sourceMap) {
            let display_type_list = [{key: 0, name: 'knowledge base'}];
            const source_keys = Object.keys(kb_stats.sourceMap).sort();
            for (const source_id of source_keys) {
                if (!kb_stats.sourceMap.hasOwnProperty(source_id)) continue;
                const source_name = kb_stats.sourceMap[source_id]?.name;
                display_type_list.push({key: source_id, name: "source: " + source_name});
            }
            setDisplayTypeList(display_type_list);
        }
    }, [kb_stats]);

    function change_display_type(value) {
        const valueInt = parseInt(value)
        setSelectedDisplayType(valueInt);
        if (valueInt === 0) {
            setSelectedSourceStats({});
        } else if (kb_stats.sourceStats.hasOwnProperty(valueInt)) {
            setSelectedSourceStats(kb_stats.sourceStats[valueInt]);
        }
    }

    const handleCalculateStats = () => {
        dispatch(showUpdateStatsForm());
    }

    const re_get_statistics = () => {
        if (kb_id) {
            dispatch(getDocumentStats({
                session_id: session_id,
                organisation_id: organisation_id,
                kb_id: kb_id
            }))
        }
    }

    return (
        <div className="px-5 pt-4">

            <RefreshStatsAsk />

            <div className="row">
                <div className="col-4">
                    <select value={selectedDisplayType} autoFocus={true}
                            className="form-select filter-text-width "
                            onChange={(e) => {
                                change_display_type(e.target.value);
                            }}>
                        {displayTypeList && displayTypeList.map((r, _) => {
                            return (
                                <option key={r.key} value={r.key}>{r.name}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="col-4">
                    <select value={displayStyle} autoFocus={true}
                            className="form-select filter-text-width "
                            onChange={(e) => {
                                setDisplayStyle(e.target.value);
                            }}>
                        <option value="bytes">data volume</option>
                        <option value="count">document count</option>
                    </select>
                </div>
                <div className="col-1">
                </div>
                <div className="col-2">
                    <button title="update knowledge base statistics"
                            onClick={() => handleCalculateStats()}
                            type="button" className="btn btn-primary px-4">Update Statistics
                    </button>
                </div>
                <div className="col-1">
                    {kb_id && kb_id.length > 0 &&
                        <div className="btn" onClick={() => re_get_statistics()}>
                            <img src={IMAGES.REFRESH_IMAGE} className="refresh-image"
                                 alt="refresh"
                                 title="get fresh statistics from server"/>
                        </div>
                    }
                </div>
            </div>

            <div className="d-flex justify-content-beteween w-100 mb-4">
                {selectedDisplayType === 0 &&
                    <StatsGrowthDetail
                        displayStyle={displayStyle}
                        data={kb_stats.globalStats}/>
                }
                {selectedDisplayType > 0 &&
                    <StatsGrowthDetail
                        displayStyle={displayStyle}
                        data={selectedSourceStats}/>
                }
            </div>

            {selectedDisplayType === 0 && kb_stats && kb_stats.globalStats &&
                <div>
                    <span style={{width: "400px", height: "400px", display: "inline-block"}}>
                        <DocumentBreakdown data={kb_stats.globalStats.documentTypeMap} name="documents by type"/>
                    </span>
                    <span style={{width: "400px", height: "400px", display: "inline-block"}}>
                        <DocumentBreakdown data={kb_stats.globalStats.languageMap}
                                           keyLookup={language_lookup}
                                           name="documents by language"/>
                    </span>
                </div>
            }
            {selectedDisplayType > 0 && selectedSourceStats &&
                <div>
                    <span style={{width: "400px", height: "400px", display: "inline-block"}}>
                        <DocumentBreakdown data={selectedSourceStats.documentTypeMap} name="documents by type"/>
                    </span>
                    <span style={{width: "400px", height: "400px", display: "inline-block"}}>
                        <DocumentBreakdown data={selectedSourceStats.languageMap}
                                           keyLookup={language_lookup}
                                           name="documents by language"/>
                    </span>
                </div>
            }


        </div>
    )
}