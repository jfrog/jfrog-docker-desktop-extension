const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export async function scanImage(imageTag: string): Promise<any> {
  console.log("Running scanImage command on: " + imageTag)
  if (development) {
    console.log("Dev enviroment. getting sample results")
    return scanResults
  }
  else {
    try {
      let cmdResult = await window.ddClient.extension.host.cli.exec("runcli.sh", ["docker", "scan", "--format=json", imageTag])
      const data = await JSON.parse(cmdResult.stdout)
      return data
    }
    catch (e) {
        console.log(e)
        alert(e)
        return
      }
    }
}

  export async function getImages(): Promise<any> {
    console.log("Running getImages command.")
    if (development) {
      console.log("Dev enviroment. getting sample results")
      return imageNames
    }
    else {
      try {
        return window.ddClient.docker.listImages();
      }
      catch (e) {
        console.log(e)
        alert(e)
        return
      }
    }
  }

  const imageNames = [ 
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

  const scanResults = [
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
      Type: "GO",
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
      Type: "GO",
      FixedVersions: "1.15.10",
      Component: "myproj",
      ComponentVersion: "1.0.0",
      Cve: "CVE123123",
    },
  ];