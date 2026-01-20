import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import API_BASE_URL from '../config';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [network, setNetwork] = useState(null);

    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const _provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await _provider.listAccounts();
                    if (accounts.length > 0) {
                        const _signer = await _provider.getSigner();
                        const _network = await _provider.getNetwork();
                        setAccount(accounts[0].address);
                        setProvider(_provider);
                        setSigner(_signer);
                        setNetwork(_network);
                    }
                } catch (error) {
                    console.error("Auto-connect error:", error);
                }
            }
        };

        // Small delay to ensure MetaMask injection
        const timer = setTimeout(checkConnection, 500);
        return () => clearTimeout(timer);
    }, []);

    const connectWallet = async () => {
        console.log("Attempting to connect wallet...");
        if (typeof window.ethereum !== 'undefined') {
            try {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await _provider.send("eth_requestAccounts", []);
                const _signer = await _provider.getSigner();
                const _network = await _provider.getNetwork();

                const walletAddress = accounts[0];

                // --- SIWE (Sign-In With Ethereum) Logic ---
                try {
                    const message = `Login to ProofLearn. Timestamp: ${Date.now()}`;
                    const signature = await _signer.signMessage(message);

                    // Verify with Backend
                    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ walletAddress, signature, message })
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.message || "Login failed");
                    }

                    const userData = await response.json();
                    console.log("Backend Auth Success:", userData);

                    setAccount(walletAddress);
                    setProvider(_provider);
                    setSigner(_signer);
                    setNetwork(_network);

                } catch (authError) {
                    console.error("Authentication Failed:", authError);
                    alert(`Authentication Failed: ${authError.message}`);
                    return; // Stop connection if auth fails
                }

            } catch (error) {
                console.error("Wallet connection error:", error);
                if (error.code === 4001) {
                    alert("Connection rejected by user.");
                } else {
                    alert("An error occurred during wallet connection.");
                }
            }
        } else {
            console.warn("MetaMask not found");
            alert("Please install MetaMask to use this feature!");
        }
    };

    const logout = () => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setNetwork(null);
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    logout();
                }
            });
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, []);

    return (
        <Web3Context.Provider value={{ account, provider, signer, network, connectWallet, logout }}>
            {children}
        </Web3Context.Provider>
    );
};
