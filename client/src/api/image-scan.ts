import {getXrayScanConfig} from "./config";
import {throwErrorAsString} from "./utils";

const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export async function scanImage(imageTag: string): Promise<any> {
  console.log("Running scanImage command on: " + imageTag);
  if (development) {
    console.log("Dev environment. Getting sample results");
    return testScanResults;
  }

  let xrayScanConfig = await getXrayScanConfig();
  let cmdArgs: string[] = ["docker", "scan", imageTag, "--format", "json"];
  if (xrayScanConfig.project != undefined) {
    cmdArgs.push("--project", '"' + xrayScanConfig.project + '"');
  } else if (xrayScanConfig.watches != undefined) {
    cmdArgs.push("--watches", '"' + xrayScanConfig.watches.join(",") + '"');
  }
  let scanResults;
  try {
    let cmdResult = await window.ddClient.extension.host.cli.exec("runcli.sh", cmdArgs);
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

const testScanResults = [
  {
    Severity: "High",
    ImpactedPacakge: "pip",
    ImpactedPacakgeVersion: "21.2.3",
    Type: "Python",
    FixedVersions: "",
    Component: "tgagor/centos",
    ComponentVersion: "stream9",
    Cve: "cve-2018-20225",
  },
  {
    Severity: "High",
    ImpactedPacakge: "pip",
    ImpactedPacakgeVersion: "21.2.3",
    Type: "Python",
    FixedVersions: "",
    Component: "tgagor/centos",
    ComponentVersion: "stream9",
    Cve: "cve-2018-20225",
  },
  {
    Severity: "High",
    ImpactedPacakge: "pip",
    ImpactedPacakgeVersion: "21.2.3",
    Type: "Python",
    FixedVersions: "",
    Component: "tgagor/centos",
    ComponentVersion: "stream9",
    Cve: "cve-2018-20225",
  },
  {
    Severity: "High",
    ImpactedPacakge: "pip",
    ImpactedPacakgeVersion: "21.2.3",
    Type: "Python",
    FixedVersions: "",
    Component: "tgagor/centos",
    ComponentVersion: "stream9",
    Cve: "cve-2018-20225",
  },
  {
    Severity: "High",
    ImpactedPacakge: "pip",
    ImpactedPacakgeVersion: "21.2.3",
    Type: "Python",
    FixedVersions: "",
    Component: "tgagor/centos",
    ComponentVersion: "stream9",
    Cve: "cve-2018-20225",
  },
  {
    Severity: "High",
    ImpactedPacakge: "pip",
    ImpactedPacakgeVersion: "21.2.3",
    Type: "Python",
    FixedVersions: "",
    Component: "tgagor/centos",
    ComponentVersion: "stream9",
    Cve: "cve-2018-20225",
  },
  {
    Severity: "High",
    ImpactedPacakge: "pip",
    ImpactedPacakgeVersion: "21.2.3",
    Type: "Python",
    FixedVersions: "",
    Component: "tgagor/centos",
    ComponentVersion: "stream9",
    Cve: "cve-2018-20225",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "2",
    Type: "maven",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Medium",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "3",
    Type: "rpm",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Low",
    ImpactedPacakge: "log4Jlog4Jlog4J",
    ImpactedPacakgeVersion: "4",
    Type: "alpine",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },

  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "23213",
    Type: "composer",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "23213",
    Type: "debian",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "23213",
    Type: "generic",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Medium",
    ImpactedPacakge: "log4Jlog4Jlog4J",
    ImpactedPacakgeVersion: "",
    Type: "docker",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Low",
    ImpactedPacakge: "dasd",
    ImpactedPacakgeVersion: "",
    Type: "npm",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "GO",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Medium",
    ImpactedPacakge: "log4Jlog4Jlog4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Low",
    ImpactedPacakge: "dasd",
    ImpactedPacakgeVersion: "",
    Type: "GO",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Medium",
    ImpactedPacakge: "log4Jlog4Jlog4J",
    ImpactedPacakgeVersion: "",
    Type: "GO",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Low",
    ImpactedPacakge: "dasd",
    ImpactedPacakgeVersion: "",
    Type: "GO",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Medium",
    ImpactedPacakge: "log4Jlog4Jlog4J",
    ImpactedPacakgeVersion: "",
    Type: "Go",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "Low",
    ImpactedPacakge: "dasd",
    ImpactedPacakgeVersion: "",
    Type: "GO",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
  {
    Severity: "High",
    ImpactedPacakge: "log4J",
    ImpactedPacakgeVersion: "",
    Type: "GO",
    FixedVersions: "1.15.10",
    Component: "myproj",
    ComponentVersion: "1.0.0",
    Cve: "CVE123123",
  },
];
