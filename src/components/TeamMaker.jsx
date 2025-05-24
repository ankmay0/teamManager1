import { useState, useEffect } from 'react';
import FileHandler from './FileHandler.jsx';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
  Grid,
} from '@mui/material';
import { grey } from '@mui/material/colors';
 

const TeamMaker = ({ teams }) => {
  const [memberSkillSelections, setMemberSkillSelections] = useState({});
  const [skillsList, setSkillsList] = useState([]);
  const [uploadedDataContent, setUploadedDataContent] = useState(null); 

  
  const handleDataUpload = (uploaded) => {
    setUploadedDataContent(uploaded);
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // For fetching directly from GitHub raw content
        const res = await fetch("https://raw.githubusercontent.com/ankmay0/teamManager1/main/my-react-app/public/SkillsData.json");
        const result = await res.json();
        setSkillsList(result);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };
    fetchSkills();
  }, []);

function handleSkillChange(teamId, memberId, skillId) {
  setMemberSkillSelections(prevSelections => {
    
    const newSelections = { ...prevSelections };
    

    if (!newSelections[teamId]) {
      newSelections[teamId] = {};
    }
    
    newSelections[teamId][memberId] = skillId;
    
    return newSelections;
  });
}


return (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4, border: '1px solid', borderColor: grey[400], borderRadius:8 }}>
    <Typography
      variant="h3"
      component="h1"
      fontWeight="bold"
      gutterBottom
      sx={{ mt:7, mb: 4, textAlign: 'center'  }}
      
    >
      Team Skill Assignment
    </Typography>

    <Box sx={{ mb: 4 }}>
      {teams?.length ? (
        teams.map((team, index) => {
          const pairingIdentifier = `Pairing-${index}`;
          const memberIds = [team.srcId, team.targetId];
          const memberNames = [team.srcName, team.targetName];

          return (
            <Paper key={pairingIdentifier} elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: grey[300], borderRadius:3 }} >
              <Grid container spacing={9}>
                {memberIds.map((memberId, idx) => (
                  <Grid item xs={12} sm={6} key={memberId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                      <Typography
                        variant="h6"
                        sx={{
                          whiteSpace: 'nowrap',
                          minWidth: 100,
                          fontWeight: 'bold',
                          // pl: 2,
                          
                        }}
                      >
                        {memberNames[idx]}
                      </Typography>

                      <FormControl variant="outlined" sx={{ minWidth: 400 }}>
                        <InputLabel id={`skill-select-label-${memberId}-${index}`}>
                          Select Expertise
                        </InputLabel>
                        <Select
                          labelId={`skill-select-label-${memberId}-${index}`}
                          id={`skill-select-${memberId}-${index}`}
                          value={memberSkillSelections[pairingIdentifier]?.[memberId] || ''}
                          label="Select Expertise"
                          onChange={(e) =>
                            handleSkillChange(pairingIdentifier, memberId, e.target.value)
                          }
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: 300,
                                px: 0, // remove side padding
                              },
                            },
                          }}
                        >
                          {/* Table header */}
                          <MenuItem disabled sx={{ backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
                            <Box sx={{ display: 'flex', width: '100%', fontWeight: 'bold' }}>
                              <Box sx={{ width: '50%', borderRight: '1px solid #ccc', px: 1 }}>Skill</Box>
                              <Box sx={{ width: '50%', px: 1 }}>Experience</Box>
                            </Box>
                          </MenuItem>

                          {/* Data rows */}
                          {skillsList.map(({ id, expertise, experience }) => (
                            <MenuItem key={id} value={id} sx={{ px: 0 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  width: '100%',
                                  borderBottom: '1px solid #eee',
                                  alignItems: 'center',
                                }}
                              >
                                <Box sx={{ width: '50%', borderRight: '1px solid #eee', px: 1 }}>
                                  {expertise}
                                </Box>
                                <Box sx={{ width: '50%', px: 1, color: 'text.secondary' }}>
                                  {experience}
                                </Box>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>


                      
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          );
        })
      ) : (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          No team data available.
        </Typography>
      )}
    </Box>

    <FileHandler
      selections={memberSkillSelections}
      data={uploadedDataContent}
      onDataUpload={handleDataUpload}
    />
  </Container>
);


};

export default TeamMaker;
