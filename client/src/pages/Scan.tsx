import { Box, styled, Typography, SelectChangeEvent, CircularProgress, Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Select from '../components/Select';
import Table from '../components/Table';
import { AppContext } from '../contexts';
import { APP_TITLE, PAGE_TITLE_HOME } from '../utils/constants';
import { getImages, scanImage } from '../api/image-scan';
import { JfrogHeadline } from '../components/JfrogHeadline';
import { useHistory } from 'react-router-dom';

export const ScanPage = () => {
  const context = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState('');
  const [dockerImages, setDockerImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  let history = useHistory();

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

  const onSettingsClick = async () => {
    history.push('/settings');
  };

  const onScanClick = async () => {
    try {
      setIsLoading(true);
      setScanResults([]);
      let results = await scanImage(selectedImage);
      console.log(results);
      setScanResults(results.Vulnerabilities);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
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
        <title>
          {PAGE_TITLE_HOME} | {APP_TITLE}
        </title>
      </Helmet>
      {getSettingsButton()}

      <JfrogHeadline headline="JFrog Xray Scan" marginBottom="50px" />
      <Typography variant="subtitle1">Image</Typography>
      <Box display="flex" width={1 / 2}>
        <Select onChange={handleChange} options={dockerImages} />
        <ScanButton
          variant="contained"
          sx={{ width: '120px', fontSize: '16px', fontWeight: '700' }}
          disabled={selectedImage == ''}
          onClick={onScanClick}
        >
          Scan
        </ScanButton>
      </Box>

      {isLoading ? (
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

const scanResultColumnNames = [
  'Severity',
  'ImpactedPackage',
  'ImpactedPackageVersion',
  'Type',
  'FixedVersions',
  'CVE',
  'CVSSv2',
  'CVSSv3',
];

const scanTableColumnsData = [
  {
    name: 'Severity',
    hasIcon: true,
    minWidth: '50px',
  },
  {
    name: 'ImpactedPackage',
  },
  {
    name: 'ImpactedPackageVersion',
  },
  {
    name: 'Type',
    hasIcon: true,
    minWidth: '50px',
  },
  {
    name: 'FixedVersions',
  },
  {
    name: 'CVE',
  },
  {
    name: 'CVSSv2',
    minWidth: '50px',
  },
  {
    name: 'CVSSv3',
    minWidth: '50px',
  },
];
