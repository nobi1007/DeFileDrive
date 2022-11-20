import Button from "../button";
import styles from "./header.module.css";

export default function Header({ handleConnectWallet, headerLabel }) {
    return (
        <div className={styles["header"]}>
            <div className={styles["left"]}>
                <div className={styles["logo-title"]}>
                    <img src={"/logo.svg"} />
                    <span>
                        <span style={{ color: "#8D72E1" }}>De-Fi</span>le Drive
                    </span>
                </div>
                <p>
                    A GoogleDrive/Dropbox for files but decentralised powered
                    with e2e file encryption, private group creation for your
                    friends and file sharing with no link management hassle!
                </p>
            </div>
            <div className={styles["right"]}>
                <Button label={headerLabel} onPress={handleConnectWallet} />
            </div>
        </div>
    );
}
