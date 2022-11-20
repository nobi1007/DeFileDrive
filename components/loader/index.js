import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import { loader1 } from "../../animations/loader1";
import styles from "./loader.module.css";

const thoughts = [
    "There's more to crypto than just coins",
    "Users trade with each other through their own wallets in DeX's",
    "Most NFTs are garbage",
    "Crypto exchanges are moving to the Bahamas and Singapore due to regulatory pressure",
    "A major part of crypto investments come from South Korea",
    "The metaverse can only operate on a network as free and open as Web3",
    "Ethereum supports both cryptocurrency and NFT systems",
    "Airdrop is a marketing technique in which crypto projects send their native tokens directly to the wallets of their users in an effort to increase awareness and adoption.",
    "Bear market is a prolonged period of decline in a financial market.",
    "Shitcoin is a cryptocurrency with weak fundamentals and little to no use case.",
];

const getRandomInt = () => {
    return Math.round(Math.random() * 1000) % 9;
};

export default function Loader({ isLoading, loadingText = "" }) {
    const [thought, setThought] = useState("");

    const changeThought = () => {
        setThought(thoughts[getRandomInt()]);
    };

    useEffect(() => {
        changeThought();
    }, []);

    return isLoading ? (
        <div
            className={styles["container"]}
            onClick={changeThought}
            title="Click to change"
        >
            <Lottie
                loop
                animationData={loader1}
                play
                className={styles["loader"]}
            />
            {!!loadingText && loadingText}
            {!!thought && (
                <div className={styles["loading-text"]}>
                    <span className={styles["neon-text"]}>
                        🤔 Did you know?
                    </span>
                    <span className={styles["sub-text"]}>{thought}</span>
                </div>
            )}
        </div>
    ) : null;
}
