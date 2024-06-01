import React, { useState } from "react";
import RunningData from "./components/RunningData";
import MileageTable from "./components/MileageTable";
import TextField from "@mui/material/TextField"; // Import Material-UI TextField
import Slider from "@mui/material/Slider"; // Import Material-UI Slider
import Grid from "@mui/material/Grid";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import UnitToggle from "./components/UnitToggle"; // Import UnitToggle component
import Footer from "./components/Footer"; // Import Footer component
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Add, Remove } from "@mui/icons-material";
import "./App.css";

export default function App() {
  const [miles, setMiles] = useState(3);
  const [splits, setSplits] = useState(1);
  const [speeds, setSpeeds] = useState(
    Array.from({ length: 1 }, () => Array(miles).fill("")),
  );
  const [fillSpeed, setFillSpeed] = useState("");
  const [validFillSpeed, setValidFillSpeed] = useState(true);
  const [unit, setUnit] = useState("miles"); // State to track selected unit
  const [results, setResults] = useState(null);

  const clearSpeedGrid = () => {
    setSpeeds(speeds.map((split) => split.map(() => "")));
  };

  const handleMilesChange = (e) => {
    const newMiles = parseInt(e.target.value, 10);
    if (!isNaN(newMiles) && newMiles > 0) {
      setMiles(newMiles);
      const newSpeeds = speeds.map((split) => Array(newMiles).fill(fillSpeed));
      setSpeeds(newSpeeds);
    }
  };

  const handleSplitsChange = (e) => {
    const newSplits = parseInt(e.target.value, 10);
    if (!isNaN(newSplits) && newSplits > 0) {
      setSplits(newSplits);
      const newSpeeds = Array.from({ length: newSplits }, () =>
        Array(miles).fill(fillSpeed),
      );
      setSpeeds(newSpeeds);
    }
  };

  const incrementMiles = () => {
    setMiles((prevMiles) => {
      const newMiles = Math.min(prevMiles + 1, 30);
      setSpeeds((prevSpeeds) =>
        prevSpeeds.map((split) => {
          const updatedSplit = [...split];
          updatedSplit.push(fillSpeed); // Add the new value from fillSpeed to the end of the split
          return updatedSplit;
        }),
      );
      return newMiles;
    });
  };

  const decrementMiles = () => {
    setMiles((prevMiles) => {
      const newMiles = Math.max(prevMiles - 1, 0);
      setSpeeds((prevSpeeds) =>
        prevSpeeds.map((split) => Array(newMiles).fill(fillSpeed)),
      );
      return newMiles;
    });
  };

  const incrementSplits = () => {
    setSplits((prevSplits) => {
      const newSplits = Math.min(prevSplits + 1, 30);
      setSpeeds((prevSpeeds) => {
        const updatedSpeeds = [...prevSpeeds];
        while (updatedSpeeds.length < newSplits) {
          updatedSpeeds.push(Array(miles).fill(fillSpeed));
        }
        return updatedSpeeds;
      });
      return newSplits;
    });
  };

  const decrementSplits = () => {
    setSplits((prevSplits) => {
      const newSplits = Math.max(prevSplits - 1, 0);
      setSpeeds((prevSpeeds) => prevSpeeds.slice(0, newSplits));
      return newSplits;
    });
  };

  const handleFillSpeedChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 15)) {
      setFillSpeed(value);
      setValidFillSpeed(true);
    } else {
      setValidFillSpeed(false);
    }
  };

  const handleGoButtonClick = () => {
    if (validFillSpeed) {
      const newSpeeds = speeds.map((split) => split.map(() => fillSpeed));
      setSpeeds(newSpeeds);
    }
  };

  const calculateTotalDistance = (miles, splits) => {
    return miles * splits * (1 / splits);
  };

  const calculateTotalTime = (speeds, splits) => {
    const splitMinutes = speeds.map((split) => {
      const speedsPerMinute = split.map((speed) => speed / 60);
      const splitTotalMinutes =
        speedsPerMinute.reduce((total, speed) => total + 1 / speed, 0) / splits;
      return splitTotalMinutes;
    });
    return splitMinutes.reduce((a, b) => a + b, 0);
  };

  const calculatePace = (totalTime, totalDistance) => {
    return totalDistance / (totalTime / 60);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      typeof miles !== "number" ||
      typeof splits !== "number" ||
      !Array.isArray(speeds)
    ) {
      console.error("Invalid data types");
      return;
    }
    if (
      speeds.some(
        (split) =>
          !Array.isArray(split) ||
          split.some((speed) => typeof parseFloat(speed) !== "number"),
      )
    ) {
      console.error("Speeds must be arrays of numbers");
      return;
    }
    const transposeSpeeds = speeds[0].map((_, colIndex) =>
      speeds.map((row) => parseFloat(row[colIndex]) || 0),
    );
    const totalDistance = calculateTotalDistance(miles, splits);
    const totalTime = calculateTotalTime(transposeSpeeds, splits);
    const pace = calculatePace(totalTime, totalDistance);
    const updateResults = () => {
      const newResults = {
        totalDistance: totalDistance,
        totalTime: totalTime,
        pace: pace,
        miles: miles,
        splits: splits,
        speeds: transposeSpeeds,
      };
      setResults(newResults);
    };
    updateResults();
  };

  return (
    <main>
      <div style={{ padding: "20px" }}></div>
      <div className="container-full">
        <div className="container-inputs" id="Title and Params">
          <div className="container" id="title and toggle">
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1
                className="title"
                style={{ marginBottom: "0px", fontSize: "40px" }}
              >
                Run Configuration
              </h1>
              <span style={{ padding: "10px" }}> </span>
              <UnitToggle
                unit={unit}
                setUnit={setUnit}
                style={{ margin: "0px" }}
              />
            </div>
          </div>
          <div
            className="container-input-grid"
            id="Params"
            style={{ padding: "0px", justifyContent: "center" }}
          >
            <div className="container-params">
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Typography id="slider-label" gutterBottom>
                    {`Total ${unit === "miles" ? "Miles:" : "Kilometres:"}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    variant="standard"
                    value={miles}
                    type="number"
                    size="large"
                    onChange={handleMilesChange}
                    sx={{
                      width: "310px",
                      height: "70px",
                      "& input": {
                        padding: "16px",
                        textAlign: "center", // Align text content horizontally to the center
                      },
                      marginLeft: "20px",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={decrementMiles}
                            aria-label="decrement miles"
                          >
                            <Remove />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={incrementMiles}
                            aria-label="increment miles"
                          >
                            <Add />
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: {
                        fontSize: "1.2rem", // Increase font size for better readability
                        padding: "1px", // Add padding for touch interaction
                      },
                    }}
                    fullWidth // Ensure input takes full width of the container
                    style={{
                      margin: "10px 0", // Add margin for spacing
                    }}
                    InputLabelProps={{
                      shrink: true, // Keep the label shrunk to avoid overlaying with the input value
                    }}
                  />
                </Grid>
              </Grid>
              <Slider
                label={`Total ${unit === "miles" ? "Miles" : "Kilometres"}`}
                value={miles}
                onChange={handleMilesChange}
                min={1}
                max={30}
                step={1}
                marks
                valueLabelDisplay="auto"
                defaultValue={3}
                sx={{
                  marginBottom: "0px",
                  marginTop: "0px",
                  marginRight: "8px",
                  width: "400px",
                }}
              />
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Typography id="slider-label" gutterBottom>
                    {`Number of Splits:`}
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    variant="standard"
                    value={splits}
                    onChange={handleSplitsChange}
                    type="number"
                    size="large"
                    sx={{
                      width: "265px",
                      height: "70px",
                      "& input": {
                        padding: "16px",
                        textAlign: "center", // Align text content horizontally to the center
                      },
                      marginLeft: "20px",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={decrementSplits}
                            aria-label="decrement splits"
                          >
                            <Remove />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={incrementSplits}
                            aria-label="increment splits"
                          >
                            <Add />
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: {
                        fontSize: "1.2rem", // Increase font size for better readability
                        padding: "1px", // Add padding for touch interaction
                      },
                    }}
                    fullWidth // Ensure input takes full width of the container
                    style={{
                      margin: "10px 0", // Add margin for spacing
                    }}
                    InputLabelProps={{
                      shrink: true, // Keep the label shrunk to avoid overlaying with the input value
                    }}
                  />
                </Grid>
              </Grid>
              <Slider
                label="Number of Splits"
                value={splits}
                onChange={handleSplitsChange}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                defaultValue={3}
                sx={{
                  marginBottom: "18px",
                  marginTop: "5px",
                  marginRight: "8px",
                  width: "400px",
                }}
              />
              <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    id="fillSpeed"
                    label={`Fill Speed (0-15 ${unit === "miles" ? "Mph" : "Kph"})`}
                    type="number"
                    value={fillSpeed}
                    onChange={handleFillSpeedChange}
                    variant="outlined"
                    inputProps={{ step: "0.1", min: "0", max: "15" }}
                    style={{
                      width: "210px",
                      marginRight: "12px",
                      marginBottom: "15px",
                      borderColor: validFillSpeed ? "initial" : "red",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleGoButtonClick}
                    disabled={!validFillSpeed}
                    style={{
                      fontSize: "16px",
                      padding: "15px 20px",
                      borderRadius: "8px",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginBottom: "15px",
                      marginRight: "2px",
                    }}
                  >
                    Go!
                  </button>
                  <button
                    type="button"
                    onClick={clearSpeedGrid}
                    style={{
                      fontSize: "16px",
                      padding: "15px 10px",
                      borderRadius: "8px",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "8px",
                      marginBottom: "15px",
                    }}
                  >
                    Clear All
                  </button>
                </div>
                <div style={{ marginTop: "12px" }}>
                  <button
                    type="submit"
                    style={{
                      fontSize: "16px",
                      padding: "15px 20px",
                      borderRadius: "8px",
                      backgroundColor: "#2196f3",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Calculate
                  </button>
                  <span style={{ margin: "4px" }}></span>
                  <button
                    type="button"
                    onClick={incrementSplits}
                    style={{
                      fontSize: "16px",
                      padding: "15px 20px",
                      borderRadius: "8px",
                      backgroundColor: "#2196f3",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "8px",
                    }}
                  >
                    Add Split
                  </button>
                  <span style={{ margin: "4px" }}></span>
                  <button
                    type="button"
                    onClick={decrementSplits}
                    style={{
                      fontSize: "16px",
                      padding: "15px 20px",
                      borderRadius: "8px",
                      backgroundColor: "#2196f3",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginBottom: "10px",
                      marginLeft: "8px",
                    }}
                  >
                    Remove Split
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <MileageTable
          miles={miles}
          splits={splits}
          speeds={speeds}
          setSpeeds={setSpeeds}
          unit={unit}
        />
        <div id="Run Summary">
          {results && (
            <div className="right-panel">
              <RunningData data={results} unit={unit} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
