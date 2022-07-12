import { getConfig } from './config';
import { execOnHostAndStreamResult, throwErrorAsString, ddClient, isDevelopment } from './utils';

/**
 * Scans an image by its tag and returns the results from JFrog CLI in simple-json format.
 */
export async function scanImage(imageTag: string): Promise<any> {
  console.log('Running scanImage command on: ' + imageTag);
  if (isDevelopment) {
    console.log('Dev environment. Getting sample results');
    return testScanResults;
  }

  let scanResults;
  try {
    const scanResultsStr = await getScanResultsStr(imageTag);
    scanResults = JSON.parse(scanResultsStr);
  } catch (e: any) {
    try {
      scanResults = JSON.parse(e.stdout);
      if (!scanResults.errors || scanResults.errors.length === 0) {
        throwErrorAsString(e);
      }
    } catch (e1) {
      // If the response from JFrog CLI couldn't be parsed, the error 'e' is thrown.
      throwErrorAsString(e);
    }
  }
  if (scanResults.errors && scanResults.errors.length > 0) {
    const errorMessage: string = scanResults.errors[0].errorMessage;
    // The error will always start with an uppercase letter.
    throw errorMessage[0].toUpperCase() + errorMessage.substring(1);
  }
  return scanResults;
}

async function getScanResultsStr(imageTag: string): Promise<string> {
  const config = await getConfig();
  const cmdArgs: string[] = ['docker', 'scan', imageTag, '--format', 'simple-json'];
  if (config.jfrogExtensionConfig.project != undefined) {
    cmdArgs.push('--project', '"' + config.jfrogExtensionConfig.project + '"', '--fail=false');
  } else if (config.jfrogExtensionConfig.watches != undefined) {
    cmdArgs.push('--watches', '"' + config.jfrogExtensionConfig.watches.join(',') + '"', '--fail=false');
  }
  let scanResultsStr = '';
  await new Promise<void>((resolve, reject) => {
    execOnHostAndStreamResult('runcli.sh', 'runcli.bat', cmdArgs, {
      stream: {
        onOutput(data: { stdout: string; stderr?: undefined } | { stdout?: undefined; stderr: string }): void {
          if (data.stdout) {
            scanResultsStr += data.stdout;
          } else {
            console.error(data.stderr);
          }
        },
        onError(error: any): void {
          console.error(error);
          reject(error);
        },
        onClose(exitCode: number): void {
          console.log('Image scan finished with exit code ' + exitCode);
          if (exitCode === 0) {
            resolve();
          } else {
            reject('Image scan failed');
          }
        },
      },
    });
  });
  return scanResultsStr;
}

export async function getImages(): Promise<any> {
  console.log('Running getImages command');
  if (isDevelopment) {
    console.log('Dev environment. Getting sample results');
    return testImageData;
  }

  return ddClient?.docker.listImages();
}

const testImageData = [
  {
    Containers: -1,
    Created: 1650375811,
    Id: 'sha256:e7b4e0208e222e2f7551ec241899bf516e0a5d16ebf925a176038ddd6aa3aadf',
    Labels: {
      'com.docker.desktop.extension.api.version': '>=0.2.0',
      'com.docker.desktop.extension.icon':
        'https://media.jfrog.com/wp-content/uploads/2022/02/04003536/JFrog_Logo_partner_isv.svg',
      'org.opencontainers.image.description': 'Scan your Docker images for vulnerabilities with JFrog Xray.',
      'org.opencontainers.image.title': 'JFrog',
      'org.opencontainers.image.vendor': 'JFrog Ltd.',
    },
    ParentId: '',
    RepoDigests: null,
    RepoTags: ['jfrog/jfrog-docker-desktop-extension:latest'],
    SharedSize: -1,
    Size: 73652102,
    VirtualSize: 73652102,
  },
  {
    Containers: -1,
    Created: 1650363481,
    Id: 'sha256:59a41725a889ff44787b792ad2cf5f500b60dddb350ef3dee5f42f9140c0c479',
    Labels: {
      'com.docker.desktop.extension.api.version': '>=0.2.0',
      'com.docker.desktop.extension.icon':
        'https://media.jfrog.com/wp-content/uploads/2022/02/04003536/JFrog_Logo_partner_isv.svg',
      'org.opencontainers.image.description': 'Scan your Docker images for vulnerabilities with JFrog Xray.',
      'org.opencontainers.image.title': 'JFrog',
      'org.opencontainers.image.vendor': 'JFrog Ltd.',
    },
    ParentId: '',
    RepoDigests: ['<none>@<none>'],
    RepoTags: ['<none>:<none>'],
    SharedSize: -1,
    Size: 73652418,
    VirtualSize: 73652418,
  },
  {
    Containers: -1,
    Created: 1650362345,
    Id: 'sha256:21af7347817b8996caeab324e97abd9d497d2e44fc0ab464f58ad400116867a2',
    Labels: {
      'com.docker.desktop.extension.api.version': '>=0.2.0',
      'com.docker.desktop.extension.icon':
        'https://media.jfrog.com/wp-content/uploads/2022/02/04003536/JFrog_Logo_partner_isv.svg',
      'org.opencontainers.image.description': 'Scan your Docker images for vulnerabilities with JFrog Xray.',
      'org.opencontainers.image.title': 'JFrog',
      'org.opencontainers.image.vendor': 'JFrog Ltd.',
    },
    ParentId: '',
    RepoDigests: ['<none>@<none>'],
    RepoTags: ['<none>:<none>'],
    SharedSize: -1,
    Size: 73652129,
    VirtualSize: 73652129,
  },
  {
    Containers: -1,
    Created: 1650361191,
    Id: 'sha256:585733083eae61ea3a52db385d597cd88b06a9ca422a197d4a291251e2a06279',
    Labels: {
      'com.docker.desktop.extension.api.version': '>=0.2.0',
      'com.docker.desktop.extension.icon':
        'https://media.jfrog.com/wp-content/uploads/2022/02/04003536/JFrog_Logo_partner_isv.svg',
      'org.opencontainers.image.description': 'Scan your Docker images for vulnerabilities with JFrog Xray.',
      'org.opencontainers.image.title': 'JFrog',
      'org.opencontainers.image.vendor': 'JFrog Ltd.',
    },
    ParentId: '',
    RepoDigests: ['<none>@<none>'],
    RepoTags: ['<none>:<none>'],
    SharedSize: -1,
    Size: 73651872,
    VirtualSize: 73651872,
  },
  {
    Containers: -1,
    Created: 1650285863,
    Id: 'sha256:1a2cb484451bffcab402cf12d541ba4bca12cc6628ca34a7651330426887ba08',
    Labels: {
      'com.docker.desktop.extension.api.version': '>=0.2.0',
      'com.docker.desktop.extension.icon':
        'https://media.jfrog.com/wp-content/uploads/2022/02/04003536/JFrog_Logo_partner_isv.svg',
      'org.opencontainers.image.description': 'Scan your Docker images for vulnerabilities with JFrog Xray.',
      'org.opencontainers.image.title': 'JFrog',
      'org.opencontainers.image.vendor': 'JFrog Ltd.',
    },
    ParentId: '',
    RepoDigests: ['<none>@<none>'],
    RepoTags: ['<none>:<none>'],
    SharedSize: -1,
    Size: 73648503,
    VirtualSize: 73648503,
  },
  {
    Containers: -1,
    Created: 1650283747,
    Id: 'sha256:6c17264ce8c31dcd65d4052bc82d08b08c1e7106ecb0cb0d8bfe09e3482f549e',
    Labels: {
      'com.docker.desktop.extension.api.version': '>=0.2.0',
      'com.docker.desktop.extension.icon':
        'https://media.jfrog.com/wp-content/uploads/2022/02/04003536/JFrog_Logo_partner_isv.svg',
      'org.opencontainers.image.description': 'Scan your Docker images for vulnerabilities with JFrog Xray.',
      'org.opencontainers.image.title': 'JFrog',
      'org.opencontainers.image.vendor': 'JFrog Ltd.',
    },
    ParentId: '',
    RepoDigests: ['<none>@<none>'],
    RepoTags: ['<none>:<none>'],
    SharedSize: -1,
    Size: 73648525,
    VirtualSize: 73648525,
  },
  {
    Containers: -1,
    Created: 1650274697,
    Id: 'sha256:184121374c4dda1a812a256e5f00ce4c457beb31ba1e0498249ea560fda22250',
    Labels: {
      'com.docker.desktop.extension.api.version': '>=0.2.0',
      'com.docker.desktop.extension.icon':
        'https://media.jfrog.com/wp-content/uploads/2022/02/04003536/JFrog_Logo_partner_isv.svg',
      'org.opencontainers.image.description': 'Scan your Docker images for vulnerabilities with JFrog Xray.',
      'org.opencontainers.image.title': 'JFrog',
      'org.opencontainers.image.vendor': 'JFrog Ltd.',
    },
    ParentId: '',
    RepoDigests: ['<none>@<none>'],
    RepoTags: ['<none>:<none>'],
    SharedSize: -1,
    Size: 73646965,
    VirtualSize: 73646965,
  },
  {
    Containers: -1,
    Created: 1649782006,
    Id: 'sha256:1e82d6263d922aa4ed31a3eb24164728793488b3a3b96e0850ff731dd76e2757',
    Labels: {
      'com.docker.desktop.extension.api.version': '>=0.2.0',
      'com.docker.desktop.extension.icon':
        'https://media.jfrog.com/wp-content/uploads/2022/02/04003536/JFrog_Logo_partner_isv.svg',
      'org.opencontainers.image.description': 'Scan your Docker images for vulnerabilities with JFrog Xray.',
      'org.opencontainers.image.title': 'JFrog',
      'org.opencontainers.image.vendor': 'JFrog Ltd.',
    },
    ParentId: '',
    RepoDigests: ['<none>@<none>'],
    RepoTags: ['<none>:<none>'],
    SharedSize: -1,
    Size: 73291115,
    VirtualSize: 73291115,
  },
  {
    Containers: -1,
    Created: 1649117999,
    Id: 'sha256:0ac33e5f5afa79e084075e8698a22d574816eea8d7b7d480586835657c3e1c8b',
    Labels: null,
    ParentId: '',
    RepoDigests: ['alpine@sha256:4edbd2beb5f78b1014028f4fbb99f3237d9561100b6881aabbf5acce2c4f9454'],
    RepoTags: ['alpine:3.15', 'alpine:latest'],
    SharedSize: -1,
    Size: 5574964,
    VirtualSize: 5574964,
  },
  {
    Containers: -1,
    Created: 1643837450,
    Id: 'sha256:0cda90e25432686bbdc3ec75cac7e08a956c5c9ce55b1dc6a0332936f7f42a84',
    Labels: {
      'com.docker.desktop.extension.api.version': '>=0.1.0',
      'com.docker.desktop.extension.icon': 'https://tailscale.com/files/tailscale-docker-icon.svg',
      'org.opencontainers.image.authors': 'Tailscale Inc.',
      'org.opencontainers.image.description': 'Connect your Docker containers to your secure private network.',
      'org.opencontainers.image.title': 'Tailscale',
      'org.opencontainers.image.vendor': 'Tailscale Inc.',
    },
    ParentId: '',
    RepoDigests: ['tailscale/docker-extension@sha256:49730b15f6446878a2f5170fd012c871f291b961d608ce341dd4ec530209a70a'],
    RepoTags: ['tailscale/docker-extension:0.0.2'],
    SharedSize: -1,
    Size: 128699151,
    VirtualSize: 128699151,
  },
  {
    Containers: -1,
    Created: 1642087193,
    Id: 'sha256:13d1ccc52ee59a489aab0a87a99ca99fd2203d6fec151bfd4e716538084840f0',
    Labels: null,
    ParentId: '',
    RepoDigests: [
      'releases-docker.jfrog.io/jfrog/jfrog-cli-v2@sha256:c546a2023e365c545f20ffce18fcd262b399317f1231636589813d08be35892b',
    ],
    RepoTags: ['releases-docker.jfrog.io/jfrog/jfrog-cli-v2:latest'],
    SharedSize: -1,
    Size: 52700006,
    VirtualSize: 52700006,
  },
  {
    Containers: -1,
    Created: 1641288459,
    Id: 'sha256:6e1d7b66248a4f49fbb8ad08913f71906687254e9503a39257fd1b4f5e22901f',
    Labels: {
      architecture: 'x86_64',
      'build-date': '2022-01-04T09:27:20.847714',
      'com.redhat.build-host': 'cpt-1003.osbs.prod.upshift.rdu2.redhat.com',
      'com.redhat.component': 'rhel7-atomic-container',
      'com.redhat.license_terms': 'https://www.redhat.com/licenses/eulas',
      description:
        'The Red Hat Enterprise Linux Base image is designed to be a minimal, fully supported base image where several of the traditional operating system components such as python an systemd have been removed. The Atomic Image also includes a simple package manager called microdnf which can add/update packages as needed.',
      'distribution-scope': 'public',
      'io.k8s.description':
        'The Red Hat Enterprise Linux Base image is designed to be a minimal, fully supported base image where several of the traditional operating system components such as python an systemd have been removed. The Atomic Image also includes a simple package manager called microdnf which can add/update packages as needed.',
      'io.k8s.display-name': 'Red Hat Enterprise Linux 7',
      'io.openshift.tags': 'minimal rhel7',
      maintainer: 'Red Hat, Inc.',
      name: 'rhel7-atomic',
      release: '598',
      summary:
        'Provides the latest release of Red Hat Enterprise Linux 7 in a minimal, fully supported base image where several of the traditional operating system components such as python an systemd have been removed.',
      url: 'https://access.redhat.com/containers/#/registry.access.redhat.com/rhel7-atomic/images/7.9-598',
      'vcs-ref': '9458c9de09a5c5395628921aa56237946749b433',
      'vcs-type': 'git',
      vendor: 'Red Hat, Inc.',
      version: '7.9',
    },
    ParentId: '',
    RepoDigests: [
      'registry.access.redhat.com/rhel-minimal@sha256:c5e2125f0704dbfb8090f1fa5bb1e4a7e0f7a49a965fe1fdd00dabc0b566677e',
    ],
    RepoTags: ['registry.access.redhat.com/rhel-minimal:latest'],
    SharedSize: -1,
    Size: 81502240,
    VirtualSize: 81502240,
  },
  {
    Containers: -1,
    Created: 1640891981,
    Id: 'sha256:beae173ccac6ad749f76713cf4440fe3d21d1043fe616dfbe30775815d1d0f6a',
    Labels: null,
    ParentId: '',
    RepoDigests: ['busybox@sha256:5acba83a746c7608ed544dc1533b87c737a0b0fb730301639a0179f9344b1678'],
    RepoTags: ['busybox:latest'],
    SharedSize: -1,
    Size: 1239820,
    VirtualSize: 1239820,
  },
  {
    Containers: -1,
    Created: 1639528555,
    Id: 'sha256:0fddcb73c2f4b1b99c3d9f4c7c5cb50f9ad992fba6ea21483de75bbc77f4b60d',
    Labels: {
      architecture: 'x86_64',
      'build-date': '2021-11-03T13:48:52.162446',
      'com.redhat.build-host': 'cpt-1002.osbs.prod.upshift.rdu2.redhat.com',
      'com.redhat.component': 'ubi8-micro-container',
      'com.redhat.license_terms': 'https://www.redhat.com/en/about/red-hat-end-user-license-agreements#UBI',
      description: "Very small image which doesn't install the package manager.",
      'distribution-scope': 'public',
      'io.k8s.description': "Very small image which doesn't install the package manager.",
      'io.k8s.display-name': 'Ubi8-micro',
      'io.openshift.expose-services': '',
      maintainer: 'devops@jfrog.com',
      name: 'ubi8/ubi-micro',
      release: '437',
      summary: 'ubi8 micro image',
      url: 'https://access.redhat.com/containers/#/registry.access.redhat.com/ubi8/ubi-micro/images/8.5-437',
      'vcs-ref': 'a815762f0a8b8e8a2315a40d00d1581755cbb82c',
      'vcs-type': 'git',
      vendor: 'Red Hat, Inc.',
      version: '8.5',
    },
    ParentId: '',
    RepoDigests: [
      'releases-docker.jfrog.io/jfrog/artifactory-pro@sha256:4704b659a183fecc786783e826537978249f2dd2d6665b434340dc7cc75016a9',
    ],
    RepoTags: ['releases-docker.jfrog.io/jfrog/artifactory-pro:latest'],
    SharedSize: -1,
    Size: 1218726346,
    VirtualSize: 1218726346,
  },
  {
    Containers: -1,
    Created: 1639499296,
    Id: 'sha256:9b3f98fda952aa1b1044a147ad613e712543303eb5c97d29d95ac52b571c94f0',
    Labels: {
      architecture: 'x86_64',
      'build-date': '2021-12-14T16:27:21.953378',
      'com.redhat.build-host': 'cpt-1001.osbs.prod.upshift.rdu2.redhat.com',
      'com.redhat.component': 'ubi8-micro-container',
      'com.redhat.license_terms': 'https://www.redhat.com/en/about/red-hat-end-user-license-agreements#UBI',
      description: "Very small image which doesn't install the package manager.",
      'distribution-scope': 'public',
      'io.k8s.description': "Very small image which doesn't install the package manager.",
      'io.k8s.display-name': 'Ubi8-micro',
      'io.openshift.expose-services': '',
      maintainer: 'Red Hat, Inc.',
      name: 'ubi8/ubi-micro',
      release: '596',
      summary: 'ubi8 micro image',
      url: 'https://access.redhat.com/containers/#/registry.access.redhat.com/ubi8/ubi-micro/images/8.5-596',
      'vcs-ref': 'a815762f0a8b8e8a2315a40d00d1581755cbb82c',
      'vcs-type': 'git',
      vendor: 'Red Hat, Inc.',
      version: '8.5',
    },
    ParentId: '',
    RepoDigests: [
      'redhat/ubi8-micro@sha256:46ac008c162ffdb011823435efed620f84892bc2cc1e35faf95e6e42863ec50e',
      'ecosysjfrog-docker-virtual.jfrog.io/redhat/ubi8-micro@sha256:15df0ee678047515c7565dfbb20a4e4639e89ebf77d325019e143eba48a3a986',
      'ecosysjfrog-docker-virtual.jfrog.io/redhat/ubi8-micro@sha256:46ac008c162ffdb011823435efed620f84892bc2cc1e35faf95e6e42863ec50e',
    ],
    RepoTags: ['redhat/ubi8-micro:latest', 'ecosysjfrog-docker-virtual.jfrog.io/redhat/ubi8-micro:latest'],
    SharedSize: -1,
    Size: 36546532,
    VirtualSize: 36546532,
  },
  {
    Containers: -1,
    Created: 1636737617,
    Id: 'sha256:a787cb9865032e5b5a407ecdf34b57a23a4a076aaa043d71742ddb6726ec9229',
    Labels: null,
    ParentId: '',
    RepoDigests: ['alpine@sha256:bcae378eacedab83da66079d9366c8f5df542d7ed9ab23bf487e3e1a8481375d'],
    RepoTags: ['alpine:3.11'],
    SharedSize: -1,
    Size: 5619056,
    VirtualSize: 5619056,
  },
  {
    Containers: -1,
    Created: 1636737585,
    Id: 'sha256:0a97eee8041e2b6c0e65abb2700b0705d0da5525ca69060b9e0bde8a3d17afdb',
    Labels: null,
    ParentId: '',
    RepoDigests: ['alpine@sha256:635f0aa53d99017b38d1a0aa5b2082f7812b03e3cdb299103fe77b5c8a07f1d2'],
    RepoTags: ['alpine:3.14.3'],
    SharedSize: -1,
    Size: 5605371,
    VirtualSize: 5605371,
  },
  {
    Containers: -1,
    Created: 1636025052,
    Id: 'sha256:cde6a23eab08e61f7f3be3fa9c27f7e235739f89bc152710605a0a217e7b0b4b',
    Labels: {
      'org.opencontainers.image.authors': 'oliver@die-thomsens.de',
    },
    ParentId: '',
    RepoDigests: ['thomseno/h2@sha256:8c04d81831e35929e6e8a3ee9701695bf372deac3ba3740ab3b8e4613648b749'],
    RepoTags: ['thomseno/h2:latest'],
    SharedSize: -1,
    Size: 88382394,
    VirtualSize: 88382394,
  },
  {
    Containers: -1,
    Created: 1635177905,
    Id: 'sha256:2452e51150c6e4eb3f44a3250da738bbf0c43aeabac73f6a8ec39229375d4059',
    Labels: {
      maintainer: 'NGINX Docker Maintainers <docker-maint@nginx.com>',
    },
    ParentId: '',
    RepoDigests: null,
    RepoTags: ['docker101tutorial:latest'],
    SharedSize: -1,
    Size: 28289726,
    VirtualSize: 28289726,
  },
  {
    Containers: -1,
    Created: 1634706573,
    Id: 'sha256:0deb7380d7082cee3bd7aa40a706747df7cdeab90b14488c49c732b6ad0e4ced',
    Labels: null,
    ParentId: '',
    RepoDigests: [
      '10.70.30.16:8082/docker-local/myalpine@sha256:de8098fcfd526da73c5b06d78da44b0f672ddbe875c1ccdf60b60f655eb584cd',
      '10.70.30.17:8082/docker-local/myalpine@sha256:de8098fcfd526da73c5b06d78da44b0f672ddbe875c1ccdf60b60f655eb584cd',
      'alpine/git@sha256:62fb085cd64276729dde5176d63cb2a3c1d13fcd0db7ca86de6349d186e8f4e3',
    ],
    RepoTags: [
      '10.70.30.16:8082/alpine:latest',
      '10.70.30.16:8082/docker-local/myalpine:latest',
      '10.70.30.17:8082/artifactory/docker-local/alpine/git:latest',
      '10.70.30.17:8082/artifactory/docker-local/myalpine:latest',
      '10.70.30.17:8082/docker-local/myalpine:latest',
      'alpine/git:latest',
    ],
    SharedSize: -1,
    Size: 27353264,
    VirtualSize: 27353264,
  },
  {
    Containers: -1,
    Created: 1632440877,
    Id: 'sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412',
    Labels: null,
    ParentId: '',
    RepoDigests: ['hello-world@sha256:97a379f4f88575512824f3b352bc03cd75e239179eea0fecc38e597b2209f49a'],
    RepoTags: ['hello-world:latest'],
    SharedSize: -1,
    Size: 13256,
    VirtualSize: 13256,
  },
  {
    Containers: -1,
    Created: 1631730005,
    Id: 'sha256:5d0da3dc976460b72c77d94c8a1ad043720b0416bfc16c52c45d4847e53fadb6',
    Labels: {
      'org.label-schema.build-date': '20210915',
      'org.label-schema.license': 'GPLv2',
      'org.label-schema.name': 'CentOS Base Image',
      'org.label-schema.schema-version': '1.0',
      'org.label-schema.vendor': 'CentOS',
    },
    ParentId: '',
    RepoDigests: ['centos@sha256:a27fd8080b517143cbbbab9dfb7c8571c40d67d534bbdee55bd6c473f432b177'],
    RepoTags: ['centos:latest'],
    SharedSize: -1,
    Size: 231268856,
    VirtualSize: 231268856,
  },
  {
    Containers: -1,
    Created: 1630084785,
    Id: 'sha256:14119a10abf4669e8cdbdff324a9f9605d99697215a0d21c360fe8dfa8471bab',
    Labels: null,
    ParentId: '',
    RepoDigests: [
      'alpine@sha256:e1c082e3d3c45cccac829840a25941e679c25d438cc8412c2fa221cf1a824e6a',
      'ecosysjfrog-docker-virtual.jfrog.io/alpine@sha256:e1c082e3d3c45cccac829840a25941e679c25d438cc8412c2fa221cf1a824e6a',
    ],
    RepoTags: ['alpine:3.14.2'],
    SharedSize: -1,
    Size: 5595292,
    VirtualSize: 5595292,
  },
  {
    Containers: -1,
    Created: 1623795577,
    Id: 'sha256:d4ff818577bc193b309b355b02ebc9220427090057b54a59e73b79bdfe139b83',
    Labels: null,
    ParentId: '',
    RepoDigests: ['alpine@sha256:adab3844f497ab9171f070d4cae4114b5aec565ac772e2f2579405b78be67c96'],
    RepoTags: ['alpine:3.14.0'],
    SharedSize: -1,
    Size: 5595013,
    VirtualSize: 5595013,
  },
  {
    Containers: -1,
    Created: 1617844801,
    Id: 'sha256:9048d09ea9ad3c3ffca461c8c2e5233a34411b6f38a8ab11a2eca7fd9c94fd4c',
    Labels: null,
    ParentId: '',
    RepoDigests: ['busybox@sha256:315fd9e7f9056a6d76dfc2c63a5377c37aaa79faed354dce683147ed781adc77'],
    RepoTags: ['busybox:1.33.0'],
    SharedSize: -1,
    Size: 1235829,
    VirtualSize: 1235829,
  },
  {
    Containers: -1,
    Created: 1579798407,
    Id: 'sha256:c8bccc0af9571ec0d006a43acb5a8d08c4ce42b6cc7194dd6eb167976f501ef1',
    Labels: null,
    ParentId: '',
    RepoDigests: ['alpine@sha256:2bb501e6173d9d006e56de5bce2720eb06396803300fe1687b58a7ff32bf4c14'],
    RepoTags: ['alpine:3.8'],
    SharedSize: -1,
    Size: 4413305,
    VirtualSize: 4413305,
  },
  {
    Containers: -1,
    Created: 1570709126,
    Id: 'sha256:1ea36b402ef3e6a4098460c4943a38b447d25b27215498695fd6b1245ea6bbdf',
    Labels: {
      'com.redhat.component': 'rh-redis32-container',
      description:
        'Redis 3.2 available as container, is an advanced key-value store. It is often referred to as a data structure server since keys can contain strings, hashes, lists, sets and sorted sets. You can run atomic operations on these types, like appending to a string; incrementing the value in a hash; pushing to a list; computing set intersection, union and difference; or getting the member with highest ranking in a sorted set. In order to achieve its outstanding performance, Redis works with an in-memory dataset. Depending on your use case, you can persist it either by dumping the dataset to disk every once in a while, or by appending each command to a log.',
      'io.k8s.description':
        'Redis 3.2 available as container, is an advanced key-value store. It is often referred to as a data structure server since keys can contain strings, hashes, lists, sets and sorted sets. You can run atomic operations on these types, like appending to a string; incrementing the value in a hash; pushing to a list; computing set intersection, union and difference; or getting the member with highest ranking in a sorted set. In order to achieve its outstanding performance, Redis works with an in-memory dataset. Depending on your use case, you can persist it either by dumping the dataset to disk every once in a while, or by appending each command to a log.',
      'io.k8s.display-name': 'Redis 3.2',
      'io.openshift.builder-version': '3e6f34e',
      'io.openshift.expose-services': '6379:redis',
      'io.openshift.s2i.scripts-url': 'image:///usr/libexec/s2i',
      'io.openshift.tags': 'database,redis,redis32,rh-redis32',
      'io.s2i.scripts-url': 'image:///usr/libexec/s2i',
      maintainer: 'SoftwareCollections.org <sclorg@redhat.com>',
      name: 'centos/redis-32-centos7',
      'org.label-schema.build-date': '20190801',
      'org.label-schema.license': 'GPLv2',
      'org.label-schema.name': 'CentOS Base Image',
      'org.label-schema.schema-version': '1.0',
      'org.label-schema.vendor': 'CentOS',
      summary: 'Redis in-memory data structure store, used as database, cache and message broker',
      usage: 'docker run -d --name redis_database -p 6379:6379 centos/redis-32-centos7',
      version: '3.2',
    },
    ParentId: '',
    RepoDigests: ['centos/redis-32-centos7@sha256:06dbb609484330ec6be6090109f1fa16e936afcf975d1cbc5fff3e6c7cae7542'],
    RepoTags: ['centos/redis-32-centos7:latest'],
    SharedSize: -1,
    Size: 268397541,
    VirtualSize: 268397541,
  },
  {
    Containers: -1,
    Created: 1516768175,
    Id: 'sha256:5b0d59026729b68570d99bc4f3f7c31a2e4f2a5736435641565d93e7c25bd2c3',
    Labels: null,
    ParentId: '',
    RepoDigests: ['busybox@sha256:187c294487772d71eb5e6675f31e8863fcd655e44f634ffbc92ed30f407a1b9d'],
    RepoTags: ['busybox:1.28.0'],
    SharedSize: -1,
    Size: 1146369,
    VirtualSize: 1146369,
  },
  {
    Containers: -1,
    Created: 1514442614,
    Id: 'sha256:57bebb0878a08e24e69c5f6755cb21a665ff735b528926907170cca94f04cdca',
    Labels: null,
    ParentId: '',
    RepoDigests: [
      'rpmdpkg/docker-google-mirror@sha256:5a4869ece04c242a169133d28fe8edddabda7d02255f44c08eb6335696ce22b1',
    ],
    RepoTags: ['rpmdpkg/docker-google-mirror:latest'],
    SharedSize: -1,
    Size: 37547522,
    VirtualSize: 37547522,
  },
  {
    Containers: -1,
    Created: 1482165234,
    Id: 'sha256:eb40dcf64078249a33f68fdd8d80624cb81b524c24f50b95fff5c2b40bdc3fdc',
    Labels: {},
    ParentId: '',
    RepoDigests: ['django@sha256:5bfd3f442952463f5bc97188b7f43cfcd6c2f631a017ee2a6fca3cb8992501e8'],
    RepoTags: ['django:latest'],
    SharedSize: -1,
    Size: 436117187,
    VirtualSize: 436117187,
  },
];

