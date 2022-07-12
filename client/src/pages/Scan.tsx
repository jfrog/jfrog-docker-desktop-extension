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
import { VulnerabilityKeys, Vulnerability, Cve } from '../types/Vulnerability';
import { SeverityIcons } from '../assets/severityIcons/SeverityIcons';
import { TechIcons } from '../assets/techIcons/TechIcons';
import PieChartBox, { ChartItemProps } from '../components/PieChart';
import { ddToast } from '../api/utils';

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
  const [runningScanId, setRunningScanId] = useState(0);

  const [scanData, setScanData] = useState<{
    [scanId: string]: {
      isScanning: boolean;
      scanResults: any;
      severityCount: { [key: string]: number };
    };
  }>({});

  const history = useHistory();

  const handleChange = (selectedImage: string | null) => {
    setSelectedImage(selectedImage || '');
    setScanData({});
  };

  const handleCancelScan = () => {
    setRunningScanId(0);
    setScanData({});
  };

  useEffect(() => {
    const getDockerImages = async () => {
      try {
        const imagesData: ImageData[] = await getImages();
        console.log(imagesData);
        const imagesList: string[] = [];
        imagesData.forEach((image) => {
          image.RepoTags?.forEach((repoTag) => {
            if (repoTag != '<none>:<none>') {
              imagesList.push(repoTag);
            }
          });
        });
        setDockerImages(imagesList);
      } catch (e: any) {
        ddToast.error(e.toString());
      }
    };
    getDockerImages();
  }, []);

  const onSettingsClick = async () => {
    history.push('/settings');
  };

  const onScanClick = async (scanId: number) => {
    try {
      setRunningScanId(scanId);
      setScanData({ [scanId]: { ...scanData[scanId], scanResults: null, isScanning: true } });
      const results: ScanResults = await scanImage(selectedImage);
      console.log(`[${scanId}] scan results for ${selectedImage}`, results);
      saveScanResults(scanId, results);
    } catch (e: any) {
      setScanData({ ...scanData, [scanId]: {} });
      ddToast.error(e.toString());
    }
  };

  const saveScanResults = (scanId: number, results: ScanResults) => {
    const vulns = results.vulnerabilities ?? results.securityViolations ?? [];
    const counter: { [key: string]: number } = {
      [Severity.Critical]: 0,
      [Severity.High]: 0,
      [Severity.Medium]: 0,
      [Severity.Low]: 0,
      [Severity.Unknown]: 0,
    };
    vulns.forEach((vuln: Vulnerability) => {
      // Update CVE's field
      vuln.cveIds = [];
      vuln.cvssV2 = [];
      vuln.cvssV3 = [];
      vuln.cves?.forEach((cve: Cve) => {
        vuln.cveIds.push(cve.id);
        vuln.cvssV2.push(cve.cvssV2);
        vuln.cvssV3.push(cve.cvssV3);
      });
      if (vuln.cveIds?.join('') == '') {
        vuln.cveIds = [vuln.issueId];
      }

      // Update Fix versions field
      if (!vuln.fixedVersions) {
        vuln.fixedVersions = ['N/A'];
      }
      counter[vuln.severity.toString()]++;
    });

    console.log('sdsdsd', vulns);

    setScanData((data) => ({
      ...data,
      [scanId]: { scanResults: vulns, severityCount: counter, isScanning: false },
    }));
  };

  const getSettingsButton = () => {
    return (
      <Button variant="outlined" onClick={onSettingsClick} sx={{ position: 'absolute', right: '40px', top: '40px' }}>
        Settings
      </Button>
    );
  };
  const isScanning = scanData[runningScanId]?.isScanning;
  const scanResults = scanData[runningScanId]?.scanResults;
  const severityCount = scanData[runningScanId]?.severityCount;
  return (
    <>
      {getSettingsButton()}

      <JfrogHeadline headline="JFrog Xray" marginBottom="50px" />

      <Box height="200px" display="flex" justifyContent="space-between">
        <Box width="calc(100% - 350px)" maxWidth="1000px">
          <Typography fontSize="16px">Select local image for scanning</Typography>
          <Box display="flex" width={'90%'}>
            <Select onChange={handleChange} options={dockerImages} />
            <ScanButton
              variant="contained"
              disabled={selectedImage == '' || isScanning}
              onClick={() => onScanClick(Math.random())}
              sx={{ fontSize: '16px' }}
            >
              Scan
            </ScanButton>
          </Box>
          {isScanning && (
            <Box>
              <ProgressBox>
                <Box display="flex" alignItems="center">
                  <CircularProgress size="10px" sx={{ margin: '0 10px' }} />
                  <Typography fontWeight="400" fontSize="14px">
                    Scanning {selectedImage}...
                  </Typography>
                </Box>
                <CloseIcon sx={{ cursor: 'pointer', fontSize: '18px' }} onClick={handleCancelScan} />
              </ProgressBox>
            </Box>
          )}
        </Box>
        {scanResults && scanResults.length > 0 && severityCount && getSeverityPieChart(severityCount)}
      </Box>

      {scanResults ? (
        <Box sx={{ transform: 'translateY(-40px)' }}>
          <Box display="flex">
            <Typography variant="h1" fontWeight="500" fontSize="18px">
              Image Scan Results
            </Typography>
          </Box>
          <Table columnsData={scanTableColumnsData} rows={scanResults} />
        </Box>
      ) : (
        ''
      )}
    </>
  );
};

function getSeverityPieChart(severityCount: { [key: string]: number }) {
  const chartItems: ChartItemProps[] = [
    {
      title: Severity.Critical,
      value: severityCount[Severity.Critical],
      color: '#CA2632',
      icon: SeverityIcons.Critical,
    },
    {
      title: Severity.High,
      value: severityCount[Severity.High],
      color: '#FB515B',
      icon: SeverityIcons.High,
    },
    {
      title: Severity.Medium,
      value: severityCount[Severity.Medium],
      color: '#F97E3A',
      icon: SeverityIcons.Medium,
    },
    {
      title: Severity.Low,
      value: severityCount[Severity.Low],
      color: '#FCD95C',
      icon: SeverityIcons.Low,
    },
  ];
  if (severityCount[Severity.Unknown] > 0) {
    chartItems.push({ title: Severity.Unknown, value: severityCount[Severity.Unknown], color: '#818385' });
  }
  return <PieChartBox chartName="Vulnerabilities" chartItems={chartItems} />;
}

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
  width: 90%;
  @media screen and (prefers-color-scheme: dark) {
    color: #f8fafb;
    background: #18222b;
  }
`;

const ScanButton = styled(Button)`
  margin-left: 30px;
  padding: 0 50px;
`;
