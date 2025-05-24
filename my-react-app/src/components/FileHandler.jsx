import React, { useState } from "react";
import * as yaml from "js-yaml";
// import React from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  ButtonGroup,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const FileHandler = ({ selections, data, onDataUpload }) => {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name); // set file name to state

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const extension = file.name.split(".").pop();

      try {
        const parsedData =
          extension === "json"
            ? JSON.parse(content)
            : yaml.load(content);

        onDataUpload(parsedData);
      } catch (error) {
        alert("Error parsing file");
        console.error(error);
      }
    };

    reader.readAsText(file);
  };

  const handleDownload = (type) => {
    if (!data) {
      alert("Upload a file first.");
      return;
    }

    const selectedTeams = [];

    Object.entries(selections).forEach(([teamName, members]) => {
      const teamMembers = [];

      Object.entries(members).forEach(([memberId, skillId]) => {
        let selectedSkill = skillId;

        if (data.skills && Array.isArray(data.skills)) {
          const skillDetail = data.skills.find((skill) => skill.id === skillId);
          if (skillDetail) selectedSkill = skillDetail;
        }

        teamMembers.push({
          memberId,
          selectedSkill,
        });
      });

      selectedTeams.push({
        teamName,
        members: teamMembers,
      });
    });

    const newData = {
      ...data,
      selectedTeams,
    };

    let content, fileName, mimeType;

    if (type === "json") {
      content = JSON.stringify(newData, null, 2);
      fileName = "updated-data.json";
      mimeType = "application/json";
    } else if (type === "yml") {
      content = yaml.dump(newData);
      fileName = "updated-data.yml";
      mimeType = "application/x-yaml";
    } else {
      return;
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        color: 'white',
        p: 6,
        borderRadius: 2,
        width: '100%',
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        {/* Left side: File Upload */}
        <Grid item>
          <Button
            component="label"
            variant="outlined"
            color="primary"
            startIcon={<UploadFileIcon />}
            size="large"
          >
            Choose File
            <input
              type="file"
              accept=".json,.yml,.yaml"
              onChange={handleFileUpload}
              hidden
            />
          </Button>
        </Grid>

        {/* Right side: Download buttons */}
        <Grid item>
          <ButtonGroup  variant="outlined">
            <Button
              sx={{ bgcolor: 'green.600', '&:hover': { bgcolor: 'green.700' } }}
              onClick={() => handleDownload('json')}
              size="large"
            >
              Download JSON
            </Button>
            <Button
              sx={{ bgcolor: 'yellow.700', '&:hover': { bgcolor: 'yellow.800' } }}
              onClick={() => handleDownload('yml')}
              size="large"
            >
              Download YAML
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>

      {/* File name below the row */}
      {fileName && (
        <Typography
          variant="body2"
          color="black"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          Uploaded: {fileName}
        </Typography>
      )}
    </Box>
  );
};

export default FileHandler;
