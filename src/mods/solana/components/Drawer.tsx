import React from 'react';
import './Drawer.css'
import {Icon} from "./Icon";

export const Drawer = ({children}) => {
    const [width, setWidth] = React.useState(0)
    return (
        <>
            <div className="solarea-drawer" style={{width}}>
                <div className="solarea-drawer-closebtn acc" onClick={()=>setWidth(0)}><Icon name="close"/></div>
                {children}
            </div>
            <div className="solarea-drawer-openbtn" onClick={()=>setWidth(300)}><Icon name="burger"/></div>
        </>
    )
}