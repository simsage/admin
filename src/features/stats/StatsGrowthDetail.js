import React from "react";
import GrowthByMonth from "./GrowthByMonth";
import {formatStorageSize} from "./chart-utils";

/*
   documentCountByMonth: "yyyy/MM" -> int
   documentSizeByMonth: "yyyy/MM" -> long
   documentTypeMap: "documentType" -> int
   languageMap: "languageCode" -> int
   totalByteSize: long
   totalDocumentSize: int
 */

export default function StatsGrowthDetail(props) {

    if (!props || !props.data)
        return (<div />)

    const displayStyle = props.displayStyle;

    const total_byte_size = formatStorageSize(props.data.totalByteSize);
    const total_doc_count = props.data.totalDocumentSize.toLocaleString();

    return (
        <div className="w-100 mt-4">

            <div className="form-group row mt-2 mb-2" title="total number of bytes">
                <div className="small col-2">total number of bytes</div>
                <div className="col-2">{total_byte_size}</div>
            </div>

            <div className="form-group row mb-2" title="total number of documents">
                <div className="small col-2">total number of documents</div>
                <div className="col-2">{total_doc_count}</div>
            </div>

            {
                displayStyle === "bytes" &&
                <GrowthByMonth data={props.data.documentSizeByMonth} displayStyle={displayStyle} name="data volume"/>
            }

            {
                displayStyle === "count" &&
                <GrowthByMonth data={props.data.documentCountByMonth} displayStyle={displayStyle} name="document count"/>
            }

        </div>
    )

}


