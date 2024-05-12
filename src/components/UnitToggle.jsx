import React from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

function UnitToggle({ unit, setUnit }) {
  const handleUnitChange = (event, newUnit) => {
    if (newUnit !== null) {
      setUnit(newUnit);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={unit}
      exclusive
      onChange={handleUnitChange}
      aria-label="Unit toggle"
    >
      <ToggleButton value="miles" aria-label="Miles">
        Miles
      </ToggleButton>
      <ToggleButton value="kilometres" aria-label="Kilometres">
        Kilometres
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default UnitToggle;
