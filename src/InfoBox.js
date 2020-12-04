import React from 'react'
import {Card,CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography'
import "./InfoBox.css"

function InfoBox({title, cases ,total,isRed,active, ...props}) {
    return (
        <Card 
        onClick={props.onClick}
        className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
            <CardContent>
                <Typography color='textSecondary' >{title}</Typography>

                <h2 class={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>+{cases}</h2>
                
                <Typography color='textSecondary' class="infobox_total">{total} Total</Typography>
            </CardContent>

        </Card>
    )
}

export default InfoBox
