import React from 'react';
import TextField from '@mui/material/TextField';

function MileageTable({ miles, splits, speeds, setSpeeds, unit }) {
  // Calculate the distance of each split and round it to two decimal places
  const distanceUnit = unit === 'miles' ? 'miles' : 'kms';
  const splitDistance = (1 / splits).toFixed(2);

  const handleSpeedChange = (splitIndex, mileIndex, newValue) => {
    const newSpeeds = speeds.map((split, idx) => {
      if (idx === splitIndex) {
        return split.map((speed, index) => index === mileIndex ? newValue : speed);
      }
      return split;
    });
    setSpeeds(newSpeeds);
  };

  return (
    <table>
      <thead>
        <tr>
          <th><div style={{ textAlign: 'center' }}>Split</div></th>
          {Array.from({ length: miles }, (_, index) => (
            <th key={index}><div style={{ textAlign: 'center' }}>{unit === 'miles' ? `Mile ${index + 1}` : `Km ${index + 1}`}</div></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {speeds.map((split, splitIndex) => (
          <tr key={splitIndex}>
            <td>
              <div style={{ textAlign: 'center' }}>Split {splitIndex + 1}</div>
              <div style={{ textAlign: 'center' }}>({splitDistance} {distanceUnit})</div> {/* Display the rounded distance of each split */}
            </td>
            {split.map((speed, mileIndex) => (
              <td key={mileIndex}>
                <TextField
                  type="number"
                  name={`speeds_${mileIndex}_${splitIndex}`}
                  value={speed}
                  onChange={(e) => handleSpeedChange(splitIndex, mileIndex, e.target.value)}
                  required
                  variant="outlined"
                  inputProps={{ step: '0.1', min: '0', max: '15' }}
                  sx={{
                    width: '90px', // Set width to 70px
                    height: '70px', // Set height to 70px
                    borderRadius: '4px', // Apply border radius for a square shape
                    border: 'none', // Remove border
                    '& input': {
                      padding: '16px', // Adjust input padding for better appearance
                    },
                    marginLeft: '8px', // Add marginLeft for horizontal space
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MileageTable;
