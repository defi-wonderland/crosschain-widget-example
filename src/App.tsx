import { useState, useEffect } from 'react';
import { ZodiacConnextWidget } from "crosschain-widget";
import { providers } from "ethers";

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'

function App() {
  const [tx, setTx] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [useLightTheme, setUseLightTheme] = useState(false);
  const [userChainId, setUserChainId] = useState(1);
  const [signer, setSigner] = useState<providers.JsonRpcSigner | undefined>();
  const [provider, setProvider] = useState<
    providers.JsonRpcProvider | undefined
  >();

  const handleConnect = async () => {
    if (window?.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      setSigner(provider.getSigner());
      setProvider(provider);
    }
  };

  useEffect(() => {
    signer?.getAddress().then((address) => {
      setUserAddress(address);
    });

    signer?.getChainId().then((chainId) => {
      setUserChainId(chainId);
    });
  }, [signer]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h3>Crosschain Widget Example</h3>
      
      <div className="card">
        <button onClick={() => handleConnect()}>Connect</button><br /><br />

        <button onClick={() => setUseLightTheme(!useLightTheme)}>
          Light theme: {useLightTheme.toString()}
        </button> <br /><br />

        <label>User Address: {userAddress}</label> <br />
        <label>Origin chain Id: {userChainId}</label> <br /><br />

        {userAddress && userChainId && 
        <ZodiacConnextWidget 
          originAddress={userAddress}
          userChainId={420}
          text="Open crosschain widget"
          modal={false}
          setTx={setTx}
          lightTheme={useLightTheme}
        />}
        
        <br />

        {userAddress && userChainId && 
        <textarea
          value={tx}
          onChange={(e) => setTx(e.target.value)}
          style={{ width: 500, height: 250 }}
          placeholder="{value: string; to: string; from: string; data: string;}"
        />}

      </div>
    </>
  )
}

export default App
