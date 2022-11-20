import Button from "../button";
import styles from "./header.module.css";

export default function Header({ handleConnectWallet, headerLabel }) {
    return (
        <div className={styles["header"]}>
            <div className={styles["left"]}>
                <img src={"/logo.svg"} />
                <span>De-File Drive</span>
            </div>
            <div className={styles["right"]}>
                <Button label={headerLabel} onPress={handleConnectWallet} />
            </div>
        </div>
    );
}