const testScanResults = {
  vulnerabilities: [
    {
      summary:
        'Lib/zipfile.py in Python through 3.7.2 allows remote attackers to cause a denial of service (resource consumption) via a ZIP bomb.',
      severity: 'High',
      impactedPackageName: 'python3-libs',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9674',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-94619',
      references: [
        'https://bugs.python.org/issue36260',
        'https://bugs.python.org/issue36462',
        'https://github.com/python/cpython/blob/master/Lib/zipfile.py',
        'https://python-security.readthedocs.io/security.html#archives-and-zip-bomb',
        'https://www.python.org/news/security/',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libs',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:1989: bind security update (Important)',
      severity: 'High',
      impactedPackageName: 'bind-export-libs',
      impactedPackageVersion: '32:9.11.26-3.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[32:9.11.26-4.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-25215',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-176212',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1989',
        'https://access.redhat.com/security/cve/CVE-2021-25215',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'bind-export-libs',
            version: '32:9.11.26-3.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        '** DISPUTED ** An issue was discovered in pip (all versions) because it installs the version with the highest version number, even if the user had intended to obtain a private package from a private index. This only affects use of the --extra-index-url option, and exploitation requires that the package does not already exist in the public index (and thus the attacker can put the package there with an arbitrary version number). NOTE: it has been reported that this is intended functionality and the user is responsible for using --extra-index-url securely.',
      severity: 'High',
      impactedPackageName: 'pip',
      impactedPackageVersion: '9.0.3',
      impactedPackageType: 'Python',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20225',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-97724',
      references: [
        'https://bugzilla.redhat.com/show_bug.cgi?id=1835736',
        'https://cowlicks.website/posts/arbitrary-code-execution-from-pips-extra-index-url.html',
        'https://pip.pypa.io/en/stable/news/',
        'https://lists.apache.org/thread.html/rb1adce798445facd032870d644eb39c4baaf9c4a7dd5477d12bb6ab2@%3Cgithub.arrow.apache.org%3E',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'pip',
            version: '9.0.3',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'pip could download private packages from a public PyPI repository leading to code execution',
        details:
          "This vulnerability has been disputed by the maintainers of pip as the described behavior, while potentially insecure, is the intended one. If pip is executed with the `--extra-index-url` when using a private PyPI repository, an attacker could cause pip to download a private package (for example one named `private_package`) by adding a package with the same name (`private_package`) in the public PyPI repository. This would lead to remote code execution as pip will download the public package that could contain malicious code. This is similar to the [dependency confusion attack from 2021 by Alex Birsan](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610). However, this isn't considered a vulnerability in itself in pip, and there is no plan to patch or change it.",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue has been disputed by the vendor',
            description:
              'Pip maintainers, and others such as [RHEL](https://access.redhat.com/security/cve/cve-2018-20225) do not consider this a vulnerability as it is the intended behaviour',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Marked as unimportant by the Debian tracker',
            isPositive: true,
          },
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
        ],
        remediation:
          '##### Deployment mitigations\n\nDo not use the `--extra-index-url` flag with pip and consider using version pinning for deployments.',
      },
    },
    {
      summary:
        'CVE-2018-25032 zlib: A flaw found in zlib v1.2.2.2 through zlib v1.2.11 when compressing (not decompressing!) certain inputs.',
      severity: 'High',
      impactedPackageName: 'zlib',
      impactedPackageVersion: '0:1.2.11-17.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-25032',
          cvssV2: '5.0',
          cvssV3: '8.2',
        },
      ],
      issueId: 'XRAY-201302',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'zlib',
            version: '0:1.2.11-17.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'Memory corruption in zlib leads to denial of service when compressing malicious input',
        details:
          "[zlib](http://zlib.net/) is a famous software library used for data compression. zlib is a crucial component of many software platforms across many operating systems, including Linux, macOS, and iOS. A non-exhaustive list of applications using zlib can be found [here](https://en.wikipedia.org/wiki/zlib#Applications). \r\n\r\nzlib's compression can be compromised to cause an out-of-bounds write which leads to denial of service. This issue can theoretically lead to code execution, although this has not been proven yet.\r\n\r\nCurrently, the bug was only proven to be triggered when zlib is initialized with non-default values, in any of the following ways - \r\n1.`deflateInit2(\u0026strm, 7, Z_DEFLATED, 15, 1, Z_DEFAULT_STRATEGY);` (level can be either 7, 8 or 9)\r\n2. `deflateInit2(\u0026strm, X, Z_DEFLATED, X, X, Z_FIXED);` (X denoting any possible input)\r\n\r\nIn addition to that, an attacker must control the input data that will be fed to the compressor (the input buffer to `deflate()`)\r\n\r\nThe bug was introduced in `zlib 1.2.2.2`, with the addition of the `Z_FIXED` option. That option forces the use of fixed Huffman codes. For rare inputs with a large number of distant matches, the pending buffer into which the compressed data is written can overwrite the distance symbol table which it overlays. That results in corrupted output due to invalid distances, and can result in out-of-bound accesses, crashing the application.\r\n\r\nAn exploit has been [published](https://www.openwall.com/lists/oss-security/2022/03/26/1) for this issue, making exploitation more likely.",
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue has an exploit published',
            description: 'Crashing PoCs exist for both the `Z_DEFAULT_STRATEGY` and `Z_FIXED` strategies',
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'The vulnerability can currently only be exploited in one of two scenarios - \r\n1.`deflateInit2(\u0026strm, 7, Z_DEFLATED, 15, 1, Z_DEFAULT_STRATEGY);` (level can be either 7, 8 or 9)\r\n2. `deflateInit2(\u0026strm, X, Z_DEFLATED, X, X, Z_FIXED);` (X denoting any possible input)\r\n\r\nUsing the `Z_FIXED` argument is highly unlikely in production code\r\nUsing the `memLevel=1` argument is highly unlikely in production code (slows down performance)',
            isPositive: true,
          },
          {
            name: 'Exploitation of the issue is only possible when the vulnerable component is used in a specific manner. The attacker has to perform per-target research to determine the vulnerable attack vector.',
            description: 'The attacker must find a remote input that propagates into the `deflate()` call',
            isPositive: true,
          },
          {
            name: 'The issue has a detailed technical explanation published, that can aid in exploit development',
            description:
              'The original advisory also contains a technical writeup of the issue. Does not include an explanation on how to exploit the issue for RCE.',
          },
        ],
        remediation:
          '##### Development mitigations\n\nApply this [patch](https://github.com/madler/zlib/commit/5c44459c3b28a9bd3283aaceab7c615f8020c531)\n\n##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.',
      },
    },
    {
      summary: 'RHSA-2021:1206: gnutls and nettle security update (Important)',
      severity: 'High',
      impactedPackageName: 'gnutls',
      impactedPackageVersion: '0:3.6.14-7.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.14-8.el8_3, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20305',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-173384',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1206',
        'https://access.redhat.com/security/cve/CVE-2021-20305',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gnutls',
            version: '0:3.6.14-7.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2170: glib2 security and bug fix update (Important)',
      severity: 'High',
      impactedPackageName: 'glib2',
      impactedPackageVersion: '0:2.56.4-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.56.4-10.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27219',
          cvssV2: '5.0',
          cvssV3: '9.8',
        },
      ],
      issueId: 'XRAY-178553',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2170',
        'https://access.redhat.com/security/cve/CVE-2021-27219',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glib2',
            version: '0:2.56.4-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2717: systemd security update (Important)',
      severity: 'High',
      impactedPackageName: 'systemd-pam',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:239-45.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33910',
          cvssV2: '4.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-179897',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2717',
        'https://access.redhat.com/security/cve/CVE-2021-33910',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-pam',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'Insufficient bounds checking in basic/unit-name in systemd allows local attackers to perform denial of service by mounting a filesystem with a very long path',
        details:
          '[systemd]( https://systemd.io/) is a software suite that provides an array of system components for Linux-based operating systems. Its main aim is to unify service configuration and behavior across Linux distributions.\r\n\r\nWhen systemd parses the `/proc/self/mountinfo` file, each mountpoint is passed to `mount_setup_unit()` which eventually calls `unit_name_path_escape()`.\r\n`unit_name_path_escape()` uses `strdupa` which allows a local attacker to exhaust kernel stack memory before string length restrictions are applied, leading to OS denial of service.\r\n\r\nTo exploit this, an attacker will have to create nested directories such that the total path length exceeds 4MB.\r\n\r\nThis vulnerability is exploitable only if the kernel supports unprivileged user namespaces (`CONFIG_USER_NS`).',
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are either extremely common or nonexistent (always exploitable)',
            description: 'Local attacker only needs unprivileged user namespaces to be enabled',
          },
          {
            name: 'The issue has an exploit published',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/systemd/systemd-stable/commit/764b74113e36ac5219a4b82a05f311b5a92136ce) and build from source.\n\n##### Deployment mitigations\n\nSet /proc/sys/kernel/unprivileged_userns_clone to 0 - to prevent an attacker from mounting a long directory in user namespace. Set /proc/sys/kernel/unprivileged_bpf_disabled to 1 – to prevent an attacker from loading ebpf program into kernel. Note: these mitigations apply for the exploit that was detailed in the [technical writeup]( https://packetstormsecurity.com/files/163621/Sequoia-A-Deep-Root-In-Linuxs-Filesystem-Layer.html) but might not be applicable for other techniques.',
      },
    },
    {
      summary:
        'The pip package before 19.2 for Python allows Directory Traversal when a URL is given in an install command, because a Content-Disposition header can have ../ in a filename, as demonstrated by overwriting the /root/.ssh/authorized_keys file. This occurs in _download_http_url in _internal/download.py.',
      severity: 'High',
      impactedPackageName: 'pip',
      impactedPackageVersion: '9.0.3',
      impactedPackageType: 'Python',
      fixedVersions: ['[19.2]'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-20916',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-124981',
      references: [
        'https://github.com/gzpan123/pip/commit/a4c735b14a62f9cb864533808ac63936704f2ace',
        'https://github.com/pypa/pip/compare/19.1.1...19.2',
        'https://github.com/pypa/pip/issues/6413',
        'https://lists.debian.org/debian-lts-announce/2020/09/msg00010.html',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'pip',
            version: '9.0.3',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2717: systemd security update (Important)',
      severity: 'High',
      impactedPackageName: 'systemd',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:239-45.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33910',
          cvssV2: '4.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-179897',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2717',
        'https://access.redhat.com/security/cve/CVE-2021-33910',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'Insufficient bounds checking in basic/unit-name in systemd allows local attackers to perform denial of service by mounting a filesystem with a very long path',
        details:
          '[systemd]( https://systemd.io/) is a software suite that provides an array of system components for Linux-based operating systems. Its main aim is to unify service configuration and behavior across Linux distributions.\r\n\r\nWhen systemd parses the `/proc/self/mountinfo` file, each mountpoint is passed to `mount_setup_unit()` which eventually calls `unit_name_path_escape()`.\r\n`unit_name_path_escape()` uses `strdupa` which allows a local attacker to exhaust kernel stack memory before string length restrictions are applied, leading to OS denial of service.\r\n\r\nTo exploit this, an attacker will have to create nested directories such that the total path length exceeds 4MB.\r\n\r\nThis vulnerability is exploitable only if the kernel supports unprivileged user namespaces (`CONFIG_USER_NS`).',
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are either extremely common or nonexistent (always exploitable)',
            description: 'Local attacker only needs unprivileged user namespaces to be enabled',
          },
          {
            name: 'The issue has an exploit published',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/systemd/systemd-stable/commit/764b74113e36ac5219a4b82a05f311b5a92136ce) and build from source.\n\n##### Deployment mitigations\n\nSet /proc/sys/kernel/unprivileged_userns_clone to 0 - to prevent an attacker from mounting a long directory in user namespace. Set /proc/sys/kernel/unprivileged_bpf_disabled to 1 – to prevent an attacker from loading ebpf program into kernel. Note: these mitigations apply for the exploit that was detailed in the [technical writeup]( https://packetstormsecurity.com/files/163621/Sequoia-A-Deep-Root-In-Linuxs-Filesystem-Layer.html) but might not be applicable for other techniques.',
      },
    },
    {
      summary: 'RHSA-2021:2717: systemd security update (Important)',
      severity: 'High',
      impactedPackageName: 'systemd-udev',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:239-45.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33910',
          cvssV2: '4.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-179897',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2717',
        'https://access.redhat.com/security/cve/CVE-2021-33910',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-udev',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'Insufficient bounds checking in basic/unit-name in systemd allows local attackers to perform denial of service by mounting a filesystem with a very long path',
        details:
          '[systemd]( https://systemd.io/) is a software suite that provides an array of system components for Linux-based operating systems. Its main aim is to unify service configuration and behavior across Linux distributions.\r\n\r\nWhen systemd parses the `/proc/self/mountinfo` file, each mountpoint is passed to `mount_setup_unit()` which eventually calls `unit_name_path_escape()`.\r\n`unit_name_path_escape()` uses `strdupa` which allows a local attacker to exhaust kernel stack memory before string length restrictions are applied, leading to OS denial of service.\r\n\r\nTo exploit this, an attacker will have to create nested directories such that the total path length exceeds 4MB.\r\n\r\nThis vulnerability is exploitable only if the kernel supports unprivileged user namespaces (`CONFIG_USER_NS`).',
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are either extremely common or nonexistent (always exploitable)',
            description: 'Local attacker only needs unprivileged user namespaces to be enabled',
          },
          {
            name: 'The issue has an exploit published',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/systemd/systemd-stable/commit/764b74113e36ac5219a4b82a05f311b5a92136ce) and build from source.\n\n##### Deployment mitigations\n\nSet /proc/sys/kernel/unprivileged_userns_clone to 0 - to prevent an attacker from mounting a long directory in user namespace. Set /proc/sys/kernel/unprivileged_bpf_disabled to 1 – to prevent an attacker from loading ebpf program into kernel. Note: these mitigations apply for the exploit that was detailed in the [technical writeup]( https://packetstormsecurity.com/files/163621/Sequoia-A-Deep-Root-In-Linuxs-Filesystem-Layer.html) but might not be applicable for other techniques.',
      },
    },
    {
      summary: 'RHSA-2021:1206: gnutls and nettle security update (Important)',
      severity: 'High',
      impactedPackageName: 'nettle',
      impactedPackageVersion: '0:3.4.1-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.4.1-4.el8_3, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20305',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-173384',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1206',
        'https://access.redhat.com/security/cve/CVE-2021-20305',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'nettle',
            version: '0:3.4.1-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:1245: gnutls and nettle security update (Important)',
      severity: 'High',
      impactedPackageName: 'nettle',
      impactedPackageVersion: '0:3.4.1-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.4.1-2.el8_1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20305',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-173345',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1245',
        'https://access.redhat.com/security/cve/CVE-2021-20305',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'nettle',
            version: '0:3.4.1-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:1246: gnutls and nettle security update (Important)',
      severity: 'High',
      impactedPackageName: 'nettle',
      impactedPackageVersion: '0:3.4.1-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.4.1-2.el8_2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20305',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-173361',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1246',
        'https://access.redhat.com/security/cve/CVE-2021-20305',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'nettle',
            version: '0:3.4.1-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2717: systemd security update (Important)',
      severity: 'High',
      impactedPackageName: 'systemd-libs',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:239-45.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33910',
          cvssV2: '4.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-179897',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2717',
        'https://access.redhat.com/security/cve/CVE-2021-33910',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-libs',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'Insufficient bounds checking in basic/unit-name in systemd allows local attackers to perform denial of service by mounting a filesystem with a very long path',
        details:
          '[systemd]( https://systemd.io/) is a software suite that provides an array of system components for Linux-based operating systems. Its main aim is to unify service configuration and behavior across Linux distributions.\r\n\r\nWhen systemd parses the `/proc/self/mountinfo` file, each mountpoint is passed to `mount_setup_unit()` which eventually calls `unit_name_path_escape()`.\r\n`unit_name_path_escape()` uses `strdupa` which allows a local attacker to exhaust kernel stack memory before string length restrictions are applied, leading to OS denial of service.\r\n\r\nTo exploit this, an attacker will have to create nested directories such that the total path length exceeds 4MB.\r\n\r\nThis vulnerability is exploitable only if the kernel supports unprivileged user namespaces (`CONFIG_USER_NS`).',
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are either extremely common or nonexistent (always exploitable)',
            description: 'Local attacker only needs unprivileged user namespaces to be enabled',
          },
          {
            name: 'The issue has an exploit published',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/systemd/systemd-stable/commit/764b74113e36ac5219a4b82a05f311b5a92136ce) and build from source.\n\n##### Deployment mitigations\n\nSet /proc/sys/kernel/unprivileged_userns_clone to 0 - to prevent an attacker from mounting a long directory in user namespace. Set /proc/sys/kernel/unprivileged_bpf_disabled to 1 – to prevent an attacker from loading ebpf program into kernel. Note: these mitigations apply for the exploit that was detailed in the [technical writeup]( https://packetstormsecurity.com/files/163621/Sequoia-A-Deep-Root-In-Linuxs-Filesystem-Layer.html) but might not be applicable for other techniques.',
      },
    },
    {
      summary: 'CVE-2022-1271 gzip: arbitrary-file-write vulnerability',
      severity: 'High',
      impactedPackageName: 'gzip',
      impactedPackageVersion: '0:1.9-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-1271',
          cvssV2: '',
          cvssV3: '7.1',
        },
      ],
      issueId: 'XRAY-203387',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gzip',
            version: '0:1.9-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-4069 vim: use-after-free in ex_open() in src/ex_docmd.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'vim-minimal',
      impactedPackageVersion: '2:8.0.1763-15.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-4069',
          cvssV2: '6.8',
          cvssV3: '7.3',
        },
      ],
      issueId: 'XRAY-191665',
      references: ['https://access.redhat.com/security/cve/CVE-2021-4069'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'vim-minimal',
            version: '2:8.0.1763-15.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2017-14502 libarchive: Off-by-one error in the read_header function (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2017-14502',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-131952',
      references: ['https://access.redhat.com/security/cve/CVE-2017-14502'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-21674 libarchive: heap-based buffer overflow in archive_string_append_from_wcs function in archive_string.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-21674',
          cvssV2: '4.3',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-133961',
      references: ['https://access.redhat.com/security/cve/CVE-2020-21674'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-23177 libarchive: extracting a symlink with ACLs modifies ACLs of target',
      severity: 'Medium',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-23177',
          cvssV2: '',
          cvssV3: '6.6',
        },
      ],
      issueId: 'XRAY-192333',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-9075 binutils: heap-based buffer overflow in function _bfd_archive_64_bit_slurp_armap in archive64.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9075',
          cvssV2: '6.8',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134634',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9075'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-23308 libxml2: Use-after-free of ID and IDREF attributes',
      severity: 'Medium',
      impactedPackageName: 'libxml2',
      impactedPackageVersion: '0:2.9.7-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-23308',
          cvssV2: '4.3',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-198750',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libxml2',
            version: '0:2.9.7-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-4122 cryptsetup: disable encryption via header rewrite (moderate)',
      severity: 'Medium',
      impactedPackageName: 'cryptsetup-libs',
      impactedPackageVersion: '0:2.3.3-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-4122',
          cvssV2: '',
          cvssV3: '5.9',
        },
      ],
      issueId: 'XRAY-194481',
      references: ['https://access.redhat.com/security/cve/CVE-2021-4122'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'cryptsetup-libs',
            version: '0:2.3.3-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-23219 glibc: Stack-based buffer overflow in sunrpc clnt_create via a long pathname',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-23219',
          cvssV2: '7.5',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-196474',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2021-31566 libarchive: symbolic links incorrectly followed when changing modes, times, ACL and flags of a file while extracting an archive',
      severity: 'Medium',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-31566',
          cvssV2: '',
          cvssV3: '4.4',
        },
      ],
      issueId: 'XRAY-192332',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-23218 glibc: Stack-based buffer overflow in svcunix_create via long pathnames',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-23218',
          cvssV2: '7.5',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-196427',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3999 glibc: Off-by-one buffer overflow/underflow in getcwd()',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3999',
          cvssV2: '',
          cvssV3: '7.4',
        },
      ],
      issueId: 'XRAY-194327',
      references: ['https://www.openwall.com/lists/oss-security/2022/01/24/4'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20623 binutils: Use-after-free in the error function (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20623',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134747',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20623'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-45078 binutils: out-of-bounds write in stab_xcoff_builtin_type() in stabs.c',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-45078',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-192503',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9074 binutils: out-of-bound read in function bfd_getl32 in libbfd.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9074',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134633',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9074'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-9077 binutils: heap-based buffer overflow in function process_mips_specific in readelf.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9077',
          cvssV2: '6.8',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-133662',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9077'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20673 libiberty: Integer overflow in demangle_template() function (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20673',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-132993',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20673'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20671 binutils: Integer overflow in load_specific_debug_section function (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20671',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134749',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20671'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-1000876 binutils: integer overflow leads to heap-based buffer overflow in objdump (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1000876',
          cvssV2: '4.6',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-132665',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1000876'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-35938 rpm: races with chown/chmod/capabilities calls during installation',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-35938',
          cvssV2: '',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-178847',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-35939 rpm: checks for unsafe symlinks are not performed for intermediary directories',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-35939',
          cvssV2: '',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-178849',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-41072 squashfs-tools: possible Directory Traversal via symbolic link',
      severity: 'Medium',
      impactedPackageName: 'squashfs-tools',
      impactedPackageVersion: '0:4.3-20.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-41072',
          cvssV2: '5.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-185759',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'squashfs-tools',
            version: '0:4.3-20.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-40153 squashfs-tools: unvalidated filepaths allow writing outside of destination',
      severity: 'Medium',
      impactedPackageName: 'squashfs-tools',
      impactedPackageVersion: '0:4.3-20.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-40153',
          cvssV2: '5.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-184287',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'squashfs-tools',
            version: '0:4.3-20.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20839 systemd: mishandling of the current keyboard mode check leading to passwords being disclosed in cleartext to attacker (moderate)',
      severity: 'Medium',
      impactedPackageName: 'systemd',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20839',
          cvssV2: '4.3',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-134751',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20839'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20839 systemd: mishandling of the current keyboard mode check leading to passwords being disclosed in cleartext to attacker (moderate)',
      severity: 'Medium',
      impactedPackageName: 'systemd-udev',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20839',
          cvssV2: '4.3',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-134751',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20839'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-udev',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-17543 lz4: heap-based buffer overflow in LZ4_write32 (moderate)',
      severity: 'Medium',
      impactedPackageName: 'lz4-libs',
      impactedPackageVersion: '0:1.8.3-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-17543',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-134601',
      references: ['https://access.redhat.com/security/cve/CVE-2019-17543'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'lz4-libs',
            version: '0:1.8.3-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20839 systemd: mishandling of the current keyboard mode check leading to passwords being disclosed in cleartext to attacker (moderate)',
      severity: 'Medium',
      impactedPackageName: 'systemd-pam',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20839',
          cvssV2: '4.3',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-134751',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20839'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-pam',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2022-0563 util-linux: partial disclosure of arbitrary files in chfn and chsh when compiled with libreadline',
      severity: 'Medium',
      impactedPackageName: 'util-linux',
      impactedPackageVersion: '0:2.32.1-27.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-0563',
          cvssV2: '1.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-198136',
      references: ['https://lore.kernel.org/util-linux/20220214110609.msiwlm457ngoic6w@ws.net.home/T/#u'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'util-linux',
            version: '0:2.32.1-27.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2021-38185 cpio: integer overflow in ds_fgetstr() in dstring.c can lead to an out-of-bounds write via a crafted pattern file',
      severity: 'Medium',
      impactedPackageName: 'cpio',
      impactedPackageVersion: '0:2.12-10.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-38185',
          cvssV2: '6.8',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-182306',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'cpio',
            version: '0:2.12-10.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-1010022 glibc: stack guard protection bypass (moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc-minimal-langpack',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-1010022',
          cvssV2: '7.5',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-133149',
      references: ['https://access.redhat.com/security/cve/CVE-2019-1010022'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc-minimal-langpack',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-1010022 glibc: stack guard protection bypass (moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-1010022',
          cvssV2: '7.5',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-133149',
      references: ['https://access.redhat.com/security/cve/CVE-2019-1010022'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-1010022 glibc: stack guard protection bypass (moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc-common',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-1010022',
          cvssV2: '7.5',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-133149',
      references: ['https://access.redhat.com/security/cve/CVE-2019-1010022'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc-common',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20839 systemd: mishandling of the current keyboard mode check leading to passwords being disclosed in cleartext to attacker (moderate)',
      severity: 'Medium',
      impactedPackageName: 'systemd-libs',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20839',
          cvssV2: '4.3',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-134751',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20839'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-libs',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-35937 rpm: TOCTOU race in checks for unsafe symlinks',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-35937',
          cvssV2: '',
          cvssV3: '6.3',
        },
      ],
      issueId: 'XRAY-178848',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3521 rpm: RPM does not require subkeys to have a valid binding signature',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3521',
          cvssV2: '',
          cvssV3: '4.4',
        },
      ],
      issueId: 'XRAY-185978',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3997 systemd: Uncontrolled recursion in systemd-tmpfiles when removing files',
      severity: 'Medium',
      impactedPackageName: 'systemd',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3997',
          cvssV2: '',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-194149',
      references: ['https://www.openwall.com/lists/oss-security/2022/01/10/2'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3712 openssl: Read buffer overruns processing ASN.1 strings (moderate)',
      severity: 'Medium',
      impactedPackageName: 'openssl-libs',
      impactedPackageVersion: '1:1.1.1g-15.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3712',
          cvssV2: '5.8',
          cvssV3: '7.4',
        },
      ],
      issueId: 'XRAY-183462',
      references: ['https://access.redhat.com/security/cve/CVE-2021-3712'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'openssl-libs',
            version: '1:1.1.1g-15.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-23852 expat: integer overflow in function XML_GetBuffer (moderate)',
      severity: 'Medium',
      impactedPackageName: 'expat',
      impactedPackageVersion: '0:2.2.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-23852',
          cvssV2: '7.5',
          cvssV3: '9.8',
        },
      ],
      issueId: 'XRAY-197541',
      references: ['https://access.redhat.com/security/cve/CVE-2022-23852'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'expat',
            version: '0:2.2.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-25313 expat: stack exhaustion in doctype parsing',
      severity: 'Medium',
      impactedPackageName: 'expat',
      impactedPackageVersion: '0:2.2.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-25313',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-198751',
      references: ['https://blog.hartwork.org/posts/expat-2-4-5-released/'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'expat',
            version: '0:2.2.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-25314 expat: integer overflow in copyString()',
      severity: 'Medium',
      impactedPackageName: 'expat',
      impactedPackageVersion: '0:2.2.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-25314',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-198752',
      references: ['https://blog.hartwork.org/posts/expat-2-4-5-released/'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'expat',
            version: '0:2.2.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2005-2541 tar: does not properly warn the user when extracting setuid or setgid files',
      severity: 'Medium',
      impactedPackageName: 'tar',
      impactedPackageVersion: '2:1.30-5.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2005-2541',
          cvssV2: '10.0',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-178652',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'tar',
            version: '2:1.30-5.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-42694 Developer environment: Homoglyph characters can lead to trojan source attack (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42694',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189600',
      references: ['https://access.redhat.com/security/cve/CVE-2021-42694'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-42694 Developer environment: Homoglyph characters can lead to trojan source attack (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42694',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189600',
      references: ['https://access.redhat.com/security/cve/CVE-2021-42694'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-40528 libgcrypt: ElGamal implementation allows plaintext recovery',
      severity: 'Medium',
      impactedPackageName: 'libgcrypt',
      impactedPackageVersion: '0:1.8.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-40528',
          cvssV2: '2.6',
          cvssV3: '5.9',
        },
      ],
      issueId: 'XRAY-188668',
      references: [
        'https://dev.gnupg.org/rCb118681ebc4c9ea4b9da79b0f9541405a64f4c13\nhttps://eprint.iacr.org/2021/923\nhttps://ibm.github.io/system-security-research-updates/2021/07/20/insecurity-elgamal-pt1\nhttps://ibm.github.io/system-security-research-updates/2021/09/06/insecurity-elgamal-pt2',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcrypt',
            version: '0:1.8.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-12904 Libgcrypt: physical addresses being available to other processes leads to a flush-and-reload side-channel attack (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libgcrypt',
      impactedPackageVersion: '0:1.8.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-12904',
          cvssV2: '4.3',
          cvssV3: '5.9',
        },
      ],
      issueId: 'XRAY-133231',
      references: ['https://access.redhat.com/security/cve/CVE-2019-12904'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcrypt',
            version: '0:1.8.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4384: bind security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'bind-export-libs',
      impactedPackageVersion: '32:9.11.26-3.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[32:9.11.26-6.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-25214',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-189725',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4384',
        'https://access.redhat.com/security/cve/CVE-2021-25214',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'bind-export-libs',
            version: '32:9.11.26-3.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:3582: curl security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'curl',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-18.el8_4.1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22924',
          cvssV2: '4.3',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-22922',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2021-22923',
          cvssV2: '2.6',
          cvssV3: '5.7',
        },
      ],
      issueId: 'XRAY-186306',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:3582',
        'https://access.redhat.com/security/cve/CVE-2021-22922',
        'https://access.redhat.com/security/cve/CVE-2021-22923',
        'https://access.redhat.com/security/cve/CVE-2021-22924',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'curl',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          "A case-insensitive comparison in curl can lead to wrong connection reuse and unspecified impact by an attacker that can control curl's arguments and plant crafted files",
        details:
          'For TLS connections, curl will keep previously used connections in a connection pool for subsequent transfers to reuse, if one of them matches the setup (important command-line arguments or code options, such as the destination server and scheme, and the credentials used to connect to the server)\r\n\r\nThe code responsible to validate if the setup matches (before reusing the connection) is flawed since:\r\n1. Several arguments that contain file paths were matched in a case-insensitive way, even though some filesystems are case-sensitive\r\n2. The "Issuer Certificate" was not considered as part of the matching function\r\n\r\nThe arguments that were matched case-insensitively are:\r\n`issuercert, cafile, carootdir, clientcert, randomfile, randomsock`\r\n\r\nFor example, on a case-sensitive filesystem such as `ext4`, and the following curl command line - `curl --cafile=/tmp/mycert.pem http://www.mydomain.com`.\r\nAn attacker could plant his own certificate under `/tmp/Mycert.pem` and change `cafile=/tmp/Mycert.pem`, and the previous connection to `http://www.mydomain.com` would be reused.\r\n\r\nIt is unclear whether this has any real-world security impact.',
        severity: 'Medium',
        severityReasons: [
          {
            name: "The issue's real-world impact is unspecified and nontrivial to deduce",
            description: 'Unintended reuse of an existing TLS connection',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'An attacker would need to control one of the mentioned command line arguments and plant malicious files',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            isPositive: true,
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Deployment mitigations\n\nWhen using any of the following arguments: `issuercert, cafile, carootdir, clientcert, randomfile, randomsock` Make sure to use paths which are inaccessible to attackers (ex. non-world-writable directories)',
      },
    },
    {
      summary: 'RHSA-2021:4059: curl security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libcurl-minimal',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-18.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22946',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-22947',
          cvssV2: '4.3',
          cvssV3: '6.1',
        },
      ],
      issueId: 'XRAY-189654',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4059',
        'https://access.redhat.com/security/cve/CVE-2021-22946',
        'https://access.redhat.com/security/cve/CVE-2021-22947',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libcurl-minimal',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4374: file security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'file-libs',
      impactedPackageVersion: '0:5.33-16.el8_3.1',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:5.33-20.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-18218',
          cvssV2: '7.5',
          cvssV3: '9.8',
        },
      ],
      issueId: 'XRAY-189722',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4374',
        'https://access.redhat.com/security/cve/CVE-2019-18218',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'file-libs',
            version: '0:5.33-16.el8_3.1',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A heap-based buffer overflow in file leads to remote code execution when processing a malicious binary',
        details:
          'The `file` program is a standard program of Unix and Unix-like operating systems for recognizing the type of data contained in a computer file.\r\n\r\nA heap-based buffer overflow was discovered,  where `cdf_read_property_info` in cdf.c doesn’t restrict the number of `CDF_VECTOR` elements.\r\nAn attacker can trigger a 4-byte heap-based buffer overflow when the victim processes a crafted malicious file with the `file` program. Note that the issue is only exploitable on 32-bit operating systems.\r\n\r\nSince the bug was identified via oss-fuzz, a crashing [PoC is publicly available](https://oss-fuzz.com/download?testcase_id=5743444592427008)',
        severity: 'High',
        severityReasons: [
          {
            name: 'Exploitation of the issue is only possible when the vulnerable component is used in a specific manner. The attacker has to perform per-target research to determine the vulnerable attack vector.',
            description: 'Attacker must determine which remote input will propagate to `file`',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'Published exploit does not demonstrate remote code execution',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/file/file/commit/46a8443f76cec4b41ec736eca396984c74664f84) and build from source .',
      },
    },
    {
      summary: 'RHSA-2021:4059: curl security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'curl',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-18.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22946',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-22947',
          cvssV2: '4.3',
          cvssV3: '6.1',
        },
      ],
      issueId: 'XRAY-189654',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4059',
        'https://access.redhat.com/security/cve/CVE-2021-22946',
        'https://access.redhat.com/security/cve/CVE-2021-22947',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'curl',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4364: binutils security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.30-108.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3487',
          cvssV2: '7.1',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2020-35448',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
        {
          id: 'CVE-2021-20197',
          cvssV2: '3.3',
          cvssV3: '4.2',
        },
        {
          id: 'CVE-2021-20284',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-189719',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4364',
        'https://access.redhat.com/security/cve/CVE-2020-35448',
        'https://access.redhat.com/security/cve/CVE-2021-20197',
        'https://access.redhat.com/security/cve/CVE-2021-20284',
        'https://access.redhat.com/security/cve/CVE-2021-3487',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4382: json-c security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'json-c',
      impactedPackageVersion: '0:0.13.1-0.4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.13.1-2.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-12762',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-189724',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4382',
        'https://access.redhat.com/security/cve/CVE-2020-12762',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'json-c',
            version: '0:0.13.1-0.4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4426: ncurses security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'ncurses-base',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:6.1-9.20180224.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-17594',
          cvssV2: '4.6',
          cvssV3: '5.3',
        },
        {
          id: 'CVE-2019-17595',
          cvssV2: '5.8',
          cvssV3: '5.4',
        },
      ],
      issueId: 'XRAY-189737',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4426',
        'https://access.redhat.com/security/cve/CVE-2019-17594',
        'https://access.redhat.com/security/cve/CVE-2019-17595',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-base',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4517: vim security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'vim-minimal',
      impactedPackageVersion: '2:8.0.1763-15.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[2:8.0.1763-16.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3796',
          cvssV2: '6.8',
          cvssV3: '7.3',
        },
        {
          id: 'CVE-2021-3778',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-189746',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4517',
        'https://access.redhat.com/security/cve/CVE-2021-3778',
        'https://access.redhat.com/security/cve/CVE-2021-3796',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'vim-minimal',
            version: '2:8.0.1763-15.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4595: binutils security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.30-108.el8_5.1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42574',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189758',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4595',
        'https://access.redhat.com/security/cve/CVE-2021-42574',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4451: gnutls and nettle security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'gnutls',
      impactedPackageVersion: '0:3.6.14-7.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.16-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20231',
          cvssV2: '7.5',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-20232',
          cvssV2: '7.5',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-3580',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189739',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4451',
        'https://access.redhat.com/security/cve/CVE-2021-20231',
        'https://access.redhat.com/security/cve/CVE-2021-20232',
        'https://access.redhat.com/security/cve/CVE-2021-3580',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gnutls',
            version: '0:3.6.14-7.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A use-after-free in GnuTLS client can lead to remote code execution when connecting to a malicious TLS server',
        details:
          'A use-after-free in GnuTLS can be triggered when a GnuTLS client that supports TLS 1.3 connects to a malicious TLS server, which can negotiate very large DHE parameters and force a TLS session resumption.\r\nThis culminates in the client sending a very large "Client Hello" packet (in the resumed session) which triggers a `realloc` call and a subsequent dangling pointer. \r\n\r\nThe researcher that disclosed the issue was able to demonstrate the UAF on modified code only and also specified that the CVE is low severity due to the complexity in predicting the memory allocation of both glibc and GnuTLS (which is needed so the attacker can cause a useful/controlled object to be allocated instead of the original object).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'The issue was demonstrated on modified code only',
            isPositive: true,
          },
          {
            name: "The reported CVSS was either wrongly calculated, downgraded by other vendors, or does not reflect the vulnerability's impact",
            description: 'The vendor marked the CVE as low severity',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4060: libsolv security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libsolv',
      impactedPackageVersion: '0:0.7.16-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.7.16-3.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33928',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-33929',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-33930',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-33938',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189655',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4060',
        'https://access.redhat.com/security/cve/CVE-2021-33928',
        'https://access.redhat.com/security/cve/CVE-2021-33929',
        'https://access.redhat.com/security/cve/CVE-2021-33930',
        'https://access.redhat.com/security/cve/CVE-2021-33938',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libsolv',
            version: '0:0.7.16-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4358: glibc security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc-minimal-langpack',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.28-164.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27645',
          cvssV2: '1.9',
          cvssV3: '2.5',
        },
        {
          id: 'CVE-2021-33574',
          cvssV2: '7.5',
          cvssV3: '5.9',
        },
        {
          id: 'CVE-2021-35942',
          cvssV2: '6.4',
          cvssV3: '9.1',
        },
      ],
      issueId: 'XRAY-189717',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4358',
        'https://access.redhat.com/security/cve/CVE-2021-27645',
        'https://access.redhat.com/security/cve/CVE-2021-33574',
        'https://access.redhat.com/security/cve/CVE-2021-35942',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc-minimal-langpack',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A use-after-free in glibc leads to denial of service when calling mq_notify with crafted input',
        details:
          'A use-after-free in glibc related to `mq_notify` can happen under these conditions:\r\n\r\n1. The program call to `mq_notify` needs to be controlled by the attacker (specifically the `sevp` argument)\r\n2. The program must have the race condition where it may potentially\r\ndestroy the notification thread attributes before the notification\r\nthread is created (ex. calling `pthread_attr_destroy` right after `mq_notify` returns)\r\n3. The program must set CPU affinity or signal mask of the\r\nnotification thread to actually cause the use-after-free dereference\r\n\r\nThere are no known applications in distributions that have all these\r\nprerequisites, which should be extremely rare in 1st-party applications as well.\r\n\r\nIn the worst theoretical case that such an application exists, an attacker would not be able to run arbitrary code, but rather be able to control on which CPU the notification thread runs, which should have no noticeable impact on availability (and certainly not on confidentiality or integrity).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'Mq_notify with attacker-controlled arguments, additional thread API calls in a specific order, thread uses custom CPU affinity. See full description for more details',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Technical data leakage or denial of service',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4409: libgcrypt security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libgcrypt',
      impactedPackageVersion: '0:1.8.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:1.8.5-6.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33560',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189734',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4409',
        'https://access.redhat.com/security/cve/CVE-2021-33560',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcrypt',
            version: '0:1.8.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4587: gcc security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.5.0-4.el8_5, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42574',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189752',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4587',
        'https://access.redhat.com/security/cve/CVE-2021-42574',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2574: rpm security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'rpm-libs',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-14.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20271',
          cvssV2: '5.1',
          cvssV3: '6.7',
        },
        {
          id: 'CVE-2021-3421',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-186259',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2574',
        'https://access.redhat.com/security/cve/CVE-2021-20271',
        'https://access.redhat.com/security/cve/CVE-2021-3421',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm-libs',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4513: libsepol security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libsepol',
      impactedPackageVersion: '0:2.9-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.9-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-36084',
          cvssV2: '2.1',
          cvssV3: '3.3',
        },
        {
          id: 'CVE-2021-36085',
          cvssV2: '2.1',
          cvssV3: '3.3',
        },
        {
          id: 'CVE-2021-36086',
          cvssV2: '2.1',
          cvssV3: '3.3',
        },
        {
          id: 'CVE-2021-36087',
          cvssV2: '2.1',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-189745',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4513',
        'https://access.redhat.com/security/cve/CVE-2021-36084',
        'https://access.redhat.com/security/cve/CVE-2021-36085',
        'https://access.redhat.com/security/cve/CVE-2021-36086',
        'https://access.redhat.com/security/cve/CVE-2021-36087',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libsepol',
            version: '0:2.9-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4385: glib2 security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glib2',
      impactedPackageVersion: '0:2.56.4-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.56.4-156.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-28153',
          cvssV2: '5.0',
          cvssV3: '5.3',
        },
        {
          id: 'CVE-2021-3800',
          cvssV2: '',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-189726',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4385',
        'https://access.redhat.com/security/cve/CVE-2021-28153',
        'https://access.redhat.com/security/cve/CVE-2021-3800',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glib2',
            version: '0:2.56.4-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4057: python3 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'platform-python',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.8-39.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3733',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-189652',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4057',
        'https://access.redhat.com/security/cve/CVE-2021-3733',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'platform-python',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2574: rpm security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-14.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20271',
          cvssV2: '5.1',
          cvssV3: '6.7',
        },
        {
          id: 'CVE-2021-3421',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-186259',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2574',
        'https://access.redhat.com/security/cve/CVE-2021-20271',
        'https://access.redhat.com/security/cve/CVE-2021-3421',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4424: openssl security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'openssl-libs',
      impactedPackageVersion: '1:1.1.1g-15.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: ['[1:1.1.1k-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-23840',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-23841',
          cvssV2: '4.3',
          cvssV3: '5.9',
        },
      ],
      issueId: 'XRAY-189736',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4424',
        'https://access.redhat.com/security/cve/CVE-2021-23840',
        'https://access.redhat.com/security/cve/CVE-2021-23841',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'openssl-libs',
            version: '1:1.1.1g-15.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'An integer overflow in OpenSSL leads to unspecified impact when encrypting/decrypting very large user input',
        details:
          "For some cryptographic encryption/decryption schemes, OpenSSL determines the operation's output length by rounding-up (or aligning) the input length value.\r\n\r\nIn cases where the input length is completely user controlled, an attacker can set the input length to INT_MAX (2GB for 32-bit binaries) which will cause the output length to be a small negative number.\r\n\r\nThe impact from this issue depends on what the calling program does with the output length, but will most likely lead to denial of service in the worst case (ex. if the output length is later handled as an unsigned integer).\r\n\r\nNote that in cases where the input length is completely user controlled, it is very likely that the program will crash even before getting to the OpenSSL encryption/decryption operation.",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The impact of exploiting the issue depends on the context of surrounding software. A severe impact such as RCE is not guaranteed.',
            description: 'Denial of service',
            isPositive: true,
          },
          {
            name: "The reported CVSS was either wrongly calculated, downgraded by other vendors, or does not reflect the vulnerability's impact",
            description: "Rated as 'Low' severity in original advisory",
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4596: binutils security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.30-93.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42574',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189664',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4596',
        'https://access.redhat.com/security/cve/CVE-2021-42574',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4451: gnutls and nettle security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'nettle',
      impactedPackageVersion: '0:3.4.1-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.4.1-7.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20231',
          cvssV2: '7.5',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-20232',
          cvssV2: '7.5',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-3580',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189739',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4451',
        'https://access.redhat.com/security/cve/CVE-2021-20231',
        'https://access.redhat.com/security/cve/CVE-2021-20232',
        'https://access.redhat.com/security/cve/CVE-2021-3580',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'nettle',
            version: '0:3.4.1-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A use-after-free in GnuTLS client can lead to remote code execution when connecting to a malicious TLS server',
        details:
          'A use-after-free in GnuTLS can be triggered when a GnuTLS client that supports TLS 1.3 connects to a malicious TLS server, which can negotiate very large DHE parameters and force a TLS session resumption.\r\nThis culminates in the client sending a very large "Client Hello" packet (in the resumed session) which triggers a `realloc` call and a subsequent dangling pointer. \r\n\r\nThe researcher that disclosed the issue was able to demonstrate the UAF on modified code only and also specified that the CVE is low severity due to the complexity in predicting the memory allocation of both glibc and GnuTLS (which is needed so the attacker can cause a useful/controlled object to be allocated instead of the original object).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'The issue was demonstrated on modified code only',
            isPositive: true,
          },
          {
            name: "The reported CVSS was either wrongly calculated, downgraded by other vendors, or does not reflect the vulnerability's impact",
            description: 'The vendor marked the CVE as low severity',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4358: glibc security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.28-164.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27645',
          cvssV2: '1.9',
          cvssV3: '2.5',
        },
        {
          id: 'CVE-2021-33574',
          cvssV2: '7.5',
          cvssV3: '5.9',
        },
        {
          id: 'CVE-2021-35942',
          cvssV2: '6.4',
          cvssV3: '9.1',
        },
      ],
      issueId: 'XRAY-189717',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4358',
        'https://access.redhat.com/security/cve/CVE-2021-27645',
        'https://access.redhat.com/security/cve/CVE-2021-33574',
        'https://access.redhat.com/security/cve/CVE-2021-35942',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A use-after-free in glibc leads to denial of service when calling mq_notify with crafted input',
        details:
          'A use-after-free in glibc related to `mq_notify` can happen under these conditions:\r\n\r\n1. The program call to `mq_notify` needs to be controlled by the attacker (specifically the `sevp` argument)\r\n2. The program must have the race condition where it may potentially\r\ndestroy the notification thread attributes before the notification\r\nthread is created (ex. calling `pthread_attr_destroy` right after `mq_notify` returns)\r\n3. The program must set CPU affinity or signal mask of the\r\nnotification thread to actually cause the use-after-free dereference\r\n\r\nThere are no known applications in distributions that have all these\r\nprerequisites, which should be extremely rare in 1st-party applications as well.\r\n\r\nIn the worst theoretical case that such an application exists, an attacker would not be able to run arbitrary code, but rather be able to control on which CPU the notification thread runs, which should have no noticeable impact on availability (and certainly not on confidentiality or integrity).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'Mq_notify with attacker-controlled arguments, additional thread API calls in a specific order, thread uses custom CPU affinity. See full description for more details',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Technical data leakage or denial of service',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4396: sqlite security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'sqlite-libs',
      impactedPackageVersion: '0:3.26.0-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.26.0-15.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-5827',
          cvssV2: '6.8',
          cvssV3: '8.8',
        },
        {
          id: 'CVE-2020-13435',
          cvssV2: '2.1',
          cvssV3: '5.5',
        },
        {
          id: 'CVE-2019-13750',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2019-13751',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2019-19603',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189730',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4396',
        'https://access.redhat.com/security/cve/CVE-2019-13750',
        'https://access.redhat.com/security/cve/CVE-2019-13751',
        'https://access.redhat.com/security/cve/CVE-2019-19603',
        'https://access.redhat.com/security/cve/CVE-2019-5827',
        'https://access.redhat.com/security/cve/CVE-2020-13435',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'sqlite-libs',
            version: '0:3.26.0-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-hawkey',
      impactedPackageVersion: '0:0.55.0-7.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.63.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-hawkey',
            version: '0:0.55.0-7.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libdnf',
      impactedPackageVersion: '0:0.55.0-7.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.63.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libdnf',
            version: '0:0.55.0-7.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4057: python3 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-libs',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.8-39.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3733',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-189652',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4057',
        'https://access.redhat.com/security/cve/CVE-2021-3733',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libs',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-dnf',
      impactedPackageVersion: '0:4.4.2-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.7.0-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-dnf',
            version: '0:4.4.2-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'dnf-data',
      impactedPackageVersion: '0:4.4.2-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.7.0-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dnf-data',
            version: '0:4.4.2-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4587: gcc security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.5.0-4.el8_5, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42574',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189752',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4587',
        'https://access.redhat.com/security/cve/CVE-2021-42574',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4358: glibc security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc-common',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.28-164.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27645',
          cvssV2: '1.9',
          cvssV3: '2.5',
        },
        {
          id: 'CVE-2021-33574',
          cvssV2: '7.5',
          cvssV3: '5.9',
        },
        {
          id: 'CVE-2021-35942',
          cvssV2: '6.4',
          cvssV3: '9.1',
        },
      ],
      issueId: 'XRAY-189717',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4358',
        'https://access.redhat.com/security/cve/CVE-2021-27645',
        'https://access.redhat.com/security/cve/CVE-2021-33574',
        'https://access.redhat.com/security/cve/CVE-2021-35942',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc-common',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A use-after-free in glibc leads to denial of service when calling mq_notify with crafted input',
        details:
          'A use-after-free in glibc related to `mq_notify` can happen under these conditions:\r\n\r\n1. The program call to `mq_notify` needs to be controlled by the attacker (specifically the `sevp` argument)\r\n2. The program must have the race condition where it may potentially\r\ndestroy the notification thread attributes before the notification\r\nthread is created (ex. calling `pthread_attr_destroy` right after `mq_notify` returns)\r\n3. The program must set CPU affinity or signal mask of the\r\nnotification thread to actually cause the use-after-free dereference\r\n\r\nThere are no known applications in distributions that have all these\r\nprerequisites, which should be extremely rare in 1st-party applications as well.\r\n\r\nIn the worst theoretical case that such an application exists, an attacker would not be able to run arbitrary code, but rather be able to control on which CPU the notification thread runs, which should have no noticeable impact on availability (and certainly not on confidentiality or integrity).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'Mq_notify with attacker-controlled arguments, additional thread API calls in a specific order, thread uses custom CPU affinity. See full description for more details',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Technical data leakage or denial of service',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:2569: libxml2 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libxml2',
      impactedPackageVersion: '0:2.9.7-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.9.7-9.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3516',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
        {
          id: 'CVE-2021-3517',
          cvssV2: '7.5',
          cvssV3: '8.6',
        },
        {
          id: 'CVE-2021-3518',
          cvssV2: '6.8',
          cvssV3: '8.6',
        },
        {
          id: 'CVE-2021-3537',
          cvssV2: '4.3',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-3541',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-186257',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2569',
        'https://access.redhat.com/security/cve/CVE-2021-3516',
        'https://access.redhat.com/security/cve/CVE-2021-3517',
        'https://access.redhat.com/security/cve/CVE-2021-3518',
        'https://access.redhat.com/security/cve/CVE-2021-3537',
        'https://access.redhat.com/security/cve/CVE-2021-3541',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libxml2',
            version: '0:2.9.7-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A use-after-free in libxml2 leads to remote code execution when parsing a malicious XML file with xmllint',
        details:
          '[Libxml2](http://xmlsoft.org/) is an XML parser written in C, which is a part of the [Gnome](https://www.gnome.org/) project and is used by other software such as Google Chrome.\r\n\r\nA use-after-free flaw exists in the `xmllint` development tool, that can lead to dangling pointers in some entity reference nodes.\r\n\r\nAttackers can trigger the exploit by having a specially crafted XML file parsed by the `xmllint` development tool, when it is running with the `--dropdtd` and the `--xinclude` flags.\r\nNote that the flaw has not been proven to be exploitable by regular parsing (ex. the `xmlReadFile` API) since the functionality of the `--dropdtd` flag cannot be replicated by API options to `xmlReadFile`, making the vulnerable configuration extremely unlikely in any production environment.\r\n\r\n A public [proof of concept](https://gitlab.gnome.org/GNOME/libxml2/-/issues/237) exploit exists which demonstrates denial of service, but remote execution has not been demonstrated publicly.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'Attacker-supplied XML file being parsed by `xmllint` with the `--dropdtd` and `--xinclude` flags',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'An (RCE) exploit or technical writeup were not published',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4511: curl security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'curl',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-22.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22876',
          cvssV2: '5.0',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-22898',
          cvssV2: '2.6',
          cvssV3: '3.1',
        },
        {
          id: 'CVE-2021-22925',
          cvssV2: '5.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189744',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4511',
        'https://access.redhat.com/security/cve/CVE-2021-22876',
        'https://access.redhat.com/security/cve/CVE-2021-22898',
        'https://access.redhat.com/security/cve/CVE-2021-22925',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'curl',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'Uninitialized data in curl can lead to data leakage by an attacker that controls the telnet options',
        details:
          "curl supports connecting to telnet servers via the `telnet://` scheme. When connecting to telnet servers, the user can specify a list of `key=value` options via the `-t`/`--telnet-option` argument in CLI, or `CURLOPT_TELNETOPTIONS` in code.\r\n\r\nIf an attacker can control the data passed to this (`-t` etc.) option and insert a `NEW_ENV` key with a long value, curl will pass uninitialized stack data to the server. Since telnet is a cleartext network protocol, the attacker would be able to sniff the leaked data, even if the victim curl client is not connecting to the attacker's server.\r\n\r\nNote that this issue may also be exploited in the context of a parameter injection attack (in that case, the attacker would inject the `-t` argument with the crafted values)\r\n\r\nThis issue was caused due to an incomplete fix of [CVE-2021-22898](https://curl.se/docs/CVE-2021-22898.html)",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'The `-t` option is exceedingly rare, and is almost never controlled by an attacker',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Leakage of technical data',
            isPositive: true,
          },
        ],
        remediation: '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.',
      },
    },
    {
      summary: 'RHSA-2021:2575: lz4 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'lz4-libs',
      impactedPackageVersion: '0:1.8.3-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:1.8.3-3.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3520',
          cvssV2: '7.5',
          cvssV3: '8.6',
        },
      ],
      issueId: 'XRAY-186260',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2575',
        'https://access.redhat.com/security/cve/CVE-2021-3520',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'lz4-libs',
            version: '0:1.8.3-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'dnf',
      impactedPackageVersion: '0:4.4.2-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.7.0-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dnf',
            version: '0:4.4.2-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:3576: krb5 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'krb5-libs',
      impactedPackageVersion: '0:1.18.2-8.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:1.18.2-8.3.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-37750',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2021-36222',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-185299',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:3576',
        'https://access.redhat.com/security/cve/CVE-2021-36222',
        'https://access.redhat.com/security/cve/CVE-2021-37750',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'krb5-libs',
            version: '0:1.18.2-8.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4426: ncurses security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'ncurses-libs',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:6.1-9.20180224.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-17594',
          cvssV2: '4.6',
          cvssV3: '5.3',
        },
        {
          id: 'CVE-2019-17595',
          cvssV2: '5.8',
          cvssV3: '5.4',
        },
      ],
      issueId: 'XRAY-189737',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4426',
        'https://access.redhat.com/security/cve/CVE-2019-17594',
        'https://access.redhat.com/security/cve/CVE-2019-17595',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-libs',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4399: python3 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-libs',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.8-41.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3426',
          cvssV2: '2.7',
          cvssV3: '5.7',
        },
      ],
      issueId: 'XRAY-189731',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4399',
        'https://access.redhat.com/security/cve/CVE-2021-3426',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libs',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4511: curl security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libcurl-minimal',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-22.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22876',
          cvssV2: '5.0',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-22898',
          cvssV2: '2.6',
          cvssV3: '3.1',
        },
        {
          id: 'CVE-2021-22925',
          cvssV2: '5.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189744',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4511',
        'https://access.redhat.com/security/cve/CVE-2021-22876',
        'https://access.redhat.com/security/cve/CVE-2021-22898',
        'https://access.redhat.com/security/cve/CVE-2021-22925',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libcurl-minimal',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'Uninitialized data in curl can lead to data leakage by an attacker that controls the telnet options',
        details:
          "curl supports connecting to telnet servers via the `telnet://` scheme. When connecting to telnet servers, the user can specify a list of `key=value` options via the `-t`/`--telnet-option` argument in CLI, or `CURLOPT_TELNETOPTIONS` in code.\r\n\r\nIf an attacker can control the data passed to this (`-t` etc.) option and insert a `NEW_ENV` key with a long value, curl will pass uninitialized stack data to the server. Since telnet is a cleartext network protocol, the attacker would be able to sniff the leaked data, even if the victim curl client is not connecting to the attacker's server.\r\n\r\nNote that this issue may also be exploited in the context of a parameter injection attack (in that case, the attacker would inject the `-t` argument with the crafted values)\r\n\r\nThis issue was caused due to an incomplete fix of [CVE-2021-22898](https://curl.se/docs/CVE-2021-22898.html)",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'The `-t` option is exceedingly rare, and is almost never controlled by an attacker',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Leakage of technical data',
            isPositive: true,
          },
        ],
        remediation: '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.',
      },
    },
    {
      summary: 'RHSA-2021:4399: python3 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'platform-python',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.8-41.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3426',
          cvssV2: '2.7',
          cvssV3: '5.7',
        },
      ],
      issueId: 'XRAY-189731',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4399',
        'https://access.redhat.com/security/cve/CVE-2021-3426',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'platform-python',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:3582: curl security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libcurl-minimal',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-18.el8_4.1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22924',
          cvssV2: '4.3',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-22922',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2021-22923',
          cvssV2: '2.6',
          cvssV3: '5.7',
        },
      ],
      issueId: 'XRAY-186306',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:3582',
        'https://access.redhat.com/security/cve/CVE-2021-22922',
        'https://access.redhat.com/security/cve/CVE-2021-22923',
        'https://access.redhat.com/security/cve/CVE-2021-22924',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libcurl-minimal',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          "A case-insensitive comparison in curl can lead to wrong connection reuse and unspecified impact by an attacker that can control curl's arguments and plant crafted files",
        details:
          'For TLS connections, curl will keep previously used connections in a connection pool for subsequent transfers to reuse, if one of them matches the setup (important command-line arguments or code options, such as the destination server and scheme, and the credentials used to connect to the server)\r\n\r\nThe code responsible to validate if the setup matches (before reusing the connection) is flawed since:\r\n1. Several arguments that contain file paths were matched in a case-insensitive way, even though some filesystems are case-sensitive\r\n2. The "Issuer Certificate" was not considered as part of the matching function\r\n\r\nThe arguments that were matched case-insensitively are:\r\n`issuercert, cafile, carootdir, clientcert, randomfile, randomsock`\r\n\r\nFor example, on a case-sensitive filesystem such as `ext4`, and the following curl command line - `curl --cafile=/tmp/mycert.pem http://www.mydomain.com`.\r\nAn attacker could plant his own certificate under `/tmp/Mycert.pem` and change `cafile=/tmp/Mycert.pem`, and the previous connection to `http://www.mydomain.com` would be reused.\r\n\r\nIt is unclear whether this has any real-world security impact.',
        severity: 'Medium',
        severityReasons: [
          {
            name: "The issue's real-world impact is unspecified and nontrivial to deduce",
            description: 'Unintended reuse of an existing TLS connection',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'An attacker would need to control one of the mentioned command line arguments and plant malicious files',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            isPositive: true,
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Deployment mitigations\n\nWhen using any of the following arguments: `issuercert, cafile, carootdir, clientcert, randomfile, randomsock` Make sure to use paths which are inaccessible to attackers (ex. non-world-writable directories)',
      },
    },
    {
      summary: 'RHSA-2021:3058: glib2 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glib2',
      impactedPackageVersion: '0:2.56.4-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.56.4-10.el8_4.1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27218',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-186278',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:3058',
        'https://access.redhat.com/security/cve/CVE-2021-27218',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glib2',
            version: '0:2.56.4-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2574: rpm security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-14.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20271',
          cvssV2: '5.1',
          cvssV3: '6.7',
        },
        {
          id: 'CVE-2021-3421',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-186259',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2574',
        'https://access.redhat.com/security/cve/CVE-2021-20271',
        'https://access.redhat.com/security/cve/CVE-2021-3421',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-libdnf',
      impactedPackageVersion: '0:0.55.0-7.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.63.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libdnf',
            version: '0:0.55.0-7.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2574: rpm security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'rpm-build-libs',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-14.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20271',
          cvssV2: '5.1',
          cvssV3: '6.7',
        },
        {
          id: 'CVE-2021-3421',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-186259',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2574',
        'https://access.redhat.com/security/cve/CVE-2021-20271',
        'https://access.redhat.com/security/cve/CVE-2021-3421',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm-build-libs',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'yum',
      impactedPackageVersion: '0:4.4.2-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.7.0-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'yum',
            version: '0:4.4.2-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9674 python: Nested zip file (Zip bomb) vulnerability in Lib/zipfile.py (low)',
      severity: 'Low',
      impactedPackageName: 'python3-libs',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9674',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-133681',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9674'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libs',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-18309 binutils: invalid memory address dereference in read_reloc in reloc.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18309',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134736',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18309'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20651 binutils: NULL pointer dereference in elf_link_add_object_symbols function resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20651',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134748',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20651'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-18484 binutils: Stack exhaustion in cp-demangle.c allows for denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18484',
          cvssV2: '4.3',
          cvssV3: '4.3',
        },
      ],
      issueId: 'XRAY-132901',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18484'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-18701 binutils: infinite recursion in next_is_type_qual and cplus_demangle_type functions in cp-demangle.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18701',
          cvssV2: '4.3',
          cvssV3: '4.3',
        },
      ],
      issueId: 'XRAY-132914',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18701'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-6872 binutils: out of bounds read in elf_parse_notes function in elf.c file in libbfd library (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-6872',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133077',
      references: ['https://access.redhat.com/security/cve/CVE-2018-6872'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-18606 binutils: NULL pointer dereference in _bfd_add_merge_section in merge_strings function in merge.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18606',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132909',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18606'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-17794 binutils: NULL pointer dereference in libiberty/cplus-dem.c:work_stuff_copy_to_from() via crafted input (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-17794',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132882',
      references: ['https://access.redhat.com/security/cve/CVE-2018-17794'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35493 binutils: heap-based buffer overflow in bfd_pef_parse_function_stubs function in bfd/pef.c via crafted PEF file (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35493',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-137599',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35493'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12641 binutils: Stack Exhaustion in the demangling functions provided by libiberty (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12641',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132752',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12641'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-18605 binutils: heap-based buffer over-read in sec_merge_hash_lookup in merge.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18605',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132908',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18605'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9071 binutils: stack consumption in function d_count_templates_scopes in cp-demangle.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9071',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134831',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9071'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2020-35495 binutils: NULL pointer dereference in bfd_pef_parse_symbols function in bfd/pef.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35495',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-137601',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35495'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12697 binutils: NULL pointer dereference in work_stuff_copy_to_from in cplus-dem.c. (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12697',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132753',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12697'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12700 binutils: Stack Exhaustion in debug_write_type in debug.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12700',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132756',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12700'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-18700 binutils: Recursive Stack Overflow within function d_name, d_encoding, and d_local_name in cp-demangle.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18700',
          cvssV2: '4.3',
          cvssV3: '4.3',
        },
      ],
      issueId: 'XRAY-132913',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18700'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-19932 binutils: Integer overflow due to the IS_CONTAINED_BY_LMA macro resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19932',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132961',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19932'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12934 binutils: Uncontrolled Resource Consumption in remember_Ktype in cplus-dem.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12934',
          cvssV2: '5.0',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-132759',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12934'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12698 binutils: excessive memory consumption in demangle_template in cplus-dem.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12698',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132754',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12698'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-12972 binutils: out-of-bounds read in setup_group in bfd/elf.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-12972',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-133232',
      references: ['https://access.redhat.com/security/cve/CVE-2019-12972'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35496 binutils: NULL pointer dereference in bfd_pef_scan_start_address function in bfd/pef.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35496',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-137616',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35496'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35507 binutils: NULL pointer dereference in bfd_pef_parse_function_stubs function in bfd/pef.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35507',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-137617',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35507'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-18483 binutils: Integer overflow in cplus-dem.c:get_count() allows for denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18483',
          cvssV2: '6.8',
          cvssV3: '4.3',
        },
      ],
      issueId: 'XRAY-132900',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18483'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20657 libiberty: Memory leak in demangle_template function resulting in a denial of service',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20657',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-109612',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-17360 binutils: heap-based buffer over-read in bfd_getl32 in libbfd.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-17360',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132879',
      references: ['https://access.redhat.com/security/cve/CVE-2018-17360'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-17985 binutils: Stack consumption problem caused by the cplus_demangle_type (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-17985',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132889',
      references: ['https://access.redhat.com/security/cve/CVE-2018-17985'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-18607 binutils: NULL pointer dereference in elf_link_input_bfd in elflink.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18607',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132910',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18607'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20002 binutils: memory leak in _bfd_generic_read_minisymbols function in syms.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20002',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132963',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20002'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2020-16598 binutils: Null Pointer Dereference in debug_get_real_type could result in DoS (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-16598',
          cvssV2: '',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-133944',
      references: ['https://access.redhat.com/security/cve/CVE-2020-16598'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4489: rpm security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'python3-rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-19.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20266',
          cvssV2: '4.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189742',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4489',
        'https://access.redhat.com/security/cve/CVE-2021-20266',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4489: rpm security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'rpm-build-libs',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-19.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20266',
          cvssV2: '4.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189742',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4489',
        'https://access.redhat.com/security/cve/CVE-2021-20266',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm-build-libs',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12699 binutils: heap-based buffer overflow in finish_stab in stabs.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12699',
          cvssV2: '7.5',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132755',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12699'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-20193 tar: Memory leak in read_header() in list.c (low)',
      severity: 'Low',
      impactedPackageName: 'tar',
      impactedPackageVersion: '2:1.30-5.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20193',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-138665',
      references: ['https://access.redhat.com/security/cve/CVE-2021-20193'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'tar',
            version: '2:1.30-5.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4489: rpm security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'rpm-libs',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-19.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20266',
          cvssV2: '4.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189742',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4489',
        'https://access.redhat.com/security/cve/CVE-2021-20266',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm-libs',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35494 binutils: usage of unitialized heap in tic4x_print_cond function in opcodes/tic4x-dis.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35494',
          cvssV2: '5.8',
          cvssV3: '6.1',
        },
      ],
      issueId: 'XRAY-137600',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35494'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-19217 ncurses: Null pointer dereference at function _nc_name_match (low)',
      severity: 'Low',
      impactedPackageName: 'ncurses-libs',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19217',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132932',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19217'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-libs',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A NULL pointer dereference in ncurses may lead to a denial of service',
        details:
          '[ncurses](https://en.wikipedia.org/wiki/Ncurses) (new curses) is a programming library providing an application programming interface (API) that allows the programmer to write text-based user interfaces in a terminal-independent manner.\r\n\r\nIn ncurses, possibly a 6.x version, there is a NULL pointer dereference at the function _nc_name_match that will lead to a denial of service attack.',
        severity: 'Low',
        severityReasons: [
          {
            name: 'The issue has been disputed by the vendor',
            description: 'This vulnerability did not reproduce and was disputed',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'CVE-2018-19217 ncurses: Null pointer dereference at function _nc_name_match (low)',
      severity: 'Low',
      impactedPackageName: 'ncurses-base',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19217',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132932',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19217'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-base',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A NULL pointer dereference in ncurses may lead to a denial of service',
        details:
          '[ncurses](https://en.wikipedia.org/wiki/Ncurses) (new curses) is a programming library providing an application programming interface (API) that allows the programmer to write text-based user interfaces in a terminal-independent manner.\r\n\r\nIn ncurses, possibly a 6.x version, there is a NULL pointer dereference at the function _nc_name_match that will lead to a denial of service attack.',
        severity: 'Low',
        severityReasons: [
          {
            name: 'The issue has been disputed by the vendor',
            description: 'This vulnerability did not reproduce and was disputed',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'CVE-2018-19211 ncurses: Null pointer dereference at function _nc_parse_entry in parse_entry.c (low)',
      severity: 'Low',
      impactedPackageName: 'ncurses-libs',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19211',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132928',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19211'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-libs',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-43618 gmp: Integer overflow and resultant buffer overflow via crafted input (low)',
      severity: 'Low',
      impactedPackageName: 'gmp',
      impactedPackageVersion: '1:6.1.2-10.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-43618',
          cvssV2: '5.0',
          cvssV3: '4.0',
        },
      ],
      issueId: 'XRAY-191006',
      references: ['https://access.redhat.com/security/cve/CVE-2021-43618'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gmp',
            version: '1:6.1.2-10.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-19211 ncurses: Null pointer dereference at function _nc_parse_entry in parse_entry.c (low)',
      severity: 'Low',
      impactedPackageName: 'ncurses-base',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19211',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132928',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19211'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-base',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4489: rpm security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-19.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20266',
          cvssV2: '4.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189742',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4489',
        'https://access.redhat.com/security/cve/CVE-2021-20266',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4408: libsolv security and bug fix update (Low)',
      severity: 'Low',
      impactedPackageName: 'libsolv',
      impactedPackageVersion: '0:0.7.16-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.7.19-1.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3200',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-189733',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4408',
        'https://access.redhat.com/security/cve/CVE-2021-3200',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libsolv',
            version: '0:0.7.16-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-44568 libsolv: heap-overflows in resolve_dependencies function',
      severity: 'Low',
      impactedPackageName: 'libsolv',
      impactedPackageVersion: '0:0.7.16-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-44568',
          cvssV2: '4.3',
          cvssV3: '6.3',
        },
      ],
      issueId: 'XRAY-199742',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libsolv',
            version: '0:0.7.16-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus-common',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus-common',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20657 libiberty: Memory leak in demangle_template function resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20657',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132991',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20657'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-16428 glib2: NULL pointer dereference in g_markup_parse_context_end_parse() function in gmarkup.c (low)',
      severity: 'Low',
      impactedPackageName: 'glib2',
      impactedPackageVersion: '0:2.56.4-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-16428',
          cvssV2: '7.5',
          cvssV3: '9.8',
        },
      ],
      issueId: 'XRAY-132844',
      references: ['https://access.redhat.com/security/cve/CVE-2018-16428'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glib2',
            version: '0:2.56.4-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20657 libiberty: Memory leak in demangle_template function resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20657',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132991',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20657'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20657 libiberty: Memory leak in demangle_template function resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20657',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132991',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20657'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-1000879 libarchive: NULL pointer dereference in ACL parser resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1000879',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134704',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1000879'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9674 python: Nested zip file (Zip bomb) vulnerability in Lib/zipfile.py (low)',
      severity: 'Low',
      impactedPackageName: 'platform-python',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9674',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-133681',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9674'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'platform-python',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2017-14501 libarchive: Out-of-bounds read in parse_file_info (low)',
      severity: 'Low',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2017-14501',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-131951',
      references: ['https://access.redhat.com/security/cve/CVE-2017-14501'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-14250 binutils: integer overflow in simple-object-elf.c leads to a heap-based buffer overflow (low)',
      severity: 'Low',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-14250',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133283',
      references: ['https://access.redhat.com/security/cve/CVE-2019-14250'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-1000880 libarchive: Improper input validation in WARC parser resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1000880',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134705',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1000880'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2017-14166 libarchive: Heap-based buffer over-read in the atol8 function (low)',
      severity: 'Low',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2017-14166',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-131928',
      references: ['https://access.redhat.com/security/cve/CVE-2017-14166'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-14250 binutils: integer overflow in simple-object-elf.c leads to a heap-based buffer overflow (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-14250',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133283',
      references: ['https://access.redhat.com/security/cve/CVE-2019-14250'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-19244 sqlite: allows a crash if a sub-select uses both DISTINCT and window functions and also has certain ORDER BY usage (low)',
      severity: 'Low',
      impactedPackageName: 'sqlite-libs',
      impactedPackageVersion: '0:3.26.0-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-19244',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-133415',
      references: ['https://access.redhat.com/security/cve/CVE-2019-19244'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'sqlite-libs',
            version: '0:3.26.0-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9936 sqlite: heap-based buffer over-read in function fts5HashEntrySort in sqlite3.c (low)',
      severity: 'Low',
      impactedPackageName: 'sqlite-libs',
      impactedPackageVersion: '0:3.26.0-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9936',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134833',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9936'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'sqlite-libs',
            version: '0:3.26.0-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'An out-of-bounds heap read in SQLite may lead to denial of service when executing arbitrary SQL queries',
        details:
          'SQLite is vulnerable to a heap OOB read when using a long search argument on an `FTS5` (Full Text Search) virtual table.\r\nA [public exploit](https://www.mail-archive.com/sqlite-users@mailinglists.sqlite.org/msg114382.html) exists that demonstrates the crash.\r\nThis issue affects SQLite versions that have been compiled with the `FTS5` extension only.\r\n\r\nNote that the over-read information is not printed back to the user, hence data leakage is unlikely.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Denial of service on non-server process',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'Attacker needs to perform arbitrary SQL queries',
            isPositive: true,
          },
          {
            name: 'The issue has an exploit published',
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'CVE-2019-9937 sqlite: null-pointer dereference in function fts5ChunkIterate in sqlite3.c (low)',
      severity: 'Low',
      impactedPackageName: 'sqlite-libs',
      impactedPackageVersion: '0:3.26.0-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9937',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134834',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9937'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'sqlite-libs',
            version: '0:3.26.0-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A NULL pointer dereference in SQLite may lead to denial of service when executing arbitrary SQL queries',
        details:
          'SQLite is vulnerable to a NULL pointer dereference vulnerability when performing a read and write in the same transaction, on an `FTS5` (Full Text Search) virtual table.\r\nA [public exploit](https://www.mail-archive.com/sqlite-users@mailinglists.sqlite.org/msg114383.html) exists that demonstrates the crash.\r\nThis issue affects SQLite versions that have been compiled with the `FTS5` extension only.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Denial of service on non-server process',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'Attacker needs to perform arbitrary SQL queries',
            isPositive: true,
          },
          {
            name: 'The issue has an exploit published',
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'CVE-2018-1121 procps-ng, procps: process hiding through race condition enumerating /proc (low)',
      severity: 'Low',
      impactedPackageName: 'procps-ng',
      impactedPackageVersion: '0:3.3.15-6.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1121',
          cvssV2: '4.3',
          cvssV3: '3.9',
        },
      ],
      issueId: 'XRAY-132720',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1121'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'procps-ng',
            version: '0:3.3.15-6.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-4209 GnuTLS: Null pointer dereference in MD_UPDATE',
      severity: 'Low',
      impactedPackageName: 'gnutls',
      impactedPackageVersion: '0:3.6.14-7.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-4209',
          cvssV2: '',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-198315',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gnutls',
            version: '0:3.6.14-7.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20225 python-pip: when --extra-index-url option is used and package does not already exist in the public index, the installation of malicious package with arbitrary version number is possible. (low)',
      severity: 'Low',
      impactedPackageName: 'python3-pip-wheel',
      impactedPackageVersion: '0:9.0.3-19.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20225',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-134539',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20225'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-pip-wheel',
            version: '0:9.0.3-19.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'pip could download private packages from a public PyPI repository leading to code execution',
        details:
          "This vulnerability has been disputed by the maintainers of pip as the described behavior, while potentially insecure, is the intended one. If pip is executed with the `--extra-index-url` when using a private PyPI repository, an attacker could cause pip to download a private package (for example one named `private_package`) by adding a package with the same name (`private_package`) in the public PyPI repository. This would lead to remote code execution as pip will download the public package that could contain malicious code. This is similar to the [dependency confusion attack from 2021 by Alex Birsan](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610). However, this isn't considered a vulnerability in itself in pip, and there is no plan to patch or change it.",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue has been disputed by the vendor',
            description:
              'Pip maintainers, and others such as [RHEL](https://access.redhat.com/security/cve/cve-2018-20225) do not consider this a vulnerability as it is the intended behaviour',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Marked as unimportant by the Debian tracker',
            isPositive: true,
          },
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
        ],
        remediation:
          '##### Deployment mitigations\n\nDo not use the `--extra-index-url` flag with pip and consider using version pinning for deployments.',
      },
    },
    {
      summary: 'RHSA-2021:4455: python-pip security update (Low)',
      severity: 'Low',
      impactedPackageName: 'python3-pip-wheel',
      impactedPackageVersion: '0:9.0.3-19.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:9.0.3-20.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3572',
          cvssV2: '3.5',
          cvssV3: '4.5',
        },
      ],
      issueId: 'XRAY-189740',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4455',
        'https://access.redhat.com/security/cve/CVE-2021-3572',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-pip-wheel',
            version: '0:9.0.3-19.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-14250 binutils: integer overflow in simple-object-elf.c leads to a heap-based buffer overflow (low)',
      severity: 'Low',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-14250',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133283',
      references: ['https://access.redhat.com/security/cve/CVE-2019-14250'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4386: gcc security and bug fix update (Low)',
      severity: 'Low',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.5.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20673',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-189727',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4386',
        'https://access.redhat.com/security/cve/CVE-2018-20673',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-1000654 libtasn1: Infinite loop in _asn1_expand_object_id(ptree) leads to memory exhaustion (low)',
      severity: 'Low',
      impactedPackageName: 'libtasn1',
      impactedPackageVersion: '0:4.13-3.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1000654',
          cvssV2: '7.1',
          cvssV3: '4.0',
        },
      ],
      issueId: 'XRAY-132660',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1000654'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libtasn1',
            version: '0:4.13-3.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4386: gcc security and bug fix update (Low)',
      severity: 'Low',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.5.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20673',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-189727',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4386',
        'https://access.redhat.com/security/cve/CVE-2018-20673',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4373: pcre security update (Low)',
      severity: 'Low',
      impactedPackageName: 'pcre',
      impactedPackageVersion: '0:8.42-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.42-6.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-20838',
          cvssV2: '4.3',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2020-14155',
          cvssV2: '5.0',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-189721',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4373',
        'https://access.redhat.com/security/cve/CVE-2019-20838',
        'https://access.redhat.com/security/cve/CVE-2020-14155',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'pcre',
            version: '0:8.42-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'An out-of-bounds read in libpcre may cause denial of service',
        details:
          'The [PCRE library](https://www.pcre.org/) is a set of functions that implement regular expression pattern matching using the same syntax and semantics as Perl 5\r\n\r\nlibpcre in PCRE before 8.43 allows a subject buffer over-read in JIT when UTF is disabled, and \\X or \\R has more than 1 fixed quantifier.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'Exploitation of the issue is only possible when the vulnerable component is used in a specific manner. The attacker has to perform per-target research to determine the vulnerable attack vector.',
            description:
              "An attacker must find remote input that propagates into one of PCRE's functions that compile a regular expression. In other words, the attacker must be able to compile an arbitrary regular expression remotely.",
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'It is highly unlikely that an attacker can remotely control a regular expression pattern',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Denial of service and unlikely leak of sensitive data',
            isPositive: true,
          },
          {
            name: "The reported CVSS was either wrongly calculated, downgraded by other vendors, or does not reflect the vulnerability's impact",
            description: 'Marked as unimportant by the Debian tracker',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4404: kexec-tools security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'kexec-tools',
      impactedPackageVersion: '0:2.0.20-46.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.0.20-57.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20269',
          cvssV2: '2.1',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-189732',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4404',
        'https://access.redhat.com/security/cve/CVE-2021-20269',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'kexec-tools',
            version: '0:2.0.20-46.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-8906 file: out-of-bounds read in do_core_note in readelf.c (low)',
      severity: 'Low',
      impactedPackageName: 'file-libs',
      impactedPackageVersion: '0:5.33-16.el8_3.1',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-8906',
          cvssV2: '3.6',
          cvssV3: '5.4',
        },
      ],
      issueId: 'XRAY-134829',
      references: ['https://access.redhat.com/security/cve/CVE-2019-8906'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'file-libs',
            version: '0:5.33-16.el8_3.1',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-8905 file: stack-based buffer over-read in do_core_note in readelf.c (low)',
      severity: 'Low',
      impactedPackageName: 'file-libs',
      impactedPackageVersion: '0:5.33-16.el8_3.1',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-8905',
          cvssV2: '3.6',
          cvssV3: '5.4',
        },
      ],
      issueId: 'XRAY-134828',
      references: ['https://access.redhat.com/security/cve/CVE-2019-8905'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'file-libs',
            version: '0:5.33-16.el8_3.1',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20786 libvterm: NULL pointer dereference in vterm_screen_set_callbacks (low)',
      severity: 'Low',
      impactedPackageName: 'vim-minimal',
      impactedPackageVersion: '2:8.0.1763-15.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20786',
          cvssV2: '5.0',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134750',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20786'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'vim-minimal',
            version: '2:8.0.1763-15.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3974 vim: Use after free in regexp_nfa.c (low)',
      severity: 'Low',
      impactedPackageName: 'vim-minimal',
      impactedPackageVersion: '2:8.0.1763-15.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3974',
          cvssV2: '6.8',
          cvssV3: '2.9',
        },
      ],
      issueId: 'XRAY-190535',
      references: ['https://access.redhat.com/security/cve/CVE-2021-3974'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'vim-minimal',
            version: '2:8.0.1763-15.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus-tools',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus-tools',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus-libs',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus-libs',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-12900 bzip2: out-of-bounds write in function BZ2_decompress (low)',
      severity: 'Low',
      impactedPackageName: 'bzip2-libs',
      impactedPackageVersion: '0:1.0.6-26.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-12900',
          cvssV2: '7.5',
          cvssV3: '4.0',
        },
      ],
      issueId: 'XRAY-133230',
      references: ['https://access.redhat.com/security/cve/CVE-2019-12900'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'bzip2-libs',
            version: '0:1.0.6-26.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'An heap out-of-bounds write in bzip2 may lead to remote code execution when decompressing a malicious archive',
        details:
          'Lack of input validation in the `bzip2` decompressor code will lead to an OOB heap write, when accessing the `selectorMtf` array with an unbounded index.\r\nAn attacker can exploit this issue by decompressing a bzip2 archive that contains many selectors (see [Bzip2 file format](https://en.wikipedia.org/wiki/Bzip2))\r\n\r\nThe OOB write data is **not controlled** by the attacker, but rather the OOB write will write incremental 1-byte values into the heap memory, at fixed offsets (depending on size of the `EState` struct). This is nontrivial to exploit for remote code execution, and would require significant research for heap shaping.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'Very limited control of the overflown buffer',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'CVE-2019-9923 tar: null-pointer dereference in pax_decode_header in sparse.c (low)',
      severity: 'Low',
      impactedPackageName: 'tar',
      impactedPackageVersion: '2:1.30-5.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9923',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133693',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9923'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'tar',
            version: '2:1.30-5.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus-daemon',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus-daemon',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4510: lua security update (Low)',
      severity: 'Low',
      impactedPackageName: 'lua-libs',
      impactedPackageVersion: '0:5.3.4-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:5.3.4-12.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-24370',
          cvssV2: '5.0',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-189743',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4510',
        'https://access.redhat.com/security/cve/CVE-2020-24370',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'lua-libs',
            version: '0:5.3.4-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
  ],
  securityViolations: [
    {
      summary: 'RHSA-2021:1245: gnutls and nettle security update (Important)',
      severity: 'High',
      impactedPackageName: 'nettle',
      impactedPackageVersion: '0:3.4.1-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.4.1-2.el8_1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20305',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-173345',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1245',
        'https://access.redhat.com/security/cve/CVE-2021-20305',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'nettle',
            version: '0:3.4.1-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2717: systemd security update (Important)',
      severity: 'High',
      impactedPackageName: 'systemd-udev',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:239-45.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33910',
          cvssV2: '4.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-179897',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2717',
        'https://access.redhat.com/security/cve/CVE-2021-33910',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-udev',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'Insufficient bounds checking in basic/unit-name in systemd allows local attackers to perform denial of service by mounting a filesystem with a very long path',
        details:
          '[systemd]( https://systemd.io/) is a software suite that provides an array of system components for Linux-based operating systems. Its main aim is to unify service configuration and behavior across Linux distributions.\r\n\r\nWhen systemd parses the `/proc/self/mountinfo` file, each mountpoint is passed to `mount_setup_unit()` which eventually calls `unit_name_path_escape()`.\r\n`unit_name_path_escape()` uses `strdupa` which allows a local attacker to exhaust kernel stack memory before string length restrictions are applied, leading to OS denial of service.\r\n\r\nTo exploit this, an attacker will have to create nested directories such that the total path length exceeds 4MB.\r\n\r\nThis vulnerability is exploitable only if the kernel supports unprivileged user namespaces (`CONFIG_USER_NS`).',
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are either extremely common or nonexistent (always exploitable)',
            description: 'Local attacker only needs unprivileged user namespaces to be enabled',
          },
          {
            name: 'The issue has an exploit published',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/systemd/systemd-stable/commit/764b74113e36ac5219a4b82a05f311b5a92136ce) and build from source.\n\n##### Deployment mitigations\n\nSet /proc/sys/kernel/unprivileged_userns_clone to 0 - to prevent an attacker from mounting a long directory in user namespace. Set /proc/sys/kernel/unprivileged_bpf_disabled to 1 – to prevent an attacker from loading ebpf program into kernel. Note: these mitigations apply for the exploit that was detailed in the [technical writeup]( https://packetstormsecurity.com/files/163621/Sequoia-A-Deep-Root-In-Linuxs-Filesystem-Layer.html) but might not be applicable for other techniques.',
      },
    },
    {
      summary: 'RHSA-2021:2717: systemd security update (Important)',
      severity: 'High',
      impactedPackageName: 'systemd',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:239-45.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33910',
          cvssV2: '4.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-179897',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2717',
        'https://access.redhat.com/security/cve/CVE-2021-33910',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'Insufficient bounds checking in basic/unit-name in systemd allows local attackers to perform denial of service by mounting a filesystem with a very long path',
        details:
          '[systemd]( https://systemd.io/) is a software suite that provides an array of system components for Linux-based operating systems. Its main aim is to unify service configuration and behavior across Linux distributions.\r\n\r\nWhen systemd parses the `/proc/self/mountinfo` file, each mountpoint is passed to `mount_setup_unit()` which eventually calls `unit_name_path_escape()`.\r\n`unit_name_path_escape()` uses `strdupa` which allows a local attacker to exhaust kernel stack memory before string length restrictions are applied, leading to OS denial of service.\r\n\r\nTo exploit this, an attacker will have to create nested directories such that the total path length exceeds 4MB.\r\n\r\nThis vulnerability is exploitable only if the kernel supports unprivileged user namespaces (`CONFIG_USER_NS`).',
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are either extremely common or nonexistent (always exploitable)',
            description: 'Local attacker only needs unprivileged user namespaces to be enabled',
          },
          {
            name: 'The issue has an exploit published',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/systemd/systemd-stable/commit/764b74113e36ac5219a4b82a05f311b5a92136ce) and build from source.\n\n##### Deployment mitigations\n\nSet /proc/sys/kernel/unprivileged_userns_clone to 0 - to prevent an attacker from mounting a long directory in user namespace. Set /proc/sys/kernel/unprivileged_bpf_disabled to 1 – to prevent an attacker from loading ebpf program into kernel. Note: these mitigations apply for the exploit that was detailed in the [technical writeup]( https://packetstormsecurity.com/files/163621/Sequoia-A-Deep-Root-In-Linuxs-Filesystem-Layer.html) but might not be applicable for other techniques.',
      },
    },
    {
      summary: 'RHSA-2021:1989: bind security update (Important)',
      severity: 'High',
      impactedPackageName: 'bind-export-libs',
      impactedPackageVersion: '32:9.11.26-3.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[32:9.11.26-4.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-25215',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-176212',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1989',
        'https://access.redhat.com/security/cve/CVE-2021-25215',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'bind-export-libs',
            version: '32:9.11.26-3.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'The pip package before 19.2 for Python allows Directory Traversal when a URL is given in an install command, because a Content-Disposition header can have ../ in a filename, as demonstrated by overwriting the /root/.ssh/authorized_keys file. This occurs in _download_http_url in _internal/download.py.',
      severity: 'High',
      impactedPackageName: 'pip',
      impactedPackageVersion: '9.0.3',
      impactedPackageType: 'Python',
      fixedVersions: ['[19.2]'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-20916',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-124981',
      references: [
        'https://github.com/gzpan123/pip/commit/a4c735b14a62f9cb864533808ac63936704f2ace',
        'https://github.com/pypa/pip/compare/19.1.1...19.2',
        'https://github.com/pypa/pip/issues/6413',
        'https://lists.debian.org/debian-lts-announce/2020/09/msg00010.html',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'pip',
            version: '9.0.3',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2717: systemd security update (Important)',
      severity: 'High',
      impactedPackageName: 'systemd-pam',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:239-45.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33910',
          cvssV2: '4.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-179897',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2717',
        'https://access.redhat.com/security/cve/CVE-2021-33910',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-pam',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'Insufficient bounds checking in basic/unit-name in systemd allows local attackers to perform denial of service by mounting a filesystem with a very long path',
        details:
          '[systemd]( https://systemd.io/) is a software suite that provides an array of system components for Linux-based operating systems. Its main aim is to unify service configuration and behavior across Linux distributions.\r\n\r\nWhen systemd parses the `/proc/self/mountinfo` file, each mountpoint is passed to `mount_setup_unit()` which eventually calls `unit_name_path_escape()`.\r\n`unit_name_path_escape()` uses `strdupa` which allows a local attacker to exhaust kernel stack memory before string length restrictions are applied, leading to OS denial of service.\r\n\r\nTo exploit this, an attacker will have to create nested directories such that the total path length exceeds 4MB.\r\n\r\nThis vulnerability is exploitable only if the kernel supports unprivileged user namespaces (`CONFIG_USER_NS`).',
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are either extremely common or nonexistent (always exploitable)',
            description: 'Local attacker only needs unprivileged user namespaces to be enabled',
          },
          {
            name: 'The issue has an exploit published',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/systemd/systemd-stable/commit/764b74113e36ac5219a4b82a05f311b5a92136ce) and build from source.\n\n##### Deployment mitigations\n\nSet /proc/sys/kernel/unprivileged_userns_clone to 0 - to prevent an attacker from mounting a long directory in user namespace. Set /proc/sys/kernel/unprivileged_bpf_disabled to 1 – to prevent an attacker from loading ebpf program into kernel. Note: these mitigations apply for the exploit that was detailed in the [technical writeup]( https://packetstormsecurity.com/files/163621/Sequoia-A-Deep-Root-In-Linuxs-Filesystem-Layer.html) but might not be applicable for other techniques.',
      },
    },
    {
      summary: 'RHSA-2021:1206: gnutls and nettle security update (Important)',
      severity: 'High',
      impactedPackageName: 'gnutls',
      impactedPackageVersion: '0:3.6.14-7.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.14-8.el8_3, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20305',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-173384',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1206',
        'https://access.redhat.com/security/cve/CVE-2021-20305',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gnutls',
            version: '0:3.6.14-7.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2717: systemd security update (Important)',
      severity: 'High',
      impactedPackageName: 'systemd-libs',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:239-45.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33910',
          cvssV2: '4.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-179897',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2717',
        'https://access.redhat.com/security/cve/CVE-2021-33910',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-libs',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'Insufficient bounds checking in basic/unit-name in systemd allows local attackers to perform denial of service by mounting a filesystem with a very long path',
        details:
          '[systemd]( https://systemd.io/) is a software suite that provides an array of system components for Linux-based operating systems. Its main aim is to unify service configuration and behavior across Linux distributions.\r\n\r\nWhen systemd parses the `/proc/self/mountinfo` file, each mountpoint is passed to `mount_setup_unit()` which eventually calls `unit_name_path_escape()`.\r\n`unit_name_path_escape()` uses `strdupa` which allows a local attacker to exhaust kernel stack memory before string length restrictions are applied, leading to OS denial of service.\r\n\r\nTo exploit this, an attacker will have to create nested directories such that the total path length exceeds 4MB.\r\n\r\nThis vulnerability is exploitable only if the kernel supports unprivileged user namespaces (`CONFIG_USER_NS`).',
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are either extremely common or nonexistent (always exploitable)',
            description: 'Local attacker only needs unprivileged user namespaces to be enabled',
          },
          {
            name: 'The issue has an exploit published',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/systemd/systemd-stable/commit/764b74113e36ac5219a4b82a05f311b5a92136ce) and build from source.\n\n##### Deployment mitigations\n\nSet /proc/sys/kernel/unprivileged_userns_clone to 0 - to prevent an attacker from mounting a long directory in user namespace. Set /proc/sys/kernel/unprivileged_bpf_disabled to 1 – to prevent an attacker from loading ebpf program into kernel. Note: these mitigations apply for the exploit that was detailed in the [technical writeup]( https://packetstormsecurity.com/files/163621/Sequoia-A-Deep-Root-In-Linuxs-Filesystem-Layer.html) but might not be applicable for other techniques.',
      },
    },
    {
      summary: 'RHSA-2021:1206: gnutls and nettle security update (Important)',
      severity: 'High',
      impactedPackageName: 'nettle',
      impactedPackageVersion: '0:3.4.1-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.4.1-4.el8_3, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20305',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-173384',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1206',
        'https://access.redhat.com/security/cve/CVE-2021-20305',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'nettle',
            version: '0:3.4.1-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        '** DISPUTED ** An issue was discovered in pip (all versions) because it installs the version with the highest version number, even if the user had intended to obtain a private package from a private index. This only affects use of the --extra-index-url option, and exploitation requires that the package does not already exist in the public index (and thus the attacker can put the package there with an arbitrary version number). NOTE: it has been reported that this is intended functionality and the user is responsible for using --extra-index-url securely.',
      severity: 'High',
      impactedPackageName: 'pip',
      impactedPackageVersion: '9.0.3',
      impactedPackageType: 'Python',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20225',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-97724',
      references: [
        'https://bugzilla.redhat.com/show_bug.cgi?id=1835736',
        'https://cowlicks.website/posts/arbitrary-code-execution-from-pips-extra-index-url.html',
        'https://pip.pypa.io/en/stable/news/',
        'https://lists.apache.org/thread.html/rb1adce798445facd032870d644eb39c4baaf9c4a7dd5477d12bb6ab2@%3Cgithub.arrow.apache.org%3E',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'pip',
            version: '9.0.3',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'pip could download private packages from a public PyPI repository leading to code execution',
        details:
          "This vulnerability has been disputed by the maintainers of pip as the described behavior, while potentially insecure, is the intended one. If pip is executed with the `--extra-index-url` when using a private PyPI repository, an attacker could cause pip to download a private package (for example one named `private_package`) by adding a package with the same name (`private_package`) in the public PyPI repository. This would lead to remote code execution as pip will download the public package that could contain malicious code. This is similar to the [dependency confusion attack from 2021 by Alex Birsan](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610). However, this isn't considered a vulnerability in itself in pip, and there is no plan to patch or change it.",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue has been disputed by the vendor',
            description:
              'Pip maintainers, and others such as [RHEL](https://access.redhat.com/security/cve/cve-2018-20225) do not consider this a vulnerability as it is the intended behaviour',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Marked as unimportant by the Debian tracker',
            isPositive: true,
          },
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
        ],
        remediation:
          '##### Deployment mitigations\n\nDo not use the `--extra-index-url` flag with pip and consider using version pinning for deployments.',
      },
    },
    {
      summary:
        'Lib/zipfile.py in Python through 3.7.2 allows remote attackers to cause a denial of service (resource consumption) via a ZIP bomb.',
      severity: 'High',
      impactedPackageName: 'python3-libs',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9674',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-94619',
      references: [
        'https://bugs.python.org/issue36260',
        'https://bugs.python.org/issue36462',
        'https://github.com/python/cpython/blob/master/Lib/zipfile.py',
        'https://python-security.readthedocs.io/security.html#archives-and-zip-bomb',
        'https://www.python.org/news/security/',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libs',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2170: glib2 security and bug fix update (Important)',
      severity: 'High',
      impactedPackageName: 'glib2',
      impactedPackageVersion: '0:2.56.4-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.56.4-10.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27219',
          cvssV2: '5.0',
          cvssV3: '9.8',
        },
      ],
      issueId: 'XRAY-178553',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2170',
        'https://access.redhat.com/security/cve/CVE-2021-27219',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glib2',
            version: '0:2.56.4-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2022:1642: zlib security update (Important)',
      severity: 'High',
      impactedPackageName: 'zlib',
      impactedPackageVersion: '0:1.2.11-17.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:1.2.11-18.el8_5, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-25032',
          cvssV2: '5.0',
          cvssV3: '8.2',
        },
      ],
      issueId: 'XRAY-209351',
      references: [
        'https://access.redhat.com/errata/RHSA-2022:1642',
        'https://access.redhat.com/security/cve/CVE-2018-25032',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'zlib',
            version: '0:1.2.11-17.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'Memory corruption in zlib leads to denial of service when compressing malicious input',
        details:
          "[zlib](http://zlib.net/) is a famous software library used for data compression. zlib is a crucial component of many software platforms across many operating systems, including Linux, macOS, and iOS. A non-exhaustive list of applications using zlib can be found [here](https://en.wikipedia.org/wiki/zlib#Applications). \r\n\r\nzlib's compression can be compromised to cause an out-of-bounds write which leads to denial of service. This issue can theoretically lead to code execution, although this has not been proven yet.\r\n\r\nCurrently, the bug was only proven to be triggered when zlib is initialized with non-default values, in any of the following ways - \r\n1.`deflateInit2(\u0026strm, 7, Z_DEFLATED, 15, 1, Z_DEFAULT_STRATEGY);` (level can be either 7, 8 or 9)\r\n2. `deflateInit2(\u0026strm, X, Z_DEFLATED, X, X, Z_FIXED);` (X denoting any possible input)\r\n\r\nIn addition to that, an attacker must control the input data that will be fed to the compressor (the input buffer to `deflate()`)\r\n\r\nThe bug was introduced in `zlib 1.2.2.2`, with the addition of the `Z_FIXED` option. That option forces the use of fixed Huffman codes. For rare inputs with a large number of distant matches, the pending buffer into which the compressed data is written can overwrite the distance symbol table which it overlays. That results in corrupted output due to invalid distances, and can result in out-of-bound accesses, crashing the application.\r\n\r\nAn exploit has been [published](https://www.openwall.com/lists/oss-security/2022/03/26/1) for this issue, making exploitation more likely.",
        severity: 'High',
        severityReasons: [
          {
            name: 'The issue has an exploit published',
            description: 'Crashing PoCs exist for both the `Z_DEFAULT_STRATEGY` and `Z_FIXED` strategies',
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'The vulnerability can currently only be exploited in one of two scenarios - \r\n1.`deflateInit2(\u0026strm, 7, Z_DEFLATED, 15, 1, Z_DEFAULT_STRATEGY);` (level can be either 7, 8 or 9)\r\n2. `deflateInit2(\u0026strm, X, Z_DEFLATED, X, X, Z_FIXED);` (X denoting any possible input)\r\n\r\nUsing the `Z_FIXED` argument is highly unlikely in production code\r\nUsing the `memLevel=1` argument is highly unlikely in production code (slows down performance)',
            isPositive: true,
          },
          {
            name: 'Exploitation of the issue is only possible when the vulnerable component is used in a specific manner. The attacker has to perform per-target research to determine the vulnerable attack vector.',
            description: 'The attacker must find a remote input that propagates into the `deflate()` call',
            isPositive: true,
          },
          {
            name: 'The issue has a detailed technical explanation published, that can aid in exploit development',
            description:
              'The original advisory also contains a technical writeup of the issue. Does not include an explanation on how to exploit the issue for RCE.',
          },
        ],
        remediation:
          '##### Development mitigations\n\nApply this [patch](https://github.com/madler/zlib/commit/5c44459c3b28a9bd3283aaceab7c615f8020c531)\n\n##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.',
      },
    },
    {
      summary: 'RHSA-2022:1537: gzip security update (Important)',
      severity: 'High',
      impactedPackageName: 'gzip',
      impactedPackageVersion: '0:1.9-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:1.9-13.el8_5, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-1271',
          cvssV2: '',
          cvssV3: '7.1',
        },
      ],
      issueId: 'XRAY-209102',
      references: [
        'https://access.redhat.com/errata/RHSA-2022:1537',
        'https://access.redhat.com/security/cve/CVE-2022-1271',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gzip',
            version: '0:1.9-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:1246: gnutls and nettle security update (Important)',
      severity: 'High',
      impactedPackageName: 'nettle',
      impactedPackageVersion: '0:3.4.1-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.4.1-2.el8_2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20305',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-173361',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:1246',
        'https://access.redhat.com/security/cve/CVE-2021-20305',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'nettle',
            version: '0:3.4.1-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20839 systemd: mishandling of the current keyboard mode check leading to passwords being disclosed in cleartext to attacker (moderate)',
      severity: 'Medium',
      impactedPackageName: 'systemd',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20839',
          cvssV2: '4.3',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-134751',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20839'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20671 binutils: Integer overflow in load_specific_debug_section function (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20671',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134749',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20671'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-41072 squashfs-tools: possible Directory Traversal via symbolic link',
      severity: 'Medium',
      impactedPackageName: 'squashfs-tools',
      impactedPackageVersion: '0:4.3-20.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-41072',
          cvssV2: '5.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-185759',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'squashfs-tools',
            version: '0:4.3-20.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-1000876 binutils: integer overflow leads to heap-based buffer overflow in objdump (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1000876',
          cvssV2: '4.6',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-132665',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1000876'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-45078 binutils: out-of-bounds write in stab_xcoff_builtin_type() in stabs.c',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-45078',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-192503',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9074 binutils: out-of-bound read in function bfd_getl32 in libbfd.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9074',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134633',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9074'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3521 rpm: RPM does not require subkeys to have a valid binding signature',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3521',
          cvssV2: '',
          cvssV3: '4.4',
        },
      ],
      issueId: 'XRAY-185978',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-23308 libxml2: Use-after-free of ID and IDREF attributes',
      severity: 'Medium',
      impactedPackageName: 'libxml2',
      impactedPackageVersion: '0:2.9.7-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-23308',
          cvssV2: '4.3',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-198750',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libxml2',
            version: '0:2.9.7-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20673 libiberty: Integer overflow in demangle_template() function (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20673',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-132993',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20673'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3712 openssl: Read buffer overruns processing ASN.1 strings (moderate)',
      severity: 'Medium',
      impactedPackageName: 'openssl-libs',
      impactedPackageVersion: '1:1.1.1g-15.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3712',
          cvssV2: '5.8',
          cvssV3: '7.4',
        },
      ],
      issueId: 'XRAY-183462',
      references: ['https://access.redhat.com/security/cve/CVE-2021-3712'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'openssl-libs',
            version: '1:1.1.1g-15.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-23177 libarchive: extracting a symlink with ACLs modifies ACLs of target',
      severity: 'Medium',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-23177',
          cvssV2: '',
          cvssV3: '6.6',
        },
      ],
      issueId: 'XRAY-192333',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-23852 expat: integer overflow in function XML_GetBuffer (moderate)',
      severity: 'Medium',
      impactedPackageName: 'expat',
      impactedPackageVersion: '0:2.2.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-23852',
          cvssV2: '7.5',
          cvssV3: '9.8',
        },
      ],
      issueId: 'XRAY-197541',
      references: ['https://access.redhat.com/security/cve/CVE-2022-23852'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'expat',
            version: '0:2.2.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20623 binutils: Use-after-free in the error function (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20623',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134747',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20623'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-25313 expat: stack exhaustion in doctype parsing',
      severity: 'Medium',
      impactedPackageName: 'expat',
      impactedPackageVersion: '0:2.2.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-25313',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-198751',
      references: ['https://blog.hartwork.org/posts/expat-2-4-5-released/'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'expat',
            version: '0:2.2.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2017-14502 libarchive: Off-by-one error in the read_header function (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2017-14502',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-131952',
      references: ['https://access.redhat.com/security/cve/CVE-2017-14502'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-9075 binutils: heap-based buffer overflow in function _bfd_archive_64_bit_slurp_armap in archive64.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9075',
          cvssV2: '6.8',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134634',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9075'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-25314 expat: integer overflow in copyString()',
      severity: 'Medium',
      impactedPackageName: 'expat',
      impactedPackageVersion: '0:2.2.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-25314',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-198752',
      references: ['https://blog.hartwork.org/posts/expat-2-4-5-released/'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'expat',
            version: '0:2.2.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2021-38185 cpio: integer overflow in ds_fgetstr() in dstring.c can lead to an out-of-bounds write via a crafted pattern file',
      severity: 'Medium',
      impactedPackageName: 'cpio',
      impactedPackageVersion: '0:2.12-10.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-38185',
          cvssV2: '6.8',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-182306',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'cpio',
            version: '0:2.12-10.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20839 systemd: mishandling of the current keyboard mode check leading to passwords being disclosed in cleartext to attacker (moderate)',
      severity: 'Medium',
      impactedPackageName: 'systemd-libs',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20839',
          cvssV2: '4.3',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-134751',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20839'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-libs',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20839 systemd: mishandling of the current keyboard mode check leading to passwords being disclosed in cleartext to attacker (moderate)',
      severity: 'Medium',
      impactedPackageName: 'systemd-pam',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20839',
          cvssV2: '4.3',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-134751',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20839'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-pam',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3997 systemd: Uncontrolled recursion in systemd-tmpfiles when removing files',
      severity: 'Medium',
      impactedPackageName: 'systemd',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3997',
          cvssV2: '',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-194149',
      references: ['https://www.openwall.com/lists/oss-security/2022/01/10/2'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-17543 lz4: heap-based buffer overflow in LZ4_write32 (moderate)',
      severity: 'Medium',
      impactedPackageName: 'lz4-libs',
      impactedPackageVersion: '0:1.8.3-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-17543',
          cvssV2: '6.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-134601',
      references: ['https://access.redhat.com/security/cve/CVE-2019-17543'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'lz4-libs',
            version: '0:1.8.3-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-42694 Developer environment: Homoglyph characters can lead to trojan source attack (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42694',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189600',
      references: ['https://access.redhat.com/security/cve/CVE-2021-42694'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-42694 Developer environment: Homoglyph characters can lead to trojan source attack (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42694',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189600',
      references: ['https://access.redhat.com/security/cve/CVE-2021-42694'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20839 systemd: mishandling of the current keyboard mode check leading to passwords being disclosed in cleartext to attacker (moderate)',
      severity: 'Medium',
      impactedPackageName: 'systemd-udev',
      impactedPackageVersion: '0:239-45.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20839',
          cvssV2: '4.3',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-134751',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20839'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'systemd-udev',
            version: '0:239-45.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-35939 rpm: checks for unsafe symlinks are not performed for intermediary directories',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-35939',
          cvssV2: '',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-178849',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-23218 glibc: Stack-based buffer overflow in svcunix_create via long pathnames',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-23218',
          cvssV2: '7.5',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-196427',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-23219 glibc: Stack-based buffer overflow in sunrpc clnt_create via a long pathname',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-23219',
          cvssV2: '7.5',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-196474',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-40528 libgcrypt: ElGamal implementation allows plaintext recovery',
      severity: 'Medium',
      impactedPackageName: 'libgcrypt',
      impactedPackageVersion: '0:1.8.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-40528',
          cvssV2: '2.6',
          cvssV3: '5.9',
        },
      ],
      issueId: 'XRAY-188668',
      references: [
        'https://dev.gnupg.org/rCb118681ebc4c9ea4b9da79b0f9541405a64f4c13\nhttps://eprint.iacr.org/2021/923\nhttps://ibm.github.io/system-security-research-updates/2021/07/20/insecurity-elgamal-pt1\nhttps://ibm.github.io/system-security-research-updates/2021/09/06/insecurity-elgamal-pt2',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcrypt',
            version: '0:1.8.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2005-2541 tar: does not properly warn the user when extracting setuid or setgid files',
      severity: 'Medium',
      impactedPackageName: 'tar',
      impactedPackageVersion: '2:1.30-5.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2005-2541',
          cvssV2: '10.0',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-178652',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'tar',
            version: '2:1.30-5.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-1010022 glibc: stack guard protection bypass (moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc-common',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-1010022',
          cvssV2: '7.5',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-133149',
      references: ['https://access.redhat.com/security/cve/CVE-2019-1010022'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc-common',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-1010022 glibc: stack guard protection bypass (moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc-minimal-langpack',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-1010022',
          cvssV2: '7.5',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-133149',
      references: ['https://access.redhat.com/security/cve/CVE-2019-1010022'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc-minimal-langpack',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-1010022 glibc: stack guard protection bypass (moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-1010022',
          cvssV2: '7.5',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-133149',
      references: ['https://access.redhat.com/security/cve/CVE-2019-1010022'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-4069 vim: use-after-free in ex_open() in src/ex_docmd.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'vim-minimal',
      impactedPackageVersion: '2:8.0.1763-15.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-4069',
          cvssV2: '6.8',
          cvssV3: '7.3',
        },
      ],
      issueId: 'XRAY-191665',
      references: ['https://access.redhat.com/security/cve/CVE-2021-4069'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'vim-minimal',
            version: '2:8.0.1763-15.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-12904 Libgcrypt: physical addresses being available to other processes leads to a flush-and-reload side-channel attack (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libgcrypt',
      impactedPackageVersion: '0:1.8.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-12904',
          cvssV2: '4.3',
          cvssV3: '5.9',
        },
      ],
      issueId: 'XRAY-133231',
      references: ['https://access.redhat.com/security/cve/CVE-2019-12904'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcrypt',
            version: '0:1.8.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-4122 cryptsetup: disable encryption via header rewrite (moderate)',
      severity: 'Medium',
      impactedPackageName: 'cryptsetup-libs',
      impactedPackageVersion: '0:2.3.3-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-4122',
          cvssV2: '',
          cvssV3: '5.9',
        },
      ],
      issueId: 'XRAY-194481',
      references: ['https://access.redhat.com/security/cve/CVE-2021-4122'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'cryptsetup-libs',
            version: '0:2.3.3-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-35937 rpm: TOCTOU race in checks for unsafe symlinks',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-35937',
          cvssV2: '',
          cvssV3: '6.3',
        },
      ],
      issueId: 'XRAY-178848',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-27776 curl: auth/cookie leak on redirect',
      severity: 'Medium',
      impactedPackageName: 'curl',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-27776',
          cvssV2: '',
          cvssV3: '4.3',
        },
      ],
      issueId: 'XRAY-209155',
      references: ['https://curl.se/docs/CVE-2022-27776.html'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'curl',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-22576 curl: OAUTH2 bearer bypass in connection re-use',
      severity: 'Medium',
      impactedPackageName: 'curl',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-22576',
          cvssV2: '',
          cvssV3: '4.6',
        },
      ],
      issueId: 'XRAY-209153',
      references: ['https://curl.se/docs/CVE-2022-22576.html'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'curl',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2022-27774 curl: credential leak on redirect',
      severity: 'Medium',
      impactedPackageName: 'curl',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-27774',
          cvssV2: '',
          cvssV3: '5.0',
        },
      ],
      issueId: 'XRAY-209154',
      references: ['https://curl.se/docs/CVE-2022-27774.html'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'curl',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2022-0563 util-linux: partial disclosure of arbitrary files in chfn and chsh when compiled with libreadline',
      severity: 'Medium',
      impactedPackageName: 'util-linux',
      impactedPackageVersion: '0:2.32.1-27.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-0563',
          cvssV2: '1.9',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-198136',
      references: ['https://lore.kernel.org/util-linux/20220214110609.msiwlm457ngoic6w@ws.net.home/T/#u'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'util-linux',
            version: '0:2.32.1-27.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3999 glibc: Off-by-one buffer overflow/underflow in getcwd()',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3999',
          cvssV2: '',
          cvssV3: '7.4',
        },
      ],
      issueId: 'XRAY-194327',
      references: ['https://www.openwall.com/lists/oss-security/2022/01/24/4'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-40153 squashfs-tools: unvalidated filepaths allow writing outside of destination',
      severity: 'Medium',
      impactedPackageName: 'squashfs-tools',
      impactedPackageVersion: '0:4.3-20.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-40153',
          cvssV2: '5.8',
          cvssV3: '8.1',
        },
      ],
      issueId: 'XRAY-184287',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'squashfs-tools',
            version: '0:4.3-20.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-9077 binutils: heap-based buffer overflow in function process_mips_specific in readelf.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9077',
          cvssV2: '6.8',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-133662',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9077'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-35938 rpm: races with chown/chmod/capabilities calls during installation',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-35938',
          cvssV2: '',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-178847',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2021-31566 libarchive: symbolic links incorrectly followed when changing modes, times, ACL and flags of a file while extracting an archive',
      severity: 'Medium',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-31566',
          cvssV2: '',
          cvssV3: '4.4',
        },
      ],
      issueId: 'XRAY-192332',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-21674 libarchive: heap-based buffer overflow in archive_string_append_from_wcs function in archive_string.c (moderate)',
      severity: 'Medium',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-21674',
          cvssV2: '4.3',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-133961',
      references: ['https://access.redhat.com/security/cve/CVE-2020-21674'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2574: rpm security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'rpm-build-libs',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-14.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20271',
          cvssV2: '5.1',
          cvssV3: '6.7',
        },
        {
          id: 'CVE-2021-3421',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-186259',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2574',
        'https://access.redhat.com/security/cve/CVE-2021-20271',
        'https://access.redhat.com/security/cve/CVE-2021-3421',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm-build-libs',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4511: curl security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'curl',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-22.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22876',
          cvssV2: '5.0',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-22898',
          cvssV2: '2.6',
          cvssV3: '3.1',
        },
        {
          id: 'CVE-2021-22925',
          cvssV2: '5.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189744',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4511',
        'https://access.redhat.com/security/cve/CVE-2021-22876',
        'https://access.redhat.com/security/cve/CVE-2021-22898',
        'https://access.redhat.com/security/cve/CVE-2021-22925',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'curl',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'Uninitialized data in curl can lead to data leakage by an attacker that controls the telnet options',
        details:
          "curl supports connecting to telnet servers via the `telnet://` scheme. When connecting to telnet servers, the user can specify a list of `key=value` options via the `-t`/`--telnet-option` argument in CLI, or `CURLOPT_TELNETOPTIONS` in code.\r\n\r\nIf an attacker can control the data passed to this (`-t` etc.) option and insert a `NEW_ENV` key with a long value, curl will pass uninitialized stack data to the server. Since telnet is a cleartext network protocol, the attacker would be able to sniff the leaked data, even if the victim curl client is not connecting to the attacker's server.\r\n\r\nNote that this issue may also be exploited in the context of a parameter injection attack (in that case, the attacker would inject the `-t` argument with the crafted values)\r\n\r\nThis issue was caused due to an incomplete fix of [CVE-2021-22898](https://curl.se/docs/CVE-2021-22898.html)",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'The `-t` option is exceedingly rare, and is almost never controlled by an attacker',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Leakage of technical data',
            isPositive: true,
          },
        ],
        remediation: '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.',
      },
    },
    {
      summary: 'RHSA-2021:4399: python3 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-libs',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.8-41.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3426',
          cvssV2: '2.7',
          cvssV3: '5.7',
        },
      ],
      issueId: 'XRAY-189731',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4399',
        'https://access.redhat.com/security/cve/CVE-2021-3426',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libs',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4511: curl security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libcurl-minimal',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-22.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22876',
          cvssV2: '5.0',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-22898',
          cvssV2: '2.6',
          cvssV3: '3.1',
        },
        {
          id: 'CVE-2021-22925',
          cvssV2: '5.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189744',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4511',
        'https://access.redhat.com/security/cve/CVE-2021-22876',
        'https://access.redhat.com/security/cve/CVE-2021-22898',
        'https://access.redhat.com/security/cve/CVE-2021-22925',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libcurl-minimal',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'Uninitialized data in curl can lead to data leakage by an attacker that controls the telnet options',
        details:
          "curl supports connecting to telnet servers via the `telnet://` scheme. When connecting to telnet servers, the user can specify a list of `key=value` options via the `-t`/`--telnet-option` argument in CLI, or `CURLOPT_TELNETOPTIONS` in code.\r\n\r\nIf an attacker can control the data passed to this (`-t` etc.) option and insert a `NEW_ENV` key with a long value, curl will pass uninitialized stack data to the server. Since telnet is a cleartext network protocol, the attacker would be able to sniff the leaked data, even if the victim curl client is not connecting to the attacker's server.\r\n\r\nNote that this issue may also be exploited in the context of a parameter injection attack (in that case, the attacker would inject the `-t` argument with the crafted values)\r\n\r\nThis issue was caused due to an incomplete fix of [CVE-2021-22898](https://curl.se/docs/CVE-2021-22898.html)",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'The `-t` option is exceedingly rare, and is almost never controlled by an attacker',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Leakage of technical data',
            isPositive: true,
          },
        ],
        remediation: '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.',
      },
    },
    {
      summary: 'RHSA-2021:4358: glibc security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc-minimal-langpack',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.28-164.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27645',
          cvssV2: '1.9',
          cvssV3: '2.5',
        },
        {
          id: 'CVE-2021-33574',
          cvssV2: '7.5',
          cvssV3: '5.9',
        },
        {
          id: 'CVE-2021-35942',
          cvssV2: '6.4',
          cvssV3: '9.1',
        },
      ],
      issueId: 'XRAY-189717',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4358',
        'https://access.redhat.com/security/cve/CVE-2021-27645',
        'https://access.redhat.com/security/cve/CVE-2021-33574',
        'https://access.redhat.com/security/cve/CVE-2021-35942',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc-minimal-langpack',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A use-after-free in glibc leads to denial of service when calling mq_notify with crafted input',
        details:
          'A use-after-free in glibc related to `mq_notify` can happen under these conditions:\r\n\r\n1. The program call to `mq_notify` needs to be controlled by the attacker (specifically the `sevp` argument)\r\n2. The program must have the race condition where it may potentially\r\ndestroy the notification thread attributes before the notification\r\nthread is created (ex. calling `pthread_attr_destroy` right after `mq_notify` returns)\r\n3. The program must set CPU affinity or signal mask of the\r\nnotification thread to actually cause the use-after-free dereference\r\n\r\nThere are no known applications in distributions that have all these\r\nprerequisites, which should be extremely rare in 1st-party applications as well.\r\n\r\nIn the worst theoretical case that such an application exists, an attacker would not be able to run arbitrary code, but rather be able to control on which CPU the notification thread runs, which should have no noticeable impact on availability (and certainly not on confidentiality or integrity).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'Mq_notify with attacker-controlled arguments, additional thread API calls in a specific order, thread uses custom CPU affinity. See full description for more details',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Technical data leakage or denial of service',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4059: curl security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'curl',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-18.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22946',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-22947',
          cvssV2: '4.3',
          cvssV3: '6.1',
        },
      ],
      issueId: 'XRAY-189654',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4059',
        'https://access.redhat.com/security/cve/CVE-2021-22946',
        'https://access.redhat.com/security/cve/CVE-2021-22947',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'curl',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:3582: curl security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libcurl-minimal',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-18.el8_4.1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22924',
          cvssV2: '4.3',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-22922',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2021-22923',
          cvssV2: '2.6',
          cvssV3: '5.7',
        },
      ],
      issueId: 'XRAY-186306',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:3582',
        'https://access.redhat.com/security/cve/CVE-2021-22922',
        'https://access.redhat.com/security/cve/CVE-2021-22923',
        'https://access.redhat.com/security/cve/CVE-2021-22924',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libcurl-minimal',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          "A case-insensitive comparison in curl can lead to wrong connection reuse and unspecified impact by an attacker that can control curl's arguments and plant crafted files",
        details:
          'For TLS connections, curl will keep previously used connections in a connection pool for subsequent transfers to reuse, if one of them matches the setup (important command-line arguments or code options, such as the destination server and scheme, and the credentials used to connect to the server)\r\n\r\nThe code responsible to validate if the setup matches (before reusing the connection) is flawed since:\r\n1. Several arguments that contain file paths were matched in a case-insensitive way, even though some filesystems are case-sensitive\r\n2. The "Issuer Certificate" was not considered as part of the matching function\r\n\r\nThe arguments that were matched case-insensitively are:\r\n`issuercert, cafile, carootdir, clientcert, randomfile, randomsock`\r\n\r\nFor example, on a case-sensitive filesystem such as `ext4`, and the following curl command line - `curl --cafile=/tmp/mycert.pem http://www.mydomain.com`.\r\nAn attacker could plant his own certificate under `/tmp/Mycert.pem` and change `cafile=/tmp/Mycert.pem`, and the previous connection to `http://www.mydomain.com` would be reused.\r\n\r\nIt is unclear whether this has any real-world security impact.',
        severity: 'Medium',
        severityReasons: [
          {
            name: "The issue's real-world impact is unspecified and nontrivial to deduce",
            description: 'Unintended reuse of an existing TLS connection',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'An attacker would need to control one of the mentioned command line arguments and plant malicious files',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            isPositive: true,
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Deployment mitigations\n\nWhen using any of the following arguments: `issuercert, cafile, carootdir, clientcert, randomfile, randomsock` Make sure to use paths which are inaccessible to attackers (ex. non-world-writable directories)',
      },
    },
    {
      summary: 'RHSA-2021:4384: bind security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'bind-export-libs',
      impactedPackageVersion: '32:9.11.26-3.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[32:9.11.26-6.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-25214',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-189725',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4384',
        'https://access.redhat.com/security/cve/CVE-2021-25214',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'bind-export-libs',
            version: '32:9.11.26-3.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4060: libsolv security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libsolv',
      impactedPackageVersion: '0:0.7.16-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.7.16-3.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33930',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-33938',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-33928',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-33929',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189655',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4060',
        'https://access.redhat.com/security/cve/CVE-2021-33928',
        'https://access.redhat.com/security/cve/CVE-2021-33929',
        'https://access.redhat.com/security/cve/CVE-2021-33930',
        'https://access.redhat.com/security/cve/CVE-2021-33938',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libsolv',
            version: '0:0.7.16-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'yum',
      impactedPackageVersion: '0:4.4.2-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.7.0-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'yum',
            version: '0:4.4.2-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4587: gcc security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.5.0-4.el8_5, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42574',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189752',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4587',
        'https://access.redhat.com/security/cve/CVE-2021-42574',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4424: openssl security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'openssl-libs',
      impactedPackageVersion: '1:1.1.1g-15.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: ['[1:1.1.1k-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-23840',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-23841',
          cvssV2: '4.3',
          cvssV3: '5.9',
        },
      ],
      issueId: 'XRAY-189736',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4424',
        'https://access.redhat.com/security/cve/CVE-2021-23840',
        'https://access.redhat.com/security/cve/CVE-2021-23841',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'openssl-libs',
            version: '1:1.1.1g-15.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'An integer overflow in OpenSSL leads to unspecified impact when encrypting/decrypting very large user input',
        details:
          "For some cryptographic encryption/decryption schemes, OpenSSL determines the operation's output length by rounding-up (or aligning) the input length value.\r\n\r\nIn cases where the input length is completely user controlled, an attacker can set the input length to INT_MAX (2GB for 32-bit binaries) which will cause the output length to be a small negative number.\r\n\r\nThe impact from this issue depends on what the calling program does with the output length, but will most likely lead to denial of service in the worst case (ex. if the output length is later handled as an unsigned integer).\r\n\r\nNote that in cases where the input length is completely user controlled, it is very likely that the program will crash even before getting to the OpenSSL encryption/decryption operation.",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The impact of exploiting the issue depends on the context of surrounding software. A severe impact such as RCE is not guaranteed.',
            description: 'Denial of service',
            isPositive: true,
          },
          {
            name: "The reported CVSS was either wrongly calculated, downgraded by other vendors, or does not reflect the vulnerability's impact",
            description: "Rated as 'Low' severity in original advisory",
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:2569: libxml2 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libxml2',
      impactedPackageVersion: '0:2.9.7-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.9.7-9.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3516',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
        {
          id: 'CVE-2021-3517',
          cvssV2: '7.5',
          cvssV3: '8.6',
        },
        {
          id: 'CVE-2021-3518',
          cvssV2: '6.8',
          cvssV3: '8.6',
        },
        {
          id: 'CVE-2021-3537',
          cvssV2: '4.3',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-3541',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-186257',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2569',
        'https://access.redhat.com/security/cve/CVE-2021-3516',
        'https://access.redhat.com/security/cve/CVE-2021-3517',
        'https://access.redhat.com/security/cve/CVE-2021-3518',
        'https://access.redhat.com/security/cve/CVE-2021-3537',
        'https://access.redhat.com/security/cve/CVE-2021-3541',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libxml2',
            version: '0:2.9.7-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A use-after-free in libxml2 leads to remote code execution when parsing a malicious XML file with xmllint',
        details:
          '[Libxml2](http://xmlsoft.org/) is an XML parser written in C, which is a part of the [Gnome](https://www.gnome.org/) project and is used by other software such as Google Chrome.\r\n\r\nA use-after-free flaw exists in the `xmllint` development tool, that can lead to dangling pointers in some entity reference nodes.\r\n\r\nAttackers can trigger the exploit by having a specially crafted XML file parsed by the `xmllint` development tool, when it is running with the `--dropdtd` and the `--xinclude` flags.\r\nNote that the flaw has not been proven to be exploitable by regular parsing (ex. the `xmlReadFile` API) since the functionality of the `--dropdtd` flag cannot be replicated by API options to `xmlReadFile`, making the vulnerable configuration extremely unlikely in any production environment.\r\n\r\n A public [proof of concept](https://gitlab.gnome.org/GNOME/libxml2/-/issues/237) exploit exists which demonstrates denial of service, but remote execution has not been demonstrated publicly.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'Attacker-supplied XML file being parsed by `xmllint` with the `--dropdtd` and `--xinclude` flags',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'An (RCE) exploit or technical writeup were not published',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'dnf-data',
      impactedPackageVersion: '0:4.4.2-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.7.0-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dnf-data',
            version: '0:4.4.2-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4396: sqlite security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'sqlite-libs',
      impactedPackageVersion: '0:3.26.0-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.26.0-15.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-5827',
          cvssV2: '6.8',
          cvssV3: '8.8',
        },
        {
          id: 'CVE-2020-13435',
          cvssV2: '2.1',
          cvssV3: '5.5',
        },
        {
          id: 'CVE-2019-13750',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2019-13751',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2019-19603',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189730',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4396',
        'https://access.redhat.com/security/cve/CVE-2019-13750',
        'https://access.redhat.com/security/cve/CVE-2019-13751',
        'https://access.redhat.com/security/cve/CVE-2019-19603',
        'https://access.redhat.com/security/cve/CVE-2019-5827',
        'https://access.redhat.com/security/cve/CVE-2020-13435',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'sqlite-libs',
            version: '0:3.26.0-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:3058: glib2 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glib2',
      impactedPackageVersion: '0:2.56.4-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.56.4-10.el8_4.1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27218',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-186278',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:3058',
        'https://access.redhat.com/security/cve/CVE-2021-27218',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glib2',
            version: '0:2.56.4-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4057: python3 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'platform-python',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.8-39.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3733',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-189652',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4057',
        'https://access.redhat.com/security/cve/CVE-2021-3733',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'platform-python',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4451: gnutls and nettle security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'nettle',
      impactedPackageVersion: '0:3.4.1-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.4.1-7.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20231',
          cvssV2: '7.5',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-20232',
          cvssV2: '7.5',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-3580',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189739',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4451',
        'https://access.redhat.com/security/cve/CVE-2021-20231',
        'https://access.redhat.com/security/cve/CVE-2021-20232',
        'https://access.redhat.com/security/cve/CVE-2021-3580',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'nettle',
            version: '0:3.4.1-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A use-after-free in GnuTLS client can lead to remote code execution when connecting to a malicious TLS server',
        details:
          'A use-after-free in GnuTLS can be triggered when a GnuTLS client that supports TLS 1.3 connects to a malicious TLS server, which can negotiate very large DHE parameters and force a TLS session resumption.\r\nThis culminates in the client sending a very large "Client Hello" packet (in the resumed session) which triggers a `realloc` call and a subsequent dangling pointer. \r\n\r\nThe researcher that disclosed the issue was able to demonstrate the UAF on modified code only and also specified that the CVE is low severity due to the complexity in predicting the memory allocation of both glibc and GnuTLS (which is needed so the attacker can cause a useful/controlled object to be allocated instead of the original object).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'The issue was demonstrated on modified code only',
            isPositive: true,
          },
          {
            name: "The reported CVSS was either wrongly calculated, downgraded by other vendors, or does not reflect the vulnerability's impact",
            description: 'The vendor marked the CVE as low severity',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4374: file security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'file-libs',
      impactedPackageVersion: '0:5.33-16.el8_3.1',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:5.33-20.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-18218',
          cvssV2: '7.5',
          cvssV3: '9.8',
        },
      ],
      issueId: 'XRAY-189722',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4374',
        'https://access.redhat.com/security/cve/CVE-2019-18218',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'file-libs',
            version: '0:5.33-16.el8_3.1',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A heap-based buffer overflow in file leads to remote code execution when processing a malicious binary',
        details:
          'The `file` program is a standard program of Unix and Unix-like operating systems for recognizing the type of data contained in a computer file.\r\n\r\nA heap-based buffer overflow was discovered,  where `cdf_read_property_info` in cdf.c doesn’t restrict the number of `CDF_VECTOR` elements.\r\nAn attacker can trigger a 4-byte heap-based buffer overflow when the victim processes a crafted malicious file with the `file` program. Note that the issue is only exploitable on 32-bit operating systems.\r\n\r\nSince the bug was identified via oss-fuzz, a crashing [PoC is publicly available](https://oss-fuzz.com/download?testcase_id=5743444592427008)',
        severity: 'High',
        severityReasons: [
          {
            name: 'Exploitation of the issue is only possible when the vulnerable component is used in a specific manner. The attacker has to perform per-target research to determine the vulnerable attack vector.',
            description: 'Attacker must determine which remote input will propagate to `file`',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'Published exploit does not demonstrate remote code execution',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Development mitigations\n\nApply this [patch]( https://github.com/file/file/commit/46a8443f76cec4b41ec736eca396984c74664f84) and build from source .',
      },
    },
    {
      summary: 'RHSA-2021:4587: gcc security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.5.0-4.el8_5, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42574',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189752',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4587',
        'https://access.redhat.com/security/cve/CVE-2021-42574',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4451: gnutls and nettle security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'gnutls',
      impactedPackageVersion: '0:3.6.14-7.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.16-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20231',
          cvssV2: '7.5',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-20232',
          cvssV2: '7.5',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-3580',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189739',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4451',
        'https://access.redhat.com/security/cve/CVE-2021-20231',
        'https://access.redhat.com/security/cve/CVE-2021-20232',
        'https://access.redhat.com/security/cve/CVE-2021-3580',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gnutls',
            version: '0:3.6.14-7.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A use-after-free in GnuTLS client can lead to remote code execution when connecting to a malicious TLS server',
        details:
          'A use-after-free in GnuTLS can be triggered when a GnuTLS client that supports TLS 1.3 connects to a malicious TLS server, which can negotiate very large DHE parameters and force a TLS session resumption.\r\nThis culminates in the client sending a very large "Client Hello" packet (in the resumed session) which triggers a `realloc` call and a subsequent dangling pointer. \r\n\r\nThe researcher that disclosed the issue was able to demonstrate the UAF on modified code only and also specified that the CVE is low severity due to the complexity in predicting the memory allocation of both glibc and GnuTLS (which is needed so the attacker can cause a useful/controlled object to be allocated instead of the original object).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'The issue was demonstrated on modified code only',
            isPositive: true,
          },
          {
            name: "The reported CVSS was either wrongly calculated, downgraded by other vendors, or does not reflect the vulnerability's impact",
            description: 'The vendor marked the CVE as low severity',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:3576: krb5 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'krb5-libs',
      impactedPackageVersion: '0:1.18.2-8.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:1.18.2-8.3.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-36222',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-37750',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-185299',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:3576',
        'https://access.redhat.com/security/cve/CVE-2021-36222',
        'https://access.redhat.com/security/cve/CVE-2021-37750',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'krb5-libs',
            version: '0:1.18.2-8.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4426: ncurses security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'ncurses-libs',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:6.1-9.20180224.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-17594',
          cvssV2: '4.6',
          cvssV3: '5.3',
        },
        {
          id: 'CVE-2019-17595',
          cvssV2: '5.8',
          cvssV3: '5.4',
        },
      ],
      issueId: 'XRAY-189737',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4426',
        'https://access.redhat.com/security/cve/CVE-2019-17594',
        'https://access.redhat.com/security/cve/CVE-2019-17595',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-libs',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2574: rpm security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-14.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20271',
          cvssV2: '5.1',
          cvssV3: '6.7',
        },
        {
          id: 'CVE-2021-3421',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-186259',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2574',
        'https://access.redhat.com/security/cve/CVE-2021-20271',
        'https://access.redhat.com/security/cve/CVE-2021-3421',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4358: glibc security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.28-164.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27645',
          cvssV2: '1.9',
          cvssV3: '2.5',
        },
        {
          id: 'CVE-2021-33574',
          cvssV2: '7.5',
          cvssV3: '5.9',
        },
        {
          id: 'CVE-2021-35942',
          cvssV2: '6.4',
          cvssV3: '9.1',
        },
      ],
      issueId: 'XRAY-189717',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4358',
        'https://access.redhat.com/security/cve/CVE-2021-27645',
        'https://access.redhat.com/security/cve/CVE-2021-33574',
        'https://access.redhat.com/security/cve/CVE-2021-35942',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A use-after-free in glibc leads to denial of service when calling mq_notify with crafted input',
        details:
          'A use-after-free in glibc related to `mq_notify` can happen under these conditions:\r\n\r\n1. The program call to `mq_notify` needs to be controlled by the attacker (specifically the `sevp` argument)\r\n2. The program must have the race condition where it may potentially\r\ndestroy the notification thread attributes before the notification\r\nthread is created (ex. calling `pthread_attr_destroy` right after `mq_notify` returns)\r\n3. The program must set CPU affinity or signal mask of the\r\nnotification thread to actually cause the use-after-free dereference\r\n\r\nThere are no known applications in distributions that have all these\r\nprerequisites, which should be extremely rare in 1st-party applications as well.\r\n\r\nIn the worst theoretical case that such an application exists, an attacker would not be able to run arbitrary code, but rather be able to control on which CPU the notification thread runs, which should have no noticeable impact on availability (and certainly not on confidentiality or integrity).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'Mq_notify with attacker-controlled arguments, additional thread API calls in a specific order, thread uses custom CPU affinity. See full description for more details',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Technical data leakage or denial of service',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:2574: rpm security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'rpm-libs',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-14.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20271',
          cvssV2: '5.1',
          cvssV3: '6.7',
        },
        {
          id: 'CVE-2021-3421',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-186259',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2574',
        'https://access.redhat.com/security/cve/CVE-2021-20271',
        'https://access.redhat.com/security/cve/CVE-2021-3421',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm-libs',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4513: libsepol security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libsepol',
      impactedPackageVersion: '0:2.9-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.9-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-36087',
          cvssV2: '2.1',
          cvssV3: '3.3',
        },
        {
          id: 'CVE-2021-36084',
          cvssV2: '2.1',
          cvssV3: '3.3',
        },
        {
          id: 'CVE-2021-36085',
          cvssV2: '2.1',
          cvssV3: '3.3',
        },
        {
          id: 'CVE-2021-36086',
          cvssV2: '2.1',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-189745',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4513',
        'https://access.redhat.com/security/cve/CVE-2021-36084',
        'https://access.redhat.com/security/cve/CVE-2021-36085',
        'https://access.redhat.com/security/cve/CVE-2021-36086',
        'https://access.redhat.com/security/cve/CVE-2021-36087',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libsepol',
            version: '0:2.9-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4399: python3 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'platform-python',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.8-41.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3426',
          cvssV2: '2.7',
          cvssV3: '5.7',
        },
      ],
      issueId: 'XRAY-189731',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4399',
        'https://access.redhat.com/security/cve/CVE-2021-3426',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'platform-python',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4057: python3 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-libs',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:3.6.8-39.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3733',
          cvssV2: '4.0',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-189652',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4057',
        'https://access.redhat.com/security/cve/CVE-2021-3733',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libs',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4409: libgcrypt security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libgcrypt',
      impactedPackageVersion: '0:1.8.5-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:1.8.5-6.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-33560',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-189734',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4409',
        'https://access.redhat.com/security/cve/CVE-2021-33560',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcrypt',
            version: '0:1.8.5-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2022:1552: vim security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'vim-minimal',
      impactedPackageVersion: '2:8.0.1763-15.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[2:8.0.1763-16.el8_5.13, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2022-1154',
          cvssV2: '7.5',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-209103',
      references: [
        'https://access.redhat.com/errata/RHSA-2022:1552',
        'https://access.redhat.com/security/cve/CVE-2022-1154',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'vim-minimal',
            version: '2:8.0.1763-15.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2574: rpm security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-14.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20271',
          cvssV2: '5.1',
          cvssV3: '6.7',
        },
        {
          id: 'CVE-2021-3421',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-186259',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2574',
        'https://access.redhat.com/security/cve/CVE-2021-20271',
        'https://access.redhat.com/security/cve/CVE-2021-3421',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4385: glib2 security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glib2',
      impactedPackageVersion: '0:2.56.4-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.56.4-156.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-28153',
          cvssV2: '5.0',
          cvssV3: '5.3',
        },
        {
          id: 'CVE-2021-3800',
          cvssV2: '',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-189726',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4385',
        'https://access.redhat.com/security/cve/CVE-2021-28153',
        'https://access.redhat.com/security/cve/CVE-2021-3800',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glib2',
            version: '0:2.56.4-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4059: curl security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libcurl-minimal',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-18.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22946',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2021-22947',
          cvssV2: '4.3',
          cvssV3: '6.1',
        },
      ],
      issueId: 'XRAY-189654',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4059',
        'https://access.redhat.com/security/cve/CVE-2021-22946',
        'https://access.redhat.com/security/cve/CVE-2021-22947',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libcurl-minimal',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:2575: lz4 security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'lz4-libs',
      impactedPackageVersion: '0:1.8.3-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:1.8.3-3.el8_4, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3520',
          cvssV2: '7.5',
          cvssV3: '8.6',
        },
      ],
      issueId: 'XRAY-186260',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:2575',
        'https://access.redhat.com/security/cve/CVE-2021-3520',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'lz4-libs',
            version: '0:1.8.3-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4382: json-c security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'json-c',
      impactedPackageVersion: '0:0.13.1-0.4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.13.1-2.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-12762',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-189724',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4382',
        'https://access.redhat.com/security/cve/CVE-2020-12762',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'json-c',
            version: '0:0.13.1-0.4.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4517: vim security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'vim-minimal',
      impactedPackageVersion: '2:8.0.1763-15.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[2:8.0.1763-16.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3778',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
        {
          id: 'CVE-2021-3796',
          cvssV2: '6.8',
          cvssV3: '7.3',
        },
      ],
      issueId: 'XRAY-189746',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4517',
        'https://access.redhat.com/security/cve/CVE-2021-3778',
        'https://access.redhat.com/security/cve/CVE-2021-3796',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'vim-minimal',
            version: '2:8.0.1763-15.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4596: binutils security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.30-93.el8_4.2, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42574',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189664',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4596',
        'https://access.redhat.com/security/cve/CVE-2021-42574',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:3582: curl security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'curl',
      impactedPackageVersion: '0:7.61.1-18.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:7.61.1-18.el8_4.1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-22924',
          cvssV2: '4.3',
          cvssV3: '3.7',
        },
        {
          id: 'CVE-2021-22922',
          cvssV2: '4.3',
          cvssV3: '6.5',
        },
        {
          id: 'CVE-2021-22923',
          cvssV2: '2.6',
          cvssV3: '5.7',
        },
      ],
      issueId: 'XRAY-186306',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:3582',
        'https://access.redhat.com/security/cve/CVE-2021-22922',
        'https://access.redhat.com/security/cve/CVE-2021-22923',
        'https://access.redhat.com/security/cve/CVE-2021-22924',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'curl',
            version: '0:7.61.1-18.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          "A case-insensitive comparison in curl can lead to wrong connection reuse and unspecified impact by an attacker that can control curl's arguments and plant crafted files",
        details:
          'For TLS connections, curl will keep previously used connections in a connection pool for subsequent transfers to reuse, if one of them matches the setup (important command-line arguments or code options, such as the destination server and scheme, and the credentials used to connect to the server)\r\n\r\nThe code responsible to validate if the setup matches (before reusing the connection) is flawed since:\r\n1. Several arguments that contain file paths were matched in a case-insensitive way, even though some filesystems are case-sensitive\r\n2. The "Issuer Certificate" was not considered as part of the matching function\r\n\r\nThe arguments that were matched case-insensitively are:\r\n`issuercert, cafile, carootdir, clientcert, randomfile, randomsock`\r\n\r\nFor example, on a case-sensitive filesystem such as `ext4`, and the following curl command line - `curl --cafile=/tmp/mycert.pem http://www.mydomain.com`.\r\nAn attacker could plant his own certificate under `/tmp/Mycert.pem` and change `cafile=/tmp/Mycert.pem`, and the previous connection to `http://www.mydomain.com` would be reused.\r\n\r\nIt is unclear whether this has any real-world security impact.',
        severity: 'Medium',
        severityReasons: [
          {
            name: "The issue's real-world impact is unspecified and nontrivial to deduce",
            description: 'Unintended reuse of an existing TLS connection',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'An attacker would need to control one of the mentioned command line arguments and plant malicious files',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            isPositive: true,
          },
        ],
        remediation:
          '##### Development upgrade\n\n- Upgrade the component to any of the suggested fixed versions.\n\n##### Deployment mitigations\n\nWhen using any of the following arguments: `issuercert, cafile, carootdir, clientcert, randomfile, randomsock` Make sure to use paths which are inaccessible to attackers (ex. non-world-writable directories)',
      },
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-libdnf',
      impactedPackageVersion: '0:0.55.0-7.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.63.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libdnf',
            version: '0:0.55.0-7.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4595: binutils security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.30-108.el8_5.1, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-42574',
          cvssV2: '5.1',
          cvssV3: '8.5',
        },
      ],
      issueId: 'XRAY-189758',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4595',
        'https://access.redhat.com/security/cve/CVE-2021-42574',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-hawkey',
      impactedPackageVersion: '0:0.55.0-7.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.63.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-hawkey',
            version: '0:0.55.0-7.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4426: ncurses security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'ncurses-base',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:6.1-9.20180224.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-17594',
          cvssV2: '4.6',
          cvssV3: '5.3',
        },
        {
          id: 'CVE-2019-17595',
          cvssV2: '5.8',
          cvssV3: '5.4',
        },
      ],
      issueId: 'XRAY-189737',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4426',
        'https://access.redhat.com/security/cve/CVE-2019-17594',
        'https://access.redhat.com/security/cve/CVE-2019-17595',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-base',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'python3-dnf',
      impactedPackageVersion: '0:4.4.2-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.7.0-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-dnf',
            version: '0:4.4.2-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4364: binutils security update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.30-108.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35448',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
        {
          id: 'CVE-2021-20197',
          cvssV2: '3.3',
          cvssV3: '4.2',
        },
        {
          id: 'CVE-2021-20284',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
        {
          id: 'CVE-2021-3487',
          cvssV2: '7.1',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-189719',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4364',
        'https://access.redhat.com/security/cve/CVE-2020-35448',
        'https://access.redhat.com/security/cve/CVE-2021-20197',
        'https://access.redhat.com/security/cve/CVE-2021-20284',
        'https://access.redhat.com/security/cve/CVE-2021-3487',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'libdnf',
      impactedPackageVersion: '0:0.55.0-7.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.63.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libdnf',
            version: '0:0.55.0-7.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4358: glibc security, bug fix, and enhancement update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'glibc-common',
      impactedPackageVersion: '0:2.28-151.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.28-164.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-27645',
          cvssV2: '1.9',
          cvssV3: '2.5',
        },
        {
          id: 'CVE-2021-33574',
          cvssV2: '7.5',
          cvssV3: '5.9',
        },
        {
          id: 'CVE-2021-35942',
          cvssV2: '6.4',
          cvssV3: '9.1',
        },
      ],
      issueId: 'XRAY-189717',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4358',
        'https://access.redhat.com/security/cve/CVE-2021-27645',
        'https://access.redhat.com/security/cve/CVE-2021-33574',
        'https://access.redhat.com/security/cve/CVE-2021-35942',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glibc-common',
            version: '0:2.28-151.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A use-after-free in glibc leads to denial of service when calling mq_notify with crafted input',
        details:
          'A use-after-free in glibc related to `mq_notify` can happen under these conditions:\r\n\r\n1. The program call to `mq_notify` needs to be controlled by the attacker (specifically the `sevp` argument)\r\n2. The program must have the race condition where it may potentially\r\ndestroy the notification thread attributes before the notification\r\nthread is created (ex. calling `pthread_attr_destroy` right after `mq_notify` returns)\r\n3. The program must set CPU affinity or signal mask of the\r\nnotification thread to actually cause the use-after-free dereference\r\n\r\nThere are no known applications in distributions that have all these\r\nprerequisites, which should be extremely rare in 1st-party applications as well.\r\n\r\nIn the worst theoretical case that such an application exists, an attacker would not be able to run arbitrary code, but rather be able to control on which CPU the notification thread runs, which should have no noticeable impact on availability (and certainly not on confidentiality or integrity).',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description:
              'Mq_notify with attacker-controlled arguments, additional thread API calls in a specific order, thread uses custom CPU affinity. See full description for more details',
            isPositive: true,
          },
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Technical data leakage or denial of service',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4464: dnf security and bug fix update (Moderate)',
      severity: 'Medium',
      impactedPackageName: 'dnf',
      impactedPackageVersion: '0:4.4.2-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.7.0-4.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3445',
          cvssV2: '5.1',
          cvssV3: '6.4',
        },
      ],
      issueId: 'XRAY-189741',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4464',
        'https://access.redhat.com/security/cve/CVE-2021-3445',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dnf',
            version: '0:4.4.2-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-6872 binutils: out of bounds read in elf_parse_notes function in elf.c file in libbfd library (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-6872',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133077',
      references: ['https://access.redhat.com/security/cve/CVE-2018-6872'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-8906 file: out-of-bounds read in do_core_note in readelf.c (low)',
      severity: 'Low',
      impactedPackageName: 'file-libs',
      impactedPackageVersion: '0:5.33-16.el8_3.1',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-8906',
          cvssV2: '3.6',
          cvssV3: '5.4',
        },
      ],
      issueId: 'XRAY-134829',
      references: ['https://access.redhat.com/security/cve/CVE-2019-8906'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'file-libs',
            version: '0:5.33-16.el8_3.1',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-18309 binutils: invalid memory address dereference in read_reloc in reloc.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18309',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134736',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18309'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-19217 ncurses: Null pointer dereference at function _nc_name_match (low)',
      severity: 'Low',
      impactedPackageName: 'ncurses-libs',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19217',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132932',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19217'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-libs',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A NULL pointer dereference in ncurses may lead to a denial of service',
        details:
          '[ncurses](https://en.wikipedia.org/wiki/Ncurses) (new curses) is a programming library providing an application programming interface (API) that allows the programmer to write text-based user interfaces in a terminal-independent manner.\r\n\r\nIn ncurses, possibly a 6.x version, there is a NULL pointer dereference at the function _nc_name_match that will lead to a denial of service attack.',
        severity: 'Low',
        severityReasons: [
          {
            name: 'The issue has been disputed by the vendor',
            description: 'This vulnerability did not reproduce and was disputed',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'CVE-2018-19217 ncurses: Null pointer dereference at function _nc_name_match (low)',
      severity: 'Low',
      impactedPackageName: 'ncurses-base',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19217',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132932',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19217'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-base',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'A NULL pointer dereference in ncurses may lead to a denial of service',
        details:
          '[ncurses](https://en.wikipedia.org/wiki/Ncurses) (new curses) is a programming library providing an application programming interface (API) that allows the programmer to write text-based user interfaces in a terminal-independent manner.\r\n\r\nIn ncurses, possibly a 6.x version, there is a NULL pointer dereference at the function _nc_name_match that will lead to a denial of service attack.',
        severity: 'Low',
        severityReasons: [
          {
            name: 'The issue has been disputed by the vendor',
            description: 'This vulnerability did not reproduce and was disputed',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'CVE-2019-12972 binutils: out-of-bounds read in setup_group in bfd/elf.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-12972',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-133232',
      references: ['https://access.redhat.com/security/cve/CVE-2019-12972'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4408: libsolv security and bug fix update (Low)',
      severity: 'Low',
      impactedPackageName: 'libsolv',
      impactedPackageVersion: '0:0.7.16-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:0.7.19-1.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3200',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-189733',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4408',
        'https://access.redhat.com/security/cve/CVE-2021-3200',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libsolv',
            version: '0:0.7.16-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20225 python-pip: when --extra-index-url option is used and package does not already exist in the public index, the installation of malicious package with arbitrary version number is possible. (low)',
      severity: 'Low',
      impactedPackageName: 'python3-pip-wheel',
      impactedPackageVersion: '0:9.0.3-19.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20225',
          cvssV2: '6.8',
          cvssV3: '7.8',
        },
      ],
      issueId: 'XRAY-134539',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20225'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-pip-wheel',
            version: '0:9.0.3-19.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'pip could download private packages from a public PyPI repository leading to code execution',
        details:
          "This vulnerability has been disputed by the maintainers of pip as the described behavior, while potentially insecure, is the intended one. If pip is executed with the `--extra-index-url` when using a private PyPI repository, an attacker could cause pip to download a private package (for example one named `private_package`) by adding a package with the same name (`private_package`) in the public PyPI repository. This would lead to remote code execution as pip will download the public package that could contain malicious code. This is similar to the [dependency confusion attack from 2021 by Alex Birsan](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610). However, this isn't considered a vulnerability in itself in pip, and there is no plan to patch or change it.",
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue has been disputed by the vendor',
            description:
              'Pip maintainers, and others such as [RHEL](https://access.redhat.com/security/cve/cve-2018-20225) do not consider this a vulnerability as it is the intended behaviour',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Marked as unimportant by the Debian tracker',
            isPositive: true,
          },
          {
            name: 'The issue can only be exploited by an attacker that can execute code on the vulnerable machine (excluding exceedingly rare circumstances)',
            isPositive: true,
          },
        ],
        remediation:
          '##### Deployment mitigations\n\nDo not use the `--extra-index-url` flag with pip and consider using version pinning for deployments.',
      },
    },
    {
      summary: 'CVE-2018-19211 ncurses: Null pointer dereference at function _nc_parse_entry in parse_entry.c (low)',
      severity: 'Low',
      impactedPackageName: 'ncurses-libs',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19211',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132928',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19211'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-libs',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-19211 ncurses: Null pointer dereference at function _nc_parse_entry in parse_entry.c (low)',
      severity: 'Low',
      impactedPackageName: 'ncurses-base',
      impactedPackageVersion: '0:6.1-7.20180224.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19211',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132928',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19211'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'ncurses-base',
            version: '0:6.1-7.20180224.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-20193 tar: Memory leak in read_header() in list.c (low)',
      severity: 'Low',
      impactedPackageName: 'tar',
      impactedPackageVersion: '2:1.30-5.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20193',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-138665',
      references: ['https://access.redhat.com/security/cve/CVE-2021-20193'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'tar',
            version: '2:1.30-5.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-18701 binutils: infinite recursion in next_is_type_qual and cplus_demangle_type functions in cp-demangle.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18701',
          cvssV2: '4.3',
          cvssV3: '4.3',
        },
      ],
      issueId: 'XRAY-132914',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18701'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35496 binutils: NULL pointer dereference in bfd_pef_scan_start_address function in bfd/pef.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35496',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-137616',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35496'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-18484 binutils: Stack exhaustion in cp-demangle.c allows for denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18484',
          cvssV2: '4.3',
          cvssV3: '4.3',
        },
      ],
      issueId: 'XRAY-132901',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18484'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9936 sqlite: heap-based buffer over-read in function fts5HashEntrySort in sqlite3.c (low)',
      severity: 'Low',
      impactedPackageName: 'sqlite-libs',
      impactedPackageVersion: '0:3.26.0-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9936',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134833',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9936'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'sqlite-libs',
            version: '0:3.26.0-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'An out-of-bounds heap read in SQLite may lead to denial of service when executing arbitrary SQL queries',
        details:
          'SQLite is vulnerable to a heap OOB read when using a long search argument on an `FTS5` (Full Text Search) virtual table.\r\nA [public exploit](https://www.mail-archive.com/sqlite-users@mailinglists.sqlite.org/msg114382.html) exists that demonstrates the crash.\r\nThis issue affects SQLite versions that have been compiled with the `FTS5` extension only.\r\n\r\nNote that the over-read information is not printed back to the user, hence data leakage is unlikely.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Denial of service on non-server process',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'Attacker needs to perform arbitrary SQL queries',
            isPositive: true,
          },
          {
            name: 'The issue has an exploit published',
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'CVE-2017-14501 libarchive: Out-of-bounds read in parse_file_info (low)',
      severity: 'Low',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2017-14501',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-131951',
      references: ['https://access.redhat.com/security/cve/CVE-2017-14501'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-1000654 libtasn1: Infinite loop in _asn1_expand_object_id(ptree) leads to memory exhaustion (low)',
      severity: 'Low',
      impactedPackageName: 'libtasn1',
      impactedPackageVersion: '0:4.13-3.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1000654',
          cvssV2: '7.1',
          cvssV3: '4.0',
        },
      ],
      issueId: 'XRAY-132660',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1000654'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libtasn1',
            version: '0:4.13-3.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-14250 binutils: integer overflow in simple-object-elf.c leads to a heap-based buffer overflow (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-14250',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133283',
      references: ['https://access.redhat.com/security/cve/CVE-2019-14250'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-14250 binutils: integer overflow in simple-object-elf.c leads to a heap-based buffer overflow (low)',
      severity: 'Low',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-14250',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133283',
      references: ['https://access.redhat.com/security/cve/CVE-2019-14250'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-14250 binutils: integer overflow in simple-object-elf.c leads to a heap-based buffer overflow (low)',
      severity: 'Low',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-14250',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133283',
      references: ['https://access.redhat.com/security/cve/CVE-2019-14250'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35494 binutils: usage of unitialized heap in tic4x_print_cond function in opcodes/tic4x-dis.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35494',
          cvssV2: '5.8',
          cvssV3: '6.1',
        },
      ],
      issueId: 'XRAY-137600',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35494'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12698 binutils: excessive memory consumption in demangle_template in cplus-dem.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12698',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132754',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12698'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9923 tar: null-pointer dereference in pax_decode_header in sparse.c (low)',
      severity: 'Low',
      impactedPackageName: 'tar',
      impactedPackageVersion: '2:1.30-5.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9923',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-133693',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9923'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'tar',
            version: '2:1.30-5.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-44568 libsolv: heap-overflows in resolve_dependencies function',
      severity: 'Low',
      impactedPackageName: 'libsolv',
      impactedPackageVersion: '0:0.7.16-2.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-44568',
          cvssV2: '4.3',
          cvssV3: '6.3',
        },
      ],
      issueId: 'XRAY-199742',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libsolv',
            version: '0:0.7.16-2.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-8905 file: stack-based buffer over-read in do_core_note in readelf.c (low)',
      severity: 'Low',
      impactedPackageName: 'file-libs',
      impactedPackageVersion: '0:5.33-16.el8_3.1',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-8905',
          cvssV2: '3.6',
          cvssV3: '5.4',
        },
      ],
      issueId: 'XRAY-134828',
      references: ['https://access.redhat.com/security/cve/CVE-2019-8905'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'file-libs',
            version: '0:5.33-16.el8_3.1',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35493 binutils: heap-based buffer overflow in bfd_pef_parse_function_stubs function in bfd/pef.c via crafted PEF file (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35493',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-137599',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35493'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2020-16598 binutils: Null Pointer Dereference in debug_get_real_type could result in DoS (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-16598',
          cvssV2: '',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-133944',
      references: ['https://access.redhat.com/security/cve/CVE-2020-16598'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-18483 binutils: Integer overflow in cplus-dem.c:get_count() allows for denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18483',
          cvssV2: '6.8',
          cvssV3: '4.3',
        },
      ],
      issueId: 'XRAY-132900',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18483'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-4209 GnuTLS: Null pointer dereference in MD_UPDATE',
      severity: 'Low',
      impactedPackageName: 'gnutls',
      impactedPackageVersion: '0:3.6.14-7.el8_3',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-4209',
          cvssV2: '',
          cvssV3: '6.5',
        },
      ],
      issueId: 'XRAY-198315',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gnutls',
            version: '0:3.6.14-7.el8_3',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-45346 sqlite: crafted SQL query allows a malicious user to obtain sensitive information (low)',
      severity: 'Low',
      impactedPackageName: 'sqlite-libs',
      impactedPackageVersion: '0:3.26.0-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-45346',
          cvssV2: '4.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-209065',
      references: ['https://access.redhat.com/security/cve/CVE-2021-45346'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'sqlite-libs',
            version: '0:3.26.0-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4386: gcc security and bug fix update (Low)',
      severity: 'Low',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.5.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20673',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-189727',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4386',
        'https://access.redhat.com/security/cve/CVE-2018-20673',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4386: gcc security and bug fix update (Low)',
      severity: 'Low',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.5.0-3.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20673',
          cvssV2: '4.3',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-189727',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4386',
        'https://access.redhat.com/security/cve/CVE-2018-20673',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-1000880 libarchive: Improper input validation in WARC parser resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1000880',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134705',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1000880'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-18605 binutils: heap-based buffer over-read in sec_merge_hash_lookup in merge.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18605',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132908',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18605'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20786 libvterm: NULL pointer dereference in vterm_screen_set_callbacks (low)',
      severity: 'Low',
      impactedPackageName: 'vim-minimal',
      impactedPackageVersion: '2:8.0.1763-15.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20786',
          cvssV2: '5.0',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-134750',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20786'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'vim-minimal',
            version: '2:8.0.1763-15.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4455: python-pip security update (Low)',
      severity: 'Low',
      impactedPackageName: 'python3-pip-wheel',
      impactedPackageVersion: '0:9.0.3-19.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:9.0.3-20.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3572',
          cvssV2: '3.5',
          cvssV3: '4.5',
        },
      ],
      issueId: 'XRAY-189740',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4455',
        'https://access.redhat.com/security/cve/CVE-2021-3572',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-pip-wheel',
            version: '0:9.0.3-19.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-16428 glib2: NULL pointer dereference in g_markup_parse_context_end_parse() function in gmarkup.c (low)',
      severity: 'Low',
      impactedPackageName: 'glib2',
      impactedPackageVersion: '0:2.56.4-9.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-16428',
          cvssV2: '7.5',
          cvssV3: '9.8',
        },
      ],
      issueId: 'XRAY-132844',
      references: ['https://access.redhat.com/security/cve/CVE-2018-16428'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'glib2',
            version: '0:2.56.4-9.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-18607 binutils: NULL pointer dereference in elf_link_input_bfd in elflink.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18607',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132910',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18607'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-19932 binutils: Integer overflow due to the IS_CONTAINED_BY_LMA macro resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-19932',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132961',
      references: ['https://access.redhat.com/security/cve/CVE-2018-19932'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20657 libiberty: Memory leak in demangle_template function resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'libstdc++',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20657',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132991',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20657'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libstdc++',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12699 binutils: heap-based buffer overflow in finish_stab in stabs.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12699',
          cvssV2: '7.5',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132755',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12699'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12697 binutils: NULL pointer dereference in work_stuff_copy_to_from in cplus-dem.c. (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12697',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132753',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12697'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-18606 binutils: NULL pointer dereference in _bfd_add_merge_section in merge_strings function in merge.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18606',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132909',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18606'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-12900 bzip2: out-of-bounds write in function BZ2_decompress (low)',
      severity: 'Low',
      impactedPackageName: 'bzip2-libs',
      impactedPackageVersion: '0:1.0.6-26.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-12900',
          cvssV2: '7.5',
          cvssV3: '4.0',
        },
      ],
      issueId: 'XRAY-133230',
      references: ['https://access.redhat.com/security/cve/CVE-2019-12900'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'bzip2-libs',
            version: '0:1.0.6-26.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'An heap out-of-bounds write in bzip2 may lead to remote code execution when decompressing a malicious archive',
        details:
          'Lack of input validation in the `bzip2` decompressor code will lead to an OOB heap write, when accessing the `selectorMtf` array with an unbounded index.\r\nAn attacker can exploit this issue by decompressing a bzip2 archive that contains many selectors (see [Bzip2 file format](https://en.wikipedia.org/wiki/Bzip2))\r\n\r\nThe OOB write data is **not controlled** by the attacker, but rather the OOB write will write incremental 1-byte values into the heap memory, at fixed offsets (depending on size of the `EState` struct). This is nontrivial to exploit for remote code execution, and would require significant research for heap shaping.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'No high-impact exploit or technical writeup were published, and exploitation of the issue with high impact is either non-trivial or completely unproven',
            description: 'Very limited control of the overflown buffer',
            isPositive: true,
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
          {
            name: 'The CVE has no published technical writeup',
            isPositive: true,
          },
          {
            name: 'The issue has no exploit published',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'RHSA-2021:4489: rpm security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-19.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20266',
          cvssV2: '4.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189742',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4489',
        'https://access.redhat.com/security/cve/CVE-2021-20266',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4489: rpm security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'rpm-libs',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-19.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20266',
          cvssV2: '4.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189742',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4489',
        'https://access.redhat.com/security/cve/CVE-2021-20266',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm-libs',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4489: rpm security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'rpm-build-libs',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-19.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20266',
          cvssV2: '4.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189742',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4489',
        'https://access.redhat.com/security/cve/CVE-2021-20266',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'rpm-build-libs',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4489: rpm security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'python3-rpm',
      impactedPackageVersion: '0:4.14.3-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:4.14.3-19.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20266',
          cvssV2: '4.0',
          cvssV3: '3.1',
        },
      ],
      issueId: 'XRAY-189742',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4489',
        'https://access.redhat.com/security/cve/CVE-2021-20266',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-rpm',
            version: '0:4.14.3-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus-daemon',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus-daemon',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9674 python: Nested zip file (Zip bomb) vulnerability in Lib/zipfile.py (low)',
      severity: 'Low',
      impactedPackageName: 'python3-libs',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9674',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-133681',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9674'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'python3-libs',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus-common',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus-common',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-17985 binutils: Stack consumption problem caused by the cplus_demangle_type (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-17985',
          cvssV2: '4.3',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-132889',
      references: ['https://access.redhat.com/security/cve/CVE-2018-17985'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12934 binutils: Uncontrolled Resource Consumption in remember_Ktype in cplus-dem.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12934',
          cvssV2: '5.0',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-132759',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12934'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20657 libiberty: Memory leak in demangle_template function resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'libgcc',
      impactedPackageVersion: '0:8.4.1-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20657',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132991',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20657'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libgcc',
            version: '0:8.4.1-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4510: lua security update (Low)',
      severity: 'Low',
      impactedPackageName: 'lua-libs',
      impactedPackageVersion: '0:5.3.4-11.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:5.3.4-12.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-24370',
          cvssV2: '5.0',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-189743',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4510',
        'https://access.redhat.com/security/cve/CVE-2020-24370',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'lua-libs',
            version: '0:5.3.4-11.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus-tools',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus-tools',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12641 binutils: Stack Exhaustion in the demangling functions provided by libiberty (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12641',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132752',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12641'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-1000879 libarchive: NULL pointer dereference in ACL parser resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1000879',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134704',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1000879'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20657 libiberty: Memory leak in demangle_template function resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20657',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132991',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20657'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2019-19244 sqlite: allows a crash if a sub-select uses both DISTINCT and window functions and also has certain ORDER BY usage (low)',
      severity: 'Low',
      impactedPackageName: 'sqlite-libs',
      impactedPackageVersion: '0:3.26.0-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-19244',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-133415',
      references: ['https://access.redhat.com/security/cve/CVE-2019-19244'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'sqlite-libs',
            version: '0:3.26.0-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9937 sqlite: null-pointer dereference in function fts5ChunkIterate in sqlite3.c (low)',
      severity: 'Low',
      impactedPackageName: 'sqlite-libs',
      impactedPackageVersion: '0:3.26.0-13.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9937',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134834',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9937'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'sqlite-libs',
            version: '0:3.26.0-13.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary:
          'A NULL pointer dereference in SQLite may lead to denial of service when executing arbitrary SQL queries',
        details:
          'SQLite is vulnerable to a NULL pointer dereference vulnerability when performing a read and write in the same transaction, on an `FTS5` (Full Text Search) virtual table.\r\nA [public exploit](https://www.mail-archive.com/sqlite-users@mailinglists.sqlite.org/msg114383.html) exists that demonstrates the crash.\r\nThis issue affects SQLite versions that have been compiled with the `FTS5` extension only.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Denial of service on non-server process',
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'Attacker needs to perform arbitrary SQL queries',
            isPositive: true,
          },
          {
            name: 'The issue has an exploit published',
          },
          {
            name: 'The issue can be exploited by attackers over the network',
          },
        ],
      },
    },
    {
      summary: 'CVE-2018-20657 libiberty: Memory leak in demangle_template function resulting in a denial of service',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20657',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-109612',
      references: null,
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9674 python: Nested zip file (Zip bomb) vulnerability in Lib/zipfile.py (low)',
      severity: 'Low',
      impactedPackageName: 'platform-python',
      impactedPackageVersion: '0:3.6.8-37.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9674',
          cvssV2: '5.0',
          cvssV3: '7.5',
        },
      ],
      issueId: 'XRAY-133681',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9674'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'platform-python',
            version: '0:3.6.8-37.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-3974 vim: Use after free in regexp_nfa.c (low)',
      severity: 'Low',
      impactedPackageName: 'vim-minimal',
      impactedPackageVersion: '2:8.0.1763-15.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-3974',
          cvssV2: '6.8',
          cvssV3: '2.9',
        },
      ],
      issueId: 'XRAY-190535',
      references: ['https://access.redhat.com/security/cve/CVE-2021-3974'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'vim-minimal',
            version: '2:8.0.1763-15.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2020-35495 binutils: NULL pointer dereference in bfd_pef_parse_symbols function in bfd/pef.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35495',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-137601',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35495'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2021-43618 gmp: Integer overflow and resultant buffer overflow via crafted input (low)',
      severity: 'Low',
      impactedPackageName: 'gmp',
      impactedPackageVersion: '1:6.1.2-10.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-43618',
          cvssV2: '5.0',
          cvssV3: '4.0',
        },
      ],
      issueId: 'XRAY-191006',
      references: ['https://access.redhat.com/security/cve/CVE-2021-43618'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'gmp',
            version: '1:6.1.2-10.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-17794 binutils: NULL pointer dereference in libiberty/cplus-dem.c:work_stuff_copy_to_from() via crafted input (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-17794',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132882',
      references: ['https://access.redhat.com/security/cve/CVE-2018-17794'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4404: kexec-tools security, bug fix, and enhancement update (Low)',
      severity: 'Low',
      impactedPackageName: 'kexec-tools',
      impactedPackageVersion: '0:2.0.20-46.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:2.0.20-57.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2021-20269',
          cvssV2: '2.1',
          cvssV3: '4.7',
        },
      ],
      issueId: 'XRAY-189732',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4404',
        'https://access.redhat.com/security/cve/CVE-2021-20269',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'kexec-tools',
            version: '0:2.0.20-46.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-18700 binutils: Recursive Stack Overflow within function d_name, d_encoding, and d_local_name in cp-demangle.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-18700',
          cvssV2: '4.3',
          cvssV3: '4.3',
        },
      ],
      issueId: 'XRAY-132913',
      references: ['https://access.redhat.com/security/cve/CVE-2018-18700'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2018-20651 binutils: NULL pointer dereference in elf_link_add_object_symbols function resulting in a denial of service (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20651',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134748',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20651'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'RHSA-2021:4373: pcre security update (Low)',
      severity: 'Low',
      impactedPackageName: 'pcre',
      impactedPackageVersion: '0:8.42-4.el8',
      impactedPackageType: 'RPM',
      fixedVersions: ['[0:8.42-6.el8, )'],
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-20838',
          cvssV2: '4.3',
          cvssV3: '7.5',
        },
        {
          id: 'CVE-2020-14155',
          cvssV2: '5.0',
          cvssV3: '5.3',
        },
      ],
      issueId: 'XRAY-189721',
      references: [
        'https://access.redhat.com/errata/RHSA-2021:4373',
        'https://access.redhat.com/security/cve/CVE-2019-20838',
        'https://access.redhat.com/security/cve/CVE-2020-14155',
      ],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'pcre',
            version: '0:8.42-4.el8',
          },
        ],
      ],
      jfrogResearchInformation: {
        summary: 'An out-of-bounds read in libpcre may cause denial of service',
        details:
          'The [PCRE library](https://www.pcre.org/) is a set of functions that implement regular expression pattern matching using the same syntax and semantics as Perl 5\r\n\r\nlibpcre in PCRE before 8.43 allows a subject buffer over-read in JIT when UTF is disabled, and \\X or \\R has more than 1 fixed quantifier.',
        severity: 'Medium',
        severityReasons: [
          {
            name: 'Exploitation of the issue is only possible when the vulnerable component is used in a specific manner. The attacker has to perform per-target research to determine the vulnerable attack vector.',
            description:
              "An attacker must find remote input that propagates into one of PCRE's functions that compile a regular expression. In other words, the attacker must be able to compile an arbitrary regular expression remotely.",
            isPositive: true,
          },
          {
            name: 'The prerequisites for exploiting the issue are exteremly unlikely',
            description: 'It is highly unlikely that an attacker can remotely control a regular expression pattern',
            isPositive: true,
          },
          {
            name: 'The issue cannot result in a severe impact (such as remote code execution)',
            description: 'Denial of service and unlikely leak of sensitive data',
            isPositive: true,
          },
          {
            name: "The reported CVSS was either wrongly calculated, downgraded by other vendors, or does not reflect the vulnerability's impact",
            description: 'Marked as unimportant by the Debian tracker',
            isPositive: true,
          },
        ],
      },
    },
    {
      summary: 'CVE-2017-14166 libarchive: Heap-based buffer over-read in the atol8 function (low)',
      severity: 'Low',
      impactedPackageName: 'libarchive',
      impactedPackageVersion: '0:3.3.3-1.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2017-14166',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-131928',
      references: ['https://access.redhat.com/security/cve/CVE-2017-14166'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'libarchive',
            version: '0:3.3.3-1.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-17360 binutils: heap-based buffer over-read in bfd_getl32 in libbfd.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-17360',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132879',
      references: ['https://access.redhat.com/security/cve/CVE-2018-17360'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-20002 binutils: memory leak in _bfd_generic_read_minisymbols function in syms.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-20002',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132963',
      references: ['https://access.redhat.com/security/cve/CVE-2018-20002'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-12700 binutils: Stack Exhaustion in debug_write_type in debug.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-12700',
          cvssV2: '5.0',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-132756',
      references: ['https://access.redhat.com/security/cve/CVE-2018-12700'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2019-9071 binutils: stack consumption in function d_count_templates_scopes in cp-demangle.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2019-9071',
          cvssV2: '4.3',
          cvssV3: '3.3',
        },
      ],
      issueId: 'XRAY-134831',
      references: ['https://access.redhat.com/security/cve/CVE-2019-9071'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35507 binutils: NULL pointer dereference in bfd_pef_parse_function_stubs function in bfd/pef.c (low)',
      severity: 'Low',
      impactedPackageName: 'binutils',
      impactedPackageVersion: '0:2.30-93.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35507',
          cvssV2: '4.3',
          cvssV3: '5.5',
        },
      ],
      issueId: 'XRAY-137617',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35507'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'binutils',
            version: '0:2.30-93.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary: 'CVE-2018-1121 procps-ng, procps: process hiding through race condition enumerating /proc (low)',
      severity: 'Low',
      impactedPackageName: 'procps-ng',
      impactedPackageVersion: '0:3.3.15-6.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2018-1121',
          cvssV2: '4.3',
          cvssV3: '3.9',
        },
      ],
      issueId: 'XRAY-132720',
      references: ['https://access.redhat.com/security/cve/CVE-2018-1121'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'procps-ng',
            version: '0:3.3.15-6.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
    {
      summary:
        'CVE-2020-35512 dbus: users with the same numeric UID could lead to use-after-free and undefined behaviour (low)',
      severity: 'Low',
      impactedPackageName: 'dbus-libs',
      impactedPackageVersion: '1:1.12.8-12.el8',
      impactedPackageType: 'RPM',
      fixedVersions: null,
      components: [
        {
          name: 'centos',
          version: 'latest',
        },
      ],
      cves: [
        {
          id: 'CVE-2020-35512',
          cvssV2: '7.2',
          cvssV3: '7.0',
        },
      ],
      issueId: 'XRAY-138230',
      references: ['https://access.redhat.com/security/cve/CVE-2020-35512'],
      impactPaths: [
        [
          {
            name: 'centos',
            version: 'latest',
          },
          {
            name: 'sha256__74ddd0ec08fa43d09f32636ba91a0a3053b02cb4627c35051aff89f853606b59.tar',
            version: '',
          },
          {
            name: 'dbus-libs',
            version: '1:1.12.8-12.el8',
          },
        ],
      ],
      jfrogResearchInformation: null,
    },
  ],
  licensesViolations: null,
  licenses: null,
  operationalRiskViolations: null,
  errors: null,
};
