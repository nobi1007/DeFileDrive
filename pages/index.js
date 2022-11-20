/* eslint-disable @next/next/no-img-element */
import { Contract, providers } from "ethers";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ABI, DE_FILE_DRIVE_CONTRACT } from "../constants";
import Button from "../components/button";
import PageWrapper from "../components/page-wrapper";
import ReactModal from "react-modal";
import { useFilePicker } from "use-file-picker";
import { makeFileObjects, storeWithProgress } from "../utils";

export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingText, setLoadingText] = useState("");
    const [myGroups, setMyGroups] = useState(0);
    const web3modalRef = useRef();
    const [signerAddress, setSignerAddress] = useState("");
    const [groupOpen, setGroupOpen] = useState({
        id: null,
    });
    const [groupAssets, setGroupAssets] = useState({});
    const [toUploadFiles, setToUploadFiles] = useState([]);

    const [openFileSelector, { filesContent = {}, isFileInputLoading, clear }] =
        useFilePicker({
            accept: [".png"],
            readAs: "DataURL",
            multiple: false,
        });

    useEffect(() => {
        console.log(filesContent);
        if (!isFileInputLoading && !!filesContent.length) {
            setToUploadFiles(filesContent);
        }
    }, [filesContent, isFileInputLoading]);

    const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3modalRef.current.connect();
        const web3provider = new providers.Web3Provider(provider);

        const { chainId } = await web3provider.getNetwork();
        console.log(chainId, "this is my chain id");
        if (chainId !== 31415) {
            window.alert("Change the network to Wallaby Testnet");
            throw new Error("Change the network Wallaby Testnet");
        }

        if (needSigner) {
            const signer = web3provider.getSigner();
            return signer;
        }

        return web3provider;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getMyGroups();
        }, 10000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        let interval;
        if (groupOpen.id) {
            interval = setInterval(() => {
                getAssetsForGroup(groupOpen.id);
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [groupOpen.id]);

    const getMyGroups = async () => {
        try {
            const signer = await getProviderOrSigner(true);
            const myContract = new Contract(
                DE_FILE_DRIVE_CONTRACT,
                ABI,
                signer
            );
            const _myGroups = await myContract.getMyGroups();
            setMyGroups(_myGroups);
        } catch (err) {
            console.error(err);
        }
    };

    const createGroup = async (_groupId) => {
        try {
            const signer = await getProviderOrSigner(true);
            const myContract = new Contract(
                DE_FILE_DRIVE_CONTRACT,
                ABI,
                signer
            );
            await myContract.createGroup(_groupId);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingText("");
        }
    };

    const addFriend = async (_groupId, friendsAddress) => {
        try {
            const signer = await getProviderOrSigner(true);
            const myContract = new Contract(
                DE_FILE_DRIVE_CONTRACT,
                ABI,
                signer
            );
            await myContract.addUser(_groupId, friendsAddress);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingText("");
        }
    };

    const getAssetsForGroup = async (_groupId) => {
        try {
            const signer = await getProviderOrSigner(true);
            const myContract = new Contract(
                DE_FILE_DRIVE_CONTRACT,
                ABI,
                signer
            );
            const _myAssets = await myContract.getMyFilesByGroupId(_groupId);
            setGroupAssets(
                _myAssets.length
                    ? _myAssets.map((item) => ({
                          fileCid: item.fileCid,
                          fileDescription: item.fileDescription,
                          fileName: item.fileName,
                      }))
                    : []
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingText("");
        }
    };

    const getFileUrl = (cid, name) => {
        return `https://${cid}.ipfs.w3s.link/${name}`;
    };

    const addFileToGroup = async (_groupId, fileObject) => {
        try {
            const fileDescription =
                prompt(`Describe your file: ${fileObject.name}`) ||
                "Default file description";
            const files = await makeFileObjects([fileObject]);
            const rootCid = await storeWithProgress(files);

            const signer = await getProviderOrSigner(true);
            const myContract = new Contract(
                DE_FILE_DRIVE_CONTRACT,
                ABI,
                signer
            );
            await myContract.addFileToGroup(_groupId, [
                fileObject.name,
                fileDescription,
                rootCid,
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingText("");
        }
    };

    const connectWallet = async () => {
        try {
            const provider = await getProviderOrSigner(true);
            setSignerAddress(await provider?.getAddress());
            setWalletConnected(true);

            await getMyGroups();

            // checkIfAddressInWhitelist();
            // getNumberOfWhitelisted();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateGroupPress = () => {
        const groupName = prompt("Enter group name");
        if (groupName) {
            setLoading(true);
            setLoadingText(`Creating Group: ${groupName}`);
            createGroup(groupName);
        }
    };

    const handleSelectFilesPress = () => {
        console.log("file selector clicked");
        openFileSelector();
    };

    const handleUploadFilesPress = async (_filesToUpload) => {
        setLoading(true);
        setLoadingText("Uploading your file to IPFS and FileCoin");
        addFileToGroup(groupOpen.id, _filesToUpload[0]);
        handleCloseModal();
    };

    const handleAddFriendPress = () => {
        const friendAddress = prompt(
            "Enter friend's wallet address (with 0x appended)"
        );
        if (friendAddress) {
            setLoading(true);
            setLoadingText(
                `Adding address: xxx${signerAddress.substring(
                    37,
                    friendAddress.length
                )}`
            );
            addFriend(groupOpen.id, friendAddress);
        }
    };

    const handleOpenModal = async (_groupId) => {
        setGroupOpen({
            id: _groupId,
        });
        setLoading(true);
        setLoadingText("Fetching Assets");
        await getAssetsForGroup(_groupId);
    };

    const handleCloseModal = () => {
        clear();
        setToUploadFiles([]);
        setGroupOpen({
            id: null,
        });
    };

    useEffect(() => {
        if (!walletConnected) {
            web3modalRef.current = new Web3Modal();
            connectWallet();
        } else {
            setLoading(false);
            setLoadingText("");
        }
    }, [walletConnected]);

    const showConnectWalletCTA = !walletConnected || !signerAddress;
    // const isGroupsEmpty = !myGroups || myGroups.length === 0;
    const isGroupModalOpen = !!groupOpen.id;
    const isGroupsEmpty = true;

    return (
        <PageWrapper
            headerLabel={
                showConnectWalletCTA
                    ? "Connect Wallet"
                    : `Connected: xxx${signerAddress.substring(
                          37,
                          signerAddress.length
                      )}`
            }
            handleConnectWallet={connectWallet}
            isLoading={loading}
            loadingText={loadingText}
        >
            <>
                <div className={styles["header"]}>
                    <span>My Groups</span>
                    <Button
                        variant="secondary"
                        label={"+ Create Group"}
                        onPress={handleCreateGroupPress}
                    />
                </div>
                <div className={styles["group-container"]}>
                    {isGroupsEmpty ? (
                        <div className={styles["is-empty"]}>
                            <span className={styles["common-text"]}>
                                No group exists,{" "}
                                <span
                                    className={styles["create-text"]}
                                    title="Create Group"
                                    onClick={handleCreateGroupPress}
                                >
                                    create one?
                                </span>
                            </span>
                        </div>
                    ) : (
                        myGroups.map((eachGroup) => (
                            <div
                                key={eachGroup}
                                className={styles["each-group"]}
                                onClick={() => {
                                    handleOpenModal(eachGroup);
                                }}
                            >
                                <span className={styles["info-text"]}>
                                    {eachGroup}
                                </span>
                            </div>
                        ))
                    )}
                </div>
                <div className={styles["hiw-container"]}>
                    <h2>{"How it works?"}</h2>
                    <ul>
                        <li>Group creation: </li>
                        <ol>
                            <li>
                                After onboarding user first need to create
                                group.
                            </li>
                            <li>
                                Hit Create Group Button and provide some unique
                                groupId/group name.
                            </li>
                            <li>
                                After submitting, Sign the transaction and wait
                                for you group to be created.
                            </li>
                        </ol>
                    </ul>
                    <ul>
                        <li>Add Files: </li>
                        <ol>
                            <li>Click on your group.</li>
                            <li>
                                After Selecting files, firstly the files are
                                encrypted using encryption key associated with
                                the groupId.
                            </li>
                            <li>
                                The encrypted files are then uploaded on IPFS
                                and then on FileCoin via web.storage’s JS APIS
                            </li>
                            <li>
                                We receive the root CID of the uploaded file.
                            </li>
                            <li>
                                Using this CID we can access the encrypted file
                                and decrypt it, via the same encryption key, to
                                show under the Synced Files section.
                            </li>
                        </ol>
                    </ul>
                    <ul>
                        <li>Add Friends in the group:</li>
                        <ol>
                            <li>Click on your group.</li>
                            <li>
                                Hit Add Friend CTA and enter friend’s valid
                                wallet address
                            </li>
                            <li>
                                After submitting, Sign the transaction and wait
                                for your friend to get added to the group.
                            </li>
                            <li>
                                Your friend can now see the groups as well as
                                the files shared with them.
                            </li>
                        </ol>
                    </ul>
                </div>
                {isGroupModalOpen && (
                    <ReactModal
                        isOpen={isGroupModalOpen}
                        overlayClassName={styles["modal-background"]}
                        className={styles["modal"]}
                        shouldCloseOnOverlayClick
                        onRequestClose={handleCloseModal}
                        ariaHideApp={false}
                    >
                        <div className={styles["modal-close-wrapper"]}>
                            <img
                                src={"/close.png"}
                                onClick={handleCloseModal}
                            />
                        </div>
                        <div className={styles["header"]}>
                            <span>{groupOpen.id}</span>
                            <div className={styles["modal-btn-grp"]}>
                                <Button
                                    variant="secondary-sm"
                                    label={"+ Add Friend"}
                                    onPress={handleAddFriendPress}
                                />
                                <Button
                                    variant="secondary-sm"
                                    label={"Select File"}
                                    onPress={handleSelectFilesPress}
                                />
                            </div>
                        </div>
                        {!!toUploadFiles.length && (
                            <div className={styles["modal-section"]}>
                                <span className={styles["modal-section-text"]}>
                                    Selected Files
                                </span>
                                <div className={styles["modal-section-items"]}>
                                    {toUploadFiles.map((each) => (
                                        <div
                                            className={
                                                styles[
                                                    "modal-section-items-each"
                                                ]
                                            }
                                            key={each.name}
                                        >
                                            <img src={each.content} />
                                            <span>{each.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="third-sm"
                                    label={"Upload Selected Files"}
                                    onPress={() => {
                                        handleUploadFilesPress(toUploadFiles);
                                    }}
                                />
                            </div>
                        )}
                        {!!groupAssets.length ? (
                            <div className={styles["modal-section"]}>
                                <span className={styles["modal-section-text"]}>
                                    Synced Files
                                </span>
                                <div className={styles["modal-section-items"]}>
                                    {groupAssets.map((each) => (
                                        <div
                                            className={
                                                styles[
                                                    "modal-section-items-each"
                                                ]
                                            }
                                            key={each.name}
                                        >
                                            <img
                                                src={getFileUrl(
                                                    each.fileCid,
                                                    each.fileName
                                                )}
                                                alt={each.fileName}
                                            />
                                            <span
                                                className={
                                                    styles[
                                                        "modal-synced-item-name"
                                                    ]
                                                }
                                            >
                                                {each.fileName}
                                            </span>
                                            <span
                                                className={
                                                    styles[
                                                        "modal-synced-item-description"
                                                    ]
                                                }
                                            >
                                                {each.fileDescription}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className={styles["is-empty"]}>
                                <span className={styles["common-text"]}>
                                    No Files exists,{" "}
                                    <span
                                        className={styles["create-text"]}
                                        title="Select File"
                                        onClick={handleSelectFilesPress}
                                    >
                                        select files to proceed.
                                    </span>
                                </span>
                            </div>
                        )}
                    </ReactModal>
                )}
            </>
        </PageWrapper>
    );
}
