import React from 'react';
import {getType} from "../../dataflow/utils/getType";
import {Button} from "antd";

export const DataflowSubMenu = ({onSave}) => {
    return (
        <div className="dataflow__sub-menu">
                <div className="dataflow__workspace__toolbar">
                    <Button onClick={() => onSave()}>Save</Button>
                </div>
        </div>
    )
}