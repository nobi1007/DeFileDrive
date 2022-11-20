export const DE_FILE_DRIVE_CONTRACT =
    "0x5b8DfeA556e6EE8401Ea4C0884a5B43AE5462931";
export const ABI = [
    {
        inputs: [
            {
                internalType: "string",
                name: "groupId",
                type: "string",
            },
            {
                components: [
                    {
                        internalType: "string",
                        name: "fileName",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "fileDescription",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "fileCid",
                        type: "string",
                    },
                ],
                internalType: "struct DeFileDrive.FileInfo",
                name: "fileInfo",
                type: "tuple",
            },
        ],
        name: "addFileToGroup",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "groupId",
                type: "string",
            },
            {
                internalType: "address",
                name: "user2",
                type: "address",
            },
        ],
        name: "addUser",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "groupId",
                type: "string",
            },
        ],
        name: "createGroup",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "groupId",
                type: "string",
            },
        ],
        name: "getMyFilesByGroupId",
        outputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "fileName",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "fileDescription",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "fileCid",
                        type: "string",
                    },
                ],
                internalType: "struct DeFileDrive.FileInfo[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getMyGroups",
        outputs: [
            {
                internalType: "string[]",
                name: "",
                type: "string[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
