import React, { useState, useEffect } from 'react';
import Tooltip from '@uiw/react-tooltip';
import HeatMap from '@uiw/react-heat-map';

export default function HeatMapComponent({ startdate, enddate }) {
    const start = new Date(startdate).toISOString().split('T')[0];
    const end = new Date(enddate).toISOString().split('T')[0];
    const [value1, setValue1] = useState([]);
    
    const startDate = new Date(startdate);
    const endDate = new Date(enddate);
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    useEffect(() => {
        let index = 0;
        const tempValues = [];

        // Ensure startdate is a Date object
        const startDate = new Date(startdate);
        const endDate = new Date(); // Current date

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            // Create a new date instance to avoid mutating the original date object
            const currentDate = new Date(d);
            tempValues.push({
                date: currentDate.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
                count: index++,
                content: ''
            });
        }

        setValue1(tempValues);
    }, [startdate]);

    // Define panel colors with 20% increments based on totalDays
    const panelColors = {
        0: '#f4decd',
        [Math.floor(totalDays * 0.2)]: '#e4b293',
        [Math.floor(totalDays * 0.4)]: '#d48462',
        [Math.floor(totalDays * 0.6)]: '#c2533a',
        [Math.floor(totalDays * 0.8)]: '#ad001d',
        [totalDays]: '#6c0012',
    };

    return (
        <div>
            <HeatMap
                value={value1}
                weekLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                startDate={new Date(start)}
                endDate={new Date(end)}
                panelColors={panelColors}
                rectRender={(props, data) => {
                    // if (!data.count) return <rect {...props} />;
                    return (
                        <Tooltip placement="top" content={`Day: ${data.count || 0}`}>
                            <rect {...props} />
                        </Tooltip>
                    );
                }}
            />
        </div>
    );
}
