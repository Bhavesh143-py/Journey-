import { useState, useEffect } from "react";

export function ProgressRender({ startDate, endDate }) {
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [timePeriod, setTimePeriod] = useState("week");
    const [total, setTotal] = useState(0);
    const [passed, setPassed] = useState(0);

    useEffect(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();

        let totalUnits, passedUnits;
        if (timePeriod === "week") {
            totalUnits = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
            passedUnits = Math.ceil((today - start) / (1000 * 60 * 60 * 24 * 7));
        } else if (timePeriod === "month") {
            totalUnits = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30));
            passedUnits = Math.ceil((today - start) / (1000 * 60 * 60 * 24 * 30));
        } else {
            totalUnits = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            passedUnits = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
        }

        setTotal(totalUnits);
        setPassed(passedUnits);
        setProgressPercentage((passedUnits / totalUnits) * 100);
    }, [startDate, endDate, timePeriod]);

    return (
        <div className="flex space-x-2 mt-4">
            <select
                name="timeFrame"
                id="TimeFrame"
                onChange={(e) => setTimePeriod(e.target.value)}
                value={timePeriod}
            >
                <option value="week">Weeks</option>
                <option value="month">Months</option>
                <option value="day">Days</option>
            </select>
            <p>{timePeriod}</p>
            {[...Array(total)].map((_, i) => (
                <div
                    key={i}
                    className={`w-8 h-8 bg-gray-300 rounded ${i < passed ? 'bg-green-500' : ''}`}
                ></div>
            ))}
        </div>
    );
}
