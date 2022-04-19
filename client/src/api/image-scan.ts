import { getConfig } from './config';
import { execOnHost, throwErrorAsString } from './utils';

const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export async function scanImage(imageTag: string): Promise<any> {
  console.log('Running scanImage command on: ' + imageTag);
  if (development) {
    console.log('Dev environment. Getting sample results');
    return testScanResults;
  }

  let config = await getConfig();
  let cmdArgs: string[] = ['docker', 'scan', imageTag, '--format', 'simple-json'];
  if (config.jfrogExtensionConfig.project != undefined) {
    cmdArgs.push('--project', '"' + config.jfrogExtensionConfig.project + '"');
  } else if (config.jfrogExtensionConfig.watches != undefined) {
    cmdArgs.push('--watches', '"' + config.jfrogExtensionConfig.watches.join(',') + '"');
  }
  let scanResults;
  try {
    let cmdResult = await execOnHost('runcli.sh', 'runcli.bat', cmdArgs);
    scanResults = JSON.parse(cmdResult.stdout);
  } catch (e) {
    throwErrorAsString(e);
  }
  return scanResults;
}

export async function getImages(): Promise<any> {
  console.log('Running getImages command');
  if (development) {
    console.log('Dev environment. Getting sample results');
    return testImageNames;
  }

  return window.ddClient.docker.listImages();
}

const testImageNames = [
  {
    RepoTags: ['releases-docker.jfrog.io/jfrog/jfrog-cli-v2'],
  },
  {
    RepoTags: ['registry.access.redhat.com/rhel-minimal'],
  },
  {
    RepoTags: ['rbusybox:1'],
  },
  {
    RepoTags: ['busybox:2'],
  },
  {
    RepoTags: ['busybox:3'],
  },
  {
    RepoTags: ['busybox:4'],
  },
  {
    RepoTags: ['busybox:5'],
  },
  {
    RepoTags: ['<none>:<none>'],
  },
  {
    RepoTags: [],
  },
  {},
];

const testScanResults = {
  vulnerabilities: [
    {
      summary: 'Go Unspecified Issue',
      severity: 'Unknown',
      impactedPackageName: 'github.com/golang/go',
      impactedPackageVersion: '1.17.8',
      impactedPackageType: 'Composer',
      fixedVersions: ['[1.17.9]', '[1.18.1]'],
      components: [
        {
          name: 'jfrog/jfrog-docker-desktop-extension',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-24675',
          cvssV2: '',
          cvssV3: '',
        },
        {
          id: 'CVE-2022-24675',
          cvssV2: '',
          cvssV3: '',
        },
      ],
      issueId: 'XRAY-203335',
      references: [
        'http://cve.mitre.org/cgi-bin/cvename.cgi?name=2022-24675',
        'https://github.com/golang/go/issues/51853',
        'https://github.com/golang/go/issues/52036',
        'https://github.com/golang/go/issues/52037',
        'https://twitter.com/DasSkelett/status/1507002451555086341',
      ],
    },
    {
      summary:
        'archiver tar.go untarFile() Function Tar File Unpacking Nested Symbolic Link Handling Arbitrary File Write',
      severity: 'High',
      impactedPackageName: 'github.com/mholt/archiver/v3',
      impactedPackageVersion: '3.5.1',
      impactedPackageType: 'Go',
      fixedVersions: null,
      components: [
        {
          name: 'jfrog/jfrog-docker-desktop-extension',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: '',
          cvssV2: '9.3',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-138878',
      references: [
        'https://securitylab.github.com/advisories/GHSL-2020-252-zipslip-archiver',
        'https://github.com/mholt/archiver/commit/fea250ac6eacd56f90a82fbe2481cfdbb9a1bbd1',
      ],
    },
    {
      summary:
        'golang.org/x/crypto/ssh before 0.0.0-20220314234659-1baeb1ce4c0b in Go through 1.16.15 and 1.17.x through 1.17.8 allows an attacker to crash a server in certain circumstances involving AddHostKey.',
      severity: 'High',
      impactedPackageName: 'golang.org/x/crypto',
      impactedPackageVersion: '0.0.0-20210817164053-32db794688a5',
      impactedPackageType: 'Go',
      fixedVersions: ['[0.0.0-20220314234659-1baeb1ce4c0b]'],
      components: [
        {
          name: 'jfrog/jfrog-docker-desktop-extension',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-27191',
          cvssV2: '4.3',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-200208',
      references: [
        'https://groups.google.com/g/golang-announce/c/-cp44ypCT5s',
        'https://groups.google.com/g/golang-announce',
      ],
    },
    {
      summary:
        'ssh Package for Go ssh/cipher.go readCipherPacket() Functions GCM / ChaChaPoly1305 Packet Empty Plaintext Remote DoS',
      severity: 'High',
      impactedPackageName: 'golang.org/x/crypto',
      impactedPackageVersion: '0.0.0-20210817164053-32db794688a5',
      impactedPackageType: 'Go',
      fixedVersions: ['[0.0.0-20211202192323-5770296d904e]'],
      components: [
        {
          name: 'jfrog/jfrog-docker-desktop-extension',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: '',
          cvssV2: '7.8',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-43565',
          cvssV2: '',
          cvssV3: '',
        },
      ],
      issueId: 'XRAY-194565',
      references: [
        'http://cve.mitre.org/cgi-bin/cvename.cgi?name=2021-43565',
        'https://groups.google.com/g/golang-announce/c/2AR1sKiM-Qs/m/9LAF9FxvBwAJ?pli=1',
        'https://github.com/golang/go/issues/49932',
        'https://go-review.googlesource.com/c/crypto/+/368814/',
        'https://github.com/golang/crypto/commit/5770296d904e90f15f38f77dfc2e43fdf5efc083',
        'https://pkg.go.dev/golang.org/x/crypto@v0.0.0-20211202192323-5770296d904e?tab=versions',
        'https://pkg.go.dev/golang.org/x/crypto@v0.0.0-20211202192323-5770296d904e/ssh?tab=versions',
        'https://access.redhat.com/security/cve/cve-2021-43565',
        'https://bugzilla.redhat.com/show_bug.cgi?id=2030787',
        'https://forums.opensuse.org/showthread.php/564946-openSUSE-SU-2022-0040-1-important-Security-update-for-kubevirt-virt-api-container-virt-controlle',
        'https://bugzilla.suse.com/show_bug.cgi?id=1193930',
        'https://www.suse.com/support/update/announcement/2022/suse-su-20220130-1/',
        'https://forums.opensuse.org/showthread.php/566809-openSUSE-SU-2022-0526-1-moderate-Security-update-for-kubevirt-virt-api-container-virt-controller',
        'http://access.redhat.com/errata/RHSA-2022:0735',
        'http://access.redhat.com/errata/RHSA-2022:0595',
        'http://access.redhat.com/errata/RHSA-2022:1081',
        'https://www.ibm.com/support/pages/node/6564609',
      ],
    },
  ],
  securityViolations: null,
  licensesViolations: null,
  licenses: null,
  operationalRiskViolations: null,
};
