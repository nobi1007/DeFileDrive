/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
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
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
                />
            </Head>
            <a
                href="https://github.com/nobi1007/DeFileDrive"
                style={{ position: "absolute", right: "0px" }}
            >
                <img
                    decoding="async"
                    loading="lazy"
                    width="149"
                    height="149"
                    src="https://github.blog/wp-content/uploads/2008/12/forkme_right_white_ffffff.png?resize=149%2C149"
                    class="attachment-full size-full"
                    alt="Fork me on GitHub"
                    data-recalc-dims="1"
                />
            </a>
            <div className={styles["container"]}>
                <Header
                    handleConnectWallet={handleConnectWallet}
                    headerLabel={headerLabel}
                />
                <div className={styles["page-container"]}>{children}</div>
            </div>
            <Loader isLoading={isLoading} loadingText={loadingText} />
            <div className={styles["home-footer"]}>
                Made with
                <img
                    className={styles["footer-heart-icon"]}
                    src={
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABH0lEQVRIie2UsUoDQRCGv0sjlmkkFhICWthYBgutREVs9RHMK5mAaVPkLfQJbHyAcJ4IgkXEcCSQ3+YOBrN32UtWsMjAwDI39327c8fCJqqGoCXoCWLBTPAqeBDsm54DQT97Nst6u4LWMvil4EsgR04Fd4JOtnb1jAUXZTsvguc5z7KsZyxougS9JS9WyXuXIA4oGOXcyAhSYMvjP/CJNIJtgJopJoHgAHG+sILHgIKnhYrgOND854K2UysYBhAMCs8l2BG8rQF/FzRKhyc4FUxWgE8EJ15fSHAuSCvAp4JrL7iR3Kr4zvkNv6kEN5Izld9P34KrleBG0hZ8OOCf3jP3kBwKRgaeCI6CwI1kV/AseBHsBYUbSV1Q/xP4v40f2rifw+uaD5IAAAAASUVORK5CYII="
                    }
                    alt="heart"
                />
                {" by "}
                <a
                    href="https://github.com/nobi1007"
                    className={styles["user-link"]}
                >
                    {" nobi1007 "}
                </a>
            </div>
        </>
    );
}
