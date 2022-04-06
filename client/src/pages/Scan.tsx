import { Box, styled, Typography, SelectChangeEvent, CircularProgress, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Select from '../components/Select';
import Table from '../components/Table';
import { getImages, scanImage } from '../api/image-scan';
import { JfrogHeadline } from '../components/JfrogHeadline';
import { useHistory } from 'react-router-dom';

export const ScanPage = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [dockerImages, setDockerImages] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  let history = useHistory();

  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelectedImage(event.target.value);
    setScanResults([]);
    setIsScanning(false);
  };

  useEffect(() => {
    const getDockerImages = async () => {
      try {
        let res = await getImages();
        let images: string[] = res
          .filter(
            (image: { RepoTags?: string[] }) =>
              image.RepoTags && image.RepoTags.length > 0 && image.RepoTags[0] != '<none>:<none>'
          )
          .map((image: { RepoTags?: string[] }) => {
            return image.RepoTags ? image.RepoTags[0] : '';
          });
        setDockerImages(images);
      } catch (e) {
        alert(e);
      }
    };
    getDockerImages();
  }, []);

  const onSettingsClick = async () => {
    history.push('/settings');
  };

  const onScanClick = async () => {
    try {
      setIsScanning(true);
      setScanResults([]);
      let results = await scanImage(selectedImage);
      console.log(results);
      setScanResults(results.Vulnerabilities);
      setIsScanning(false);
      if (results && results.Vulnerabilities.length == 0) {
        alert('No Vulnerabilities found!');
      }
    } catch (e) {
      setIsScanning(false);
      alert(e);
    }
  };

  const getSettingsButton = () => {
    return (
      <Button
        variant="contained"
        onClick={onSettingsClick}
        sx={{ position: 'absolute', right: '0', top: '0', fontWeight: '700' }}
      >
        Settings
      </Button>
    );
  };

  return (
    <>
      {getSettingsButton()}

      <JfrogHeadline headline="JFrog Xray Scan" marginBottom="50px" />
      <Typography variant="subtitle1">Select local image for scanning</Typography>
      <Box display="flex" width={1 / 2}>
        <Select onChange={handleChange} options={dockerImages} />
        <ScanButton
          variant="contained"
          sx={{ width: '120px', fontSize: '16px', fontWeight: '700' }}
          disabled={isScanning}
          onClick={onScanClick}
        >
          Scan
        </ScanButton>
      </Box>

      {isScanning ? (
        <Box>
          <ScanningBackground>
            <CircularProgress size="10px" sx={{ margin: '0 10px' }} />
            <Typography fontWeight="400" fontSize="12px">
              scanning {selectedImage}...
            </Typography>
          </ScanningBackground>
        </Box>
      ) : (
        ''
      )}

      {scanResults.length > 0 ? (
        <Box sx={{ marginTop: '50px' }}>
          <Typography variant="h6" fontWeight="500" fontSize="18px">
            Image Scan Results
          </Typography>
          {scanResults.length > 0 ? <Table columnsData={scanTableColumnsData} rows={scanResults} /> : ''}
        </Box>
      ) : (
        ''
      )}
    </>
  );
};

const ScanningBackground = styled(Box)`
  color: #556274;
  background: #e5ebf3;
  padding: 5px;
  align-items: center;
  margin-top: 20px;
  display: flex;
  width: 50%;
  @media screen and (prefers-color-scheme: dark) {
    color: #f8fafb;
    background: #222e33;
  }
`;
const ScanButton = styled(Button)`
  margin-left: 30px;
  padding: 0 50px;
`;

const scanTableColumnsData = [
  {
    id: 'Severity',
    maxWidth: '70px',
  },
  {
    id: 'ImpactedPackage',
  },
  {
    id: 'ImpactedPackageVersion',
    label: 'Version',
  },
  {
    id: 'Type',
    maxWidth: '60px',
  },
  {
    id: 'FixedVersions',
  },
  {
    id: 'CVE',
    maxWidth: '120px',
  },
  {
    id: 'CVSSv2',
    maxWidth: '70px',
  },
  {
    id: 'CVSSv3',
    maxWidth: '70px',
  },
];
