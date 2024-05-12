import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import DirectionsIcon from '@mui/icons-material/DirectionsRun';
import TimerIcon from '@mui/icons-material/Timer';
import SpeedIcon from '@mui/icons-material/Speed';
import Typography from '@mui/material/Typography';

const RunningData = ({ data, unit }) => {
  const { totalDistance, totalTime, pace, miles, splits, speeds } = data;
  console.log(totalDistance, totalTime, pace, miles, splits, speeds)
  useEffect(() => {
    // Log to check if the component re-renders when the unit changes
    console.log('Unit changed:', unit);
  }, [unit]);

  const formatTotalTime = () => {
    const hours = Math.floor(totalTime / 60);
    const minutes = Math.floor(totalTime % 60);
    const remainingSeconds = Math.round((totalTime - Math.floor(totalTime)) * 60);

    let formattedTime = '';

    if (hours > 0) {
      formattedTime += `${hours} Hour${hours > 1 ? 's' : ''} `;
    }

    formattedTime += `${minutes} Minute${minutes !== 1 ? 's' : ''}`;

    if (remainingSeconds > 0) {
      formattedTime += ` ${remainingSeconds} Second${remainingSeconds !== 1 ? 's' : ''}`;
    }

    return formattedTime.trim();
  };

  const formatAveragePace = () => {
    return pace.toFixed(2);
  };

  const getSpeedData = () => {
    let labels = [];
    let dataset = [];
    for (let mile = 0; mile < miles; mile++) {
      labels.push(`${unit === 'miles' ? 'Mile' : 'Km'} ${mile + 1}`);
      dataset.push(speeds[mile].reduce((a, b) => a + b, 0) / splits);
    }
    return {
      labels,
      datasets: [
        {
          label: `Average Speed per ${unit === 'miles' ? 'Mile' : 'Kilometre'}`,
          data: dataset,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    };
  };

  return (
    <div style={{ alignItems: 'center',textAlign: 'center' }}>
      <h1 style={{ marginBottom: '10px', fontSize: '60px' }}>Run Summary</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <DirectionsIcon style={{ marginRight: '8px', fontSize: '30px' }} />
          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
            Total Distance:&nbsp;
          </Typography>
          <Typography variant="subtitle1">
            {totalDistance} {unit === 'miles' ? 'Miles' : 'Kilometres'}
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <TimerIcon style={{ marginRight: '8px', fontSize: '30px' }} />
          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
            Total Time:&nbsp;
          </Typography>
          <Typography variant="subtitle1">
            {formatTotalTime()}
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <SpeedIcon style={{ marginRight: '8px', fontSize: '30px' }} />
          <Typography variant="subtitle1" style={{ fontWeight: 'bold'}}>
            Average Pace:&nbsp;
          </Typography>
          <Typography variant="subtitle1">
            {formatAveragePace()} {unit === 'miles' ? 'Mph' : 'Kph'}
          </Typography>
        </div>
        <div >
          <Bar
            data={getSpeedData()}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const speed = context.parsed.y;
                      const unitLabel = unit === 'miles' ? 'Mph' : 'Kph';
                      return `Speed: ${speed} ${unitLabel}`;
                    },
                  },
                },
              },
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: false,
                    text: 'X Axis Label',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: `Speed (${unit === 'miles' ? 'Mph' : 'Kph'})`,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>

  );
};

export default RunningData;
