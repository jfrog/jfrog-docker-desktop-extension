import { Box, styled, Typography, SelectChangeEvent, CircularProgress, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Select from '../components/Select';
import Table from '../components/Table';
import { getImages, scanImage } from '../api/image-scan';
import { JfrogHeadline } from '../components/JfrogHeadline';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Severity } from '../types/severity';
import { ImageData } from '../types/ImageData';
import { VulnerabilityKeys, Vulnerability } from '../types/Vulnerability';
import { SeverityIcons } from '../assets/severityIcons/SeverityIcons';
import { TechIcons } from '../assets/techIcons/TechIcons';

type ScanResults = {
  vulnerabilities: Array<Vulnerability>;
  licenses: Array<any>;
  securityViolations: Array<any>;
  licensesViolations: Array<any>;
  operationalRiskViolations: Array<any>;
};

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
        let imagesData: ImageData[] = await getImages();
        console.log(imagesData);
        let imagesList: string[] = [];
        imagesData.forEach((image) => {
          image.RepoTags?.forEach((repoTag) => {
            if (repoTag != '<none>:<none>') {
              imagesList.push(repoTag);
            }
          });
        });
        setDockerImages(imagesList);
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
      let results: ScanResults = await scanImage(selectedImage);
      console.log('scan results for ' + selectedImage, results);
      saveScanResults(scanId, results);
      setIsScanningMap({ ...isScanningMap, [scanId]: false });
    } catch (e) {
      setIsScanningMap({ ...isScanningMap, [scanId]: false });
      alert(e);
    }
  };

  const saveScanResults = (scanId: number, results: ScanResults) => {
    let vulns = results.vulnerabilities ?? [];

    vulns.forEach((vuln: Vulnerability) => {
      // Update CVE's field
      vuln.cveIds = [];
      vuln.cvssV2 = [];
      vuln.cvssV3 = [];
      vuln[VulnerabilityKeys.cves]?.forEach((cve: any) => {
        vuln.cveIds?.push(cve.id);
        vuln.cvssV2?.push(cve.cvssV2);
        vuln.cvssV3?.push(cve.cvssV3);
      });
      if (vuln.cveIds.join('') == '') {
        vuln.cveIds = [vuln.issueId];
      }

      // Update Fix versions field
      if (!vuln[VulnerabilityKeys.fixedVersions]) {
        vuln[VulnerabilityKeys.fixedVersions] = ['N/A'];
      }
    });

    setScanResultsMap({ ...scanResultsMap, [scanId]: vulns });
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

export type VulnsColumnData = {
  id: Partial<VulnerabilityKeys>;
  label?: string;
  sortOrder?: string[];
  maxWidth?: string;
  copyIcon?: boolean;
  iconList?: { [key: string]: string };
};

const scanTableColumnsData: Array<VulnsColumnData> = [
  {
    id: VulnerabilityKeys.severity,
    sortOrder: [Severity.Critical, Severity.High, Severity.Medium, Severity.Low, Severity.Unknown],
    maxWidth: '70px',
    iconList: SeverityIcons,
  },
  {
    id: VulnerabilityKeys.impactedPackageName,
    label: 'Impacted Package',
    copyIcon: true,
  },
  {
    id: VulnerabilityKeys.impactedPackageVersion,
    label: 'Version',
  },
  {
    id: VulnerabilityKeys.impactedPackageType,
    label: 'Type',
    maxWidth: '75px',
    iconList: TechIcons,
  },
  {
    id: VulnerabilityKeys.fixedVersions,
    label: 'Fix Versions',
    copyIcon: true,
  },
  {
    id: VulnerabilityKeys.cveIds,
    label: 'CVE',
    copyIcon: true,
  },
  {
    id: VulnerabilityKeys.cvssV3,
    label: 'CVSS 3.0',
    maxWidth: '60px',
  },
  {
    id: VulnerabilityKeys.cvssV2,
    label: 'CVSS 2.0',
    maxWidth: '60px',
  },
];

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
