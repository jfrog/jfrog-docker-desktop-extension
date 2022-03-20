import React from 'react';
import {getImages, scanImage} from "./api/image-scan";

export function App() {
  function printOutput(func: () => any) {
    return async function() {
      let resultsElement = document.getElementById("results");
      if (resultsElement != null) {
        resultsElement.innerText = "Working on it...";
        try {
          let res = await func();
          resultsElement.innerText = JSON.stringify(res);
        } catch (e) {
          resultsElement.innerText = JSON.stringify(e);
        }
      }
    }
  }

  return (
    <div>
      <button onClick={printOutput(() => scanImage("btnmno:asi-local"))}>Scan a vulnerable image</button>
      <button onClick={printOutput(() => getImages())}>Get images</button>
      {/*<button onClick={saveConfig}>Save config</button>*/}
      {/*<button onClick={getConfig}>Get config</button>*/}
      {/*<button onClick={importConfigFromHostCli}>Import configuration</button>*/}
    </div>
  );
}
