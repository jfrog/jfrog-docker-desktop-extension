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
    let errorMessage: string = scanResults.errors[0].errorMessage;
    // The error will always start with an uppercase letter.
    throw errorMessage[0].toUpperCase() + errorMessage.substring(1);
  }
  return scanResults;
}

export async function getImages(): Promise<any> {
  console.log('Running getImages command');
  if (development) {
    console.log('Dev environment. Getting sample results');
    return testImageData;
  }

  return window.ddClient.docker.listImages();
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
