import { useState, useEffect } from "react";
import { ZodiacConnextWidget } from "crosschain-widget";
import { providers } from "ethers";

import "./App.css";

function App() {
  const [useLightTheme, setUseLightTheme] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [userChainId, setUserChainId] = useState(1);
  const [useTestnet, setUseTestnet] = useState(true);
  const [tx, setTx] = useState("");
  const [signer, setSigner] = useState<providers.JsonRpcSigner | undefined>();
  const [provider, setProvider] = useState<
    providers.JsonRpcProvider | undefined
  >();

  const handleConnect = async () => {
    if (window?.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();
      const address = (await signer.getAddress()) || "";
      const chainId = (await signer.getChainId()) || 1;
      setSigner(signer);
      setProvider(provider);
      setUserChainId(chainId);
      setUserAddress(address);
    }
  };

  const detectChainChange = async () => {
    window?.ethereum.on("chainChanged", handleConnect);
  };

  useEffect(() => {
    detectChainChange();
    return () => {
      window.ethereum.removeListener("chainChanged", handleConnect);
    };
  }, []);

  // autoconnect on load
  useEffect(() => {
    handleConnect();
  }, []);

  return (
    <>
      <h1>Crosschain Widget Example</h1>

      <div className="card">
        <button onClick={() => handleConnect()}>Connect</button>
        <button onClick={() => setUseLightTheme(!useLightTheme)}>
          Light theme: {useLightTheme.toString()}
        </button>
        <button onClick={() => setUseTestnet(!useTestnet)}>
          Testnet: {useTestnet.toString()}
        </button>
        <br />
        <br />
        <label>User Address: {userAddress}</label> <br />
        <label>Origin chain Id: {userChainId}</label> <br />
        <br />
        {userAddress && userChainId && (
          <ZodiacConnextWidget
            originAddress={userAddress}
            userChainId={userChainId}
            text="Open crosschain widget"
            modal={false}
            setTx={setTx}
            provider={provider}
            lightTheme={useLightTheme}
            testnet={useTestnet}
          />
        )}
        <br />
        <br />
        <textarea
          value={tx}
          onChange={(e) => setTx(e.target.value)}
          style={{ width: 500, height: 250 }}
          placeholder="{value: string; to: string; from: string; data: string;}"
        />
        <br />
        {tx && (
          <button
            onClick={() => {
              signer?.sendTransaction(JSON.parse(tx));
            }}
          >
            Send tx
          </button>
        )}
        <br />
      </div>
    </>
  );
}

export default App;
