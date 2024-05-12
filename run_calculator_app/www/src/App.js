import React, { useState } from 'react';
import RunningData from './components/RunningData';
import MileageTable from './components/MileageTable';
import TextField from '@mui/material/TextField'; // Import Material-UI TextField
import UnitToggle from './components/UnitToggle'; // Import UnitToggle component
import './App.css';

function RunConfig() {
  const [miles, setMiles] = useState(3);
  const [splits, setSplits] = useState(1);
  const [speeds, setSpeeds] = useState(Array.from({ length: 1 }, () => Array(miles).fill('')));
  const [fillSpeed, setFillSpeed] = useState('');
  const [validFillSpeed, setValidFillSpeed] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [unit, setUnit] = useState('miles'); // State to track selected unit

  const addSplit = () => {
    setSplits(splits + 1);
    setSpeeds([...speeds, Array(miles).fill('')]);
  };

  const removeSplit = () => {
    if (splits > 1) {
      setSplits(splits - 1);
      speeds.pop();
      setSpeeds([...speeds]);
    }
  };

  const clearSpeedGrid = () => {
    setSpeeds(speeds.map(split => split.map(() => '')));
  };

  const handleMilesChange = (e) => {
    const newMiles = parseInt(e.target.value, 10);
    if (!isNaN(newMiles) && newMiles > 0) {
      setMiles(newMiles);
      const newSpeeds = speeds.map(split => Array(newMiles).fill(''));
      setSpeeds(newSpeeds);
    }
  };

  const handleSplitsChange = (e) => {
    const newSplits = parseInt(e.target.value, 10);
    if (!isNaN(newSplits) && newSplits > 0) {
      setSplits(newSplits);
      const newSpeeds = Array.from({ length: newSplits }, () => Array(miles).fill(''));
      setSpeeds(newSpeeds);
    }
  };

  const handleFillSpeedChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 15)) {
      setFillSpeed(value);
      setValidFillSpeed(true);
    } else {
      setValidFillSpeed(false);
    }
  };

  const handleGoButtonClick = () => {
    if (validFillSpeed) {
      const newSpeeds = speeds.map(split => split.map(() => fillSpeed));
      setSpeeds(newSpeeds);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof miles !== 'number' || typeof splits !== 'number' || !Array.isArray(speeds)) {
      console.error('Invalid data types');
      return;
    }
    if (speeds.some(split => !Array.isArray(split) || split.some(speed => typeof parseFloat(speed) !== 'number'))) {
      console.error('Speeds must be arrays of numbers');
      return;
    }
    const transposeSpeeds = speeds[0].map((_, colIndex) => speeds.map(row => parseFloat(row[colIndex]) || 0));
    const requestBody = JSON.stringify({ miles, splits, speeds: transposeSpeeds.map(split => split.map(speed => parseFloat(speed) || 0)) });

    fetch('http://localhost:8000/api/calculate_run', {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setResponseData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '50px 70px' }}>
      <div style={{ flex: 1, marginRight: '30px' }}>
        <div style={{ marginTop: '18px', textAlign: 'left' }}>
          <h1 style={{ display: 'flex', alignItems: 'center' }}>
            Run Configuration&nbsp;
            {/* Render UnitToggle component next to the title */}
            <UnitToggle unit={unit} setUnit={setUnit} style={{ marginLeft: '10px', marginTop: '-3px' }} />
          </h1>
          <TextField
            label={`Total ${unit === 'miles' ? 'Miles' : 'Kilometres'}`}
            type="number"
            value={miles}
            onChange={handleMilesChange}
            variant="outlined"
            inputProps={{ min: 1 }}
            required
            style={{ marginBottom: '18px', marginTop: '16px', marginRight: '8px' }}
          />
          <TextField
            label="Number of Splits"
            type="number"
            value={splits}
            onChange={handleSplitsChange}
            variant="outlined"
            inputProps={{ min: 1 }}
            required
            style={{ marginBottom: '18px', marginTop: '16px' }}
          />

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                id="fillSpeed"
                label={`Fill Speed (0-15 ${unit === 'miles' ? 'Mph' : 'Kph'})`}
                type="number"
                value={fillSpeed}
                onChange={handleFillSpeedChange}
                variant="outlined"
                inputProps={{ step: '0.1', min: '0', max: '15' }}
                required
                style={{ width: '300px', marginRight: '12px', marginBottom: '15px', borderColor: validFillSpeed ? 'initial' : 'red' }}
              />
              <button
                type="button"
                onClick={handleGoButtonClick}
                disabled={!validFillSpeed}
                style={{
                  fontSize: '16px', // Adjust the font size
                  padding: '10px 20px', // Adjust the padding
                  borderRadius: '8px', // Apply border radius for a rounded shape
                  color: 'white', // Set text color
                  border: 'none', // Remove border
                  cursor: 'pointer', // Show pointer cursor on hover
                  marginBottom: '15px',
                  marginRight: '2px',
                }}
              >
                Go!
              </button>
              <button
                type="button"
                onClick={clearSpeedGrid}
                style={{
                  fontSize: '16px', // Adjust the font size
                  padding: '10px 20px', // Adjust the padding
                  borderRadius: '8px', // Apply border radius for a rounded shape
                  color: 'white', // Set text color
                  border: 'none', // Remove border
                  cursor: 'pointer', // Show pointer cursor on hover
                  marginLeft: '8px', // Add marginLeft for spacing between buttons
                  marginBottom: '15px',
                }}
              >
                Clear All
              </button>
            </div>
            <div>
              <button
                type="submit"
                style={{
                  fontSize: '16px', // Adjust the font size
                  padding: '10px 20px', // Adjust the padding
                  borderRadius: '8px', // Apply border radius for a rounded shape
                  backgroundColor: '#2196f3', // Set background color
                  color: 'white', // Set text color
                  border: 'none', // Remove border
                  cursor: 'pointer', // Show pointer cursor on hover
                }}
              >
                Calculate
              </button>
              <span style={{ margin: '4px' }}></span>
              <button
                type="button"
                onClick={addSplit}
                style={{
                  fontSize: '16px', // Adjust the font size
                  padding: '10px 20px', // Adjust the padding
                  borderRadius: '8px', // Apply border radius for a rounded shape
                  backgroundColor: '#2196f3', // Set background color
                  color: 'white', // Set text color
                  border: 'none', // Remove border
                  cursor: 'pointer', // Show pointer cursor on hover
                  marginLeft: '8px' // Add marginLeft for spacing between buttons
                }}
              >
                Add Split
              </button>
              <span style={{ margin: '4px' }}></span>
              <button
                type="button"
                onClick={removeSplit}
                style={{
                  fontSize: '16px', // Adjust the font size
                  padding: '10px 20px', // Adjust the padding
                  borderRadius: '8px', // Apply border radius for a rounded shape
                  backgroundColor: '#2196f3', // Set background color
                  color: 'white', // Set text color
                  border: 'none', // Remove border
                  cursor: 'pointer', // Show pointer cursor on hover
                  marginBottom: '10px', // Add marginBottom for spacing below the button
                  marginLeft: '8px'
                }}
              >
                Remove Split
              </button>
            </div>
            <div>
              <MileageTable miles={miles} splits={splits} speeds={speeds} setSpeeds={setSpeeds} unit={unit} />
            </div>
          </form>
        </div>
      </div>

      {responseData && (
        <div style={{ flex: 5, marginLeft: '50px' }}>
          <RunningData data={responseData} unit={unit} />
        </div>
      )}
    </div>
  );
}

export default RunConfig;
