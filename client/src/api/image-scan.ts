import {getConfig} from "./config";
import {execOnHost, throwErrorAsString} from "./utils";

const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export async function scanImage(imageTag: string): Promise<any> {
  console.log("Running scanImage command on: " + imageTag);
  if (development) {
    console.log("Dev environment. Getting sample results");
    return testScanResults;
  }

  let config = await getConfig();
  let cmdArgs: string[] = ["docker", "scan", imageTag, "--format", "simple-json"];
  if (config.jfrogExtensionConfig.project != undefined) {
    cmdArgs.push("--project", '"' + config.jfrogExtensionConfig.project + '"');
  } else if (config.jfrogExtensionConfig.watches != undefined) {
    cmdArgs.push("--watches", '"' + config.jfrogExtensionConfig.watches.join(",") + '"');
  }
  let scanResults;
  try {
    let cmdResult = await execOnHost("runcli.sh", "runcli.bat", cmdArgs);
    scanResults = JSON.parse(cmdResult.stdout);
  } catch (e) {
    throwErrorAsString(e);
  }
  return scanResults;
}

export async function getImages(): Promise<any> {
  console.log("Running getImages command")
  if (development) {
    console.log("Dev environment. Getting sample results")
    return testImageNames
  }

  return window.ddClient.docker.listImages();
}

const testImageNames = [
  {
    RepoTags : ["releases-docker.jfrog.io/jfrog/jfrog-cli-v2"]
  },
  {
    RepoTags : ["registry.access.redhat.com/rhel-minimal"]
  },
  {
    RepoTags : ["rbusybox:1"]
  },
  {
    RepoTags : ["busybox:2"]
  },
  {
    RepoTags : ["busybox:3"]
  },
  {
    RepoTags : ["busybox:4"]
  },
  {
    RepoTags : ["busybox:5"]
  },
  {
    RepoTags : ["<none>:<none>"]
  },
  {
    RepoTags : []
  },
  {

  }
];

const testScanResults = {
    "vulnerabilities": [
      {
        "severity": "Critical",
        "impactedPackageName": "github.com/golang/go",
        "impactedPackageVersion": "1.17.7",
        "impactedPackageType": "RPM",
        "fixedVersions": null,
        "components": [
          {
            "name": "jfrog/jfrog-docker-desktop-extension",
            "version": "latest"
          }
        ],
        "cves": [
          {
            "id": "",
            "cvssV2": "10.0",
            "cvssV3": "9.8"
          },
          {
            "id": "CVE-2022-24675",
            "cvssV2": "",
            "cvssV3": ""
          }
        ],
        "issueId": "XRAY-203335"
      },
      {
        "severity": "High",
        "impactedPackageName": "golang.org/x/crypto",
        "impactedPackageVersion": "0.0.0-20220307211146-efcb8507fb70",
        "impactedPackageType": "NuGet",
        "fixedVersions": [
          "[0.0.0-20220314234659-1baeb1ce4c0b]"
        ],
        "components": [
          {
            "name": "jfrog/jfrog-docker-desktop-extension",
            "version": "latest"
          }
        ],
        "cves": [
          {
            "id": "CVE-2022-27191",
            "cvssV2": "4.3",
            "cvssV3": "7.5"
          }
        ],
        "issueId": "XRAY-200208"
      },
      {
        "severity": "High",
        "impactedPackageName": "github.com/mholt/archiver/v3",
        "impactedPackageVersion": "3.5.1",
        "impactedPackageType": "Go",
        "fixedVersions": null,
        "components": [
          {
            "name": "jfrog/jfrog-docker-desktop-extension",
            "version": "latest"
          }
        ],
        "cves": [
          {
            "id": "",
            "cvssV2": "9.3",
            "cvssV3": "7.8"
          }
        ],
        "issueId": "XRAY-138878"
      },
      {
        "severity": "High",
        "impactedPackageName": "github.com/golang/go",
        "impactedPackageVersion": "1.17.7",
        "impactedPackageType": "Go",
        "fixedVersions": [
          "[1.16.15]",
          "[1.17.8]",
          "[1.18rc1]"
        ],
        "components": [
          {
            "name": "jfrog/jfrog-docker-desktop-extension",
            "version": "latest"
          }
        ],
        "cves": [
          {
            "id": "CVE-2022-24921",
            "cvssV2": "5.0",
            "cvssV3": "7.5"
          }
        ],
        "issueId": "XRAY-199345"
      }
    ],
    "securityViolations": null,
    "licensesViolations": null,
    "licenses": null,
    "operationalRiskViolations": null
  };
