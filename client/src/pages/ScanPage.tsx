import { Box, styled, Typography, SelectChangeEvent, CircularProgress, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Select from '../components/Select';
import Table from '../components/Table';
import { AppContext } from '../contexts';
import { APP_TITLE, PAGE_TITLE_HOME } from '../utils/constants';
import criticalSeverity from '../assets/severityIcons/critical_severity.png';
import highSeverity from '../assets/severityIcons/high_severity.png';
import mediumSeverity from '../assets/severityIcons/medium_severity.png';
import lowSeverity from '../assets/severityIcons/low_severity.png';
import { getImages, scanImage } from '../api/image-scan';
import { JfrogHeadline } from '../components/JfrogHeadline';

export const ScanPage = () => {
  const context = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState('');
  const [dockerImages, setDockerImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);

  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelectedImage(event.target.value);
    setScanResults([]);
    setIsLoading(false);
  };

  interface IImageData {
    RepoTags?: string[];
  }

  useEffect(() => {
    const getDockerImages = async () => {
      try {
        let res = await getImages();
        let images: string[] = res
          .filter(
            (image: IImageData) => image.RepoTags && image.RepoTags.length > 0 && image.RepoTags[0] != '<none>:<none>'
          )
          .map((image: IImageData) => {
            return image.RepoTags ? image.RepoTags[0] : '';
          });
        setDockerImages(images);
      } catch (e) {
        alert(e);
      }
    };
    getDockerImages();
  }, []);

  const onScanClick = async () => {
    try {
      setIsLoading(true);
      setScanResults([]);
      let results = await scanImage(selectedImage);
      console.log(results);
      setScanResults(results);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      alert(e);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {PAGE_TITLE_HOME} | {APP_TITLE}
        </title>
      </Helmet>
      <JfrogHeadline headline="Jfrog Xray Scan" />
      <Button variant="outlined" sx={{ position: 'absolute', right: '20px', top: '20px', fontWeight: '700' }}>
        Settings
      </Button>
      <Typography variant="subtitle1">Image</Typography>
      <Box display="flex" width={1 / 2}>
        <Select onChange={handleChange} options={dockerImages} />
        <ScanButton variant="contained" disabled={selectedImage == ''} loading={isLoading} onClick={onScanClick}>
          Scan
        </ScanButton>
      </Box>

      {selectedImage ? (
        <Box padding="5px 10px" bgcolor="#E5EBF3" alignItems="center" marginTop="20px" display="flex" width={1 / 2}>
          <CircularProgress size="10px" sx={{ marginRight: '10px' }} />
          <Typography color="#556274" fontWeight="400" fontSize="12px">
            scanning {selectedImage}...
          </Typography>
        </Box>
      ) : (
        ''
      )}
      {scanResults.length > 0 ? (
        <Box sx={{ marginTop: '50px' }}>
          <Typography fontWeight="500" fontSize="18px">
            Image Scan Results
          </Typography>
          {scanResults.length > 0 ? <Table columnNames={scanResultColumnNames} rows={scanResults} /> : ''}
        </Box>
      ) : (
        ''
      )}
    </>
  );
};

const ScanButton = styled(LoadingButton)`
  margin-left: 30px;
  padding: 0 50px;
  background-color: #4172e8;
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
