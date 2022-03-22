import { Box, styled, Button, Typography,SelectChangeEvent } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Select from '../components/Select';
import Table from '../components/Table';
import { AppContext } from '../contexts';
import { APP_TITLE, PAGE_TITLE_HOME } from '../utils/constants';
import jfrogLogo from '../assets/jfrog.png'
import criticalSeverity from '../assets/critical_severity.png'
import highSeverity from '../assets/high_severity.png'
import mediumSeverity from '../assets/medium_severity.png'
import lowSeverity from '../assets/low_severity.png'
import http from "../http-common";
import { getImages, scanImage } from "../api/image-scan";

export const ScanPage = () => {
  const context = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState('');
  const [dockerImages, setDockerImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);

  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelectedImage(event.target.value)
    setScanResults([])
    setIsLoading(false)
  };

  interface IImageData {
    RepoTags?: string[];
  }

useEffect(() => {
  const getDockerImages = async () => {
    try {
      let res = await getImages();
      let images: string[] = res.filter((image: IImageData) => image.RepoTags && image.RepoTags.length > 0 && image.RepoTags[0] != "<none>:<none>").
      map((image: IImageData) => { return image.RepoTags ? image.RepoTags[0] : "" })
      setDockerImages(images)
    } catch (e) {
      alert(e)
    }
  };
  getDockerImages()
}, []);

  const onScanClick = async () => {
    try {
      setIsLoading(true)
      setScanResults([])
      let results = await scanImage(selectedImage);
      console.log(results)
      setScanResults(results)
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      alert(e)
    }
  }

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_HOME} | {APP_TITLE}
        </title>
      </Helmet>

      <Box sx={{ display: 'flex', flexDirection: 'row', height: '30px', marginBottom: '50px' }}>
        <img src={jfrogLogo} alt="jfrog logo" />
        <Typography variant="h5" marginLeft="20px">{`Jfrog Xray Scan`}</Typography>
      </Box>

      <Typography variant="h6">Image</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', width: 1 / 2 }}>
        <Select onChange={handleChange} options={dockerImages} />
        <ScanButton disabled={selectedImage == ""} loading={isLoading} onClick={onScanClick} variant="contained">Scan</ScanButton>
      </Box>
      <Box sx={{ marginTop: '50px' }}>
        { scanResults.length > 0 ? <Table columnNames={scanResultColumnNames} rows={scanResults}/> : ""}
      </Box>
    </>
  );
};

const ScanButton = styled(LoadingButton)`
  margin-left: 30px;
  padding: 0 50px;
  background-color: #4172E8;
`;

const scanResultColumnNames = [
 'Severity', 
 'ImpactedPacakge', 
 'ImpactedPacakgeVersion',
 'Type', 
 'FixedVersions',
 'Component', 
 'ComponentVersion',
 'Cve',
];