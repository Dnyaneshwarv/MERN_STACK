import React, { useEffect, useState } from 'react';

const Statistics = () => {
    const [statistics, setStatistics] = useState({ totalSales: 0, totalSold: 0, totalNotSold: 0 });

    useEffect(() => {
        // Fetch statistics based on selected month
    }, []);

    return (
        <div>
            <h2>Statistics</h2>
            <p>Total Sales: {statistics.totalSales}</p>
            <p>Total Sold Items: {statistics.totalSold}</p>
            <p>Total Not Sold Items: {statistics.totalNotSold}</p>
        </div>
    );
};

export default Statistics;