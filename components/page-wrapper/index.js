import Header from "../header";
import Loader from "../loader";
import styles from "./page-wrapper.module.css";

export default function PageWrapper({
    children,
    handleConnectWallet,
    headerLabel,
    isLoading,
    loadingText,
}) {
    return (
        <>
            <div className={styles["container"]}>
                <Header
                    handleConnectWallet={handleConnectWallet}
                    headerLabel={headerLabel}
                />
                <div className={styles["page-container"]}>{children}</div>
            </div>
            <Loader isLoading={isLoading} loadingText={loadingText} />
        </>
    );
}
