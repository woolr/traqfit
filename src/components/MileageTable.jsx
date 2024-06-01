import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";

function MileageTable({ miles, splits, speeds, setSpeeds, unit }) {
  // Calculate the distance of each split and round it to two decimal places
  const distanceUnit = unit === "miles" ? "miles" : "kms";
  const splitDistance = (1 / splits).toFixed(2);

  const handleSpeedChange = (splitIndex, mileIndex, newValue) => {
    const newSpeeds = speeds.map((split, idx) => {
      if (idx === splitIndex) {
        return split.map((speed, index) =>
          index === mileIndex ? newValue : speed,
        );
      }
      return split;
    });
    setSpeeds(newSpeeds);
  };

  return (
    <TableContainer
      style={{
        marginBottom: "50px",
        marginTop: "30px",
        backgroundColor: "#cde5ee", // Dark blue background
        color: "#01173a", // Deep navy blue text
      }}
      className="resizable-component"
    >
      <Table sx={{ borderColor: "white" }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ color: "#01173a" }}>
              Split
            </TableCell>
            {Array.from({ length: miles }, (_, index) => (
              <TableCell align="center" sx={{ color: "#01173a" }} key={index}>
                {unit === "miles" ? `Mile ${index + 1}` : `Km ${index + 1}`}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {speeds.map((split, splitIndex) => (
            <TableRow key={splitIndex}>
              <TableCell align="center" sx={{ color: "#01173a" }}>
                <div>{splitIndex + 1}</div>
                <div>
                  ({splitDistance} {distanceUnit})
                </div>
              </TableCell>
              {split.map((speed, mileIndex) => (
                <TableCell
                  key={mileIndex}
                  align="center"
                  sx={{ color: "#01173a" }}
                >
                  <TextField
                    type="number"
                    name={`speeds_${mileIndex}_${splitIndex}`}
                    value={speed}
                    onChange={(e) =>
                      handleSpeedChange(splitIndex, mileIndex, e.target.value)
                    }
                    required
                    variant="outlined"
                    inputProps={{ step: "0.1", min: "0", max: "15" }}
                    sx={{
                      width: "80px",
                      height: "40px",
                      borderRadius: "4px",
                      border: "none",
                      "& input": {
                        padding: "18px",
                        color: "black", // White text in the input
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#01173a", // White border for the input
                        },
                        "&:hover fieldset": {
                          borderColor: "#01173a", // White border on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#01173a", // White border when focused
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "01173a", // White label text
                      },
                      marginLeft: "8px",
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MileageTable;
