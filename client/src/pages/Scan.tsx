import { Box, styled, Typography, SelectChangeEvent, CircularProgress, Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Select from '../components/Select';
import Table from '../components/Table';
import { AppContext } from '../contexts';
import { APP_TITLE } from '../utils/constants';
import { getImages, scanImage } from '../api/image-scan';
import { JfrogHeadline } from '../components/JfrogHeadline';
import { useHistory } from 'react-router-dom';

export const ScanPage = () => {
  const context = useContext(AppContext);
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
    } catch (e) {
      setIsScanning(false);
      alert(e);
    }
  };

  const getSettingsButton = () => {
    return (
      <Button
        variant="outlined"
        onClick={onSettingsClick}
        sx={{ position: 'absolute', right: '0', top: '0', fontWeight: '700' }}
      >
        Settings
      </Button>
    );
  };

  return (
    <>
      <Helmet>
        <title>{APP_TITLE}</title>
      </Helmet>
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
        <Box padding="5px 0" bgcolor="#E5EBF3" alignItems="center" marginTop="20px" display="flex" width={1 / 2}>
          <CircularProgress size="10px" sx={{ margin: '0 10px' }} />
          <Typography color="#556274" fontWeight="400" fontSize="12px">
            scanning {selectedImage}...
          </Typography>
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

const ScanButton = styled(Button)`
  margin-left: 30px;
  padding: 0 50px;
  background-color: #4172e8;
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
