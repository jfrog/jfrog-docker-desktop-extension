import { Box, styled, Typography, SelectChangeEvent, CircularProgress, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Select from '../components/Select';
import Table from '../components/Table';
import { getImages, scanImage } from '../api/image-scan';
import { JfrogHeadline } from '../components/JfrogHeadline';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

export const ScanPage = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [dockerImages, setDockerImages] = useState<string[]>([]);
  const [isScanningMap, setIsScanningMap] = useState<any>({});
  const [scanResultsMap, setScanResultsMap] = useState<any>({});
  const [runningScanId, setRunningScanId] = useState(0);

  let history = useHistory();

  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelectedImage(event.target.value);
    handleCancelScan();
  };

  const handleCancelScan = () => {
    setIsScanningMap({});
    setScanResultsMap({});
    setRunningScanId(0);
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

  const onScanClick = async (scanId: number) => {
    try {
      setScanResultsMap({});
      setRunningScanId(scanId);
      setIsScanningMap({ [scanId]: true });
      let results = await scanImage(selectedImage);
      console.log(results);
      setScanResultsMap({ ...scanResultsMap, [scanId]: results.Vulnerabilities });
      setIsScanningMap({ ...isScanningMap, [scanId]: false });
    } catch (e) {
      setIsScanningMap({ ...isScanningMap, [scanId]: false });
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
      {getSettingsButton()}

      <JfrogHeadline headline="JFrog Xray Scan" marginBottom="50px" />

      <Typography variant="subtitle1">Select local image for scanning</Typography>
      <Box display="flex" width={1 / 2}>
        <Select onChange={handleChange} options={dockerImages} />
        <ScanButton
          variant="contained"
          sx={{ width: '120px', fontSize: '16px', fontWeight: '700' }}
          disabled={selectedImage == '' || isScanningMap[runningScanId]}
          onClick={() => onScanClick(Math.random())}
        >
          Scan
        </ScanButton>
      </Box>

      {isScanningMap[runningScanId] ? (
        <Box>
          <ProgressBox>
            <Box display="flex" alignItems="center">
              <CircularProgress size="10px" sx={{ margin: '0 10px' }} />
              <Typography fontWeight="400" fontSize="14px">
                scanning {selectedImage}...
              </Typography>
            </Box>
            <CloseIcon sx={{ cursor: 'pointer', fontSize: '18px' }} onClick={handleCancelScan} />
          </ProgressBox>
        </Box>
      ) : (
        ''
      )}

      {scanResultsMap[runningScanId] ? (
        <Box sx={{ marginTop: '50px' }}>
          <Typography variant="h6" fontWeight="500" fontSize="18px">
            Image Scan Results
          </Typography>
          <Table columnsData={scanTableColumnsData} rows={scanResultsMap[runningScanId]} />
        </Box>
      ) : (
        ''
      )}
    </>
  );
};

const ProgressBox = styled(Box)`
  color: #556274;
  background: #e5ebf3;
  padding: 5px;
  align-items: center;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
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
